from openai import OpenAI
import os
import json
from typing import List, Dict, Optional, Tuple
from core.medical_specialty import MedicalSpecialty
from core.user_query import UserQuery
import uuid

# Initialize OpenAI client for OpenRouter
client = OpenAI(
    base_url="https://openrouter.ai/api/v1",
    api_key=os.getenv("OPENROUTER_API_KEY"),
)

class QueryAnalysis:
    def __init__(self):
        self.symptoms: List[str] = []
        self.conditions: List[str] = []
        self.specialties: List[str] = []
        self.urgency_level: str = "routine"
        self.appointment_type: str = "consultation"
        self.body_parts: List[str] = []
        self.emergency_indicators: List[str] = []

def analyze_medical_query(user_input: str) -> QueryAnalysis:
    """
    Use AI to analyze a user's natural language medical query and extract
    relevant medical information including symptoms, conditions, specialties needed.
    """
    
    # Get medical specialties from database for context
    specialties_data = MedicalSpecialty.sql("SELECT name, common_keywords, related_symptoms, related_conditions, emergency_keywords, urgent_keywords FROM medical_specialties WHERE is_active = true")
    specialty_context = "\n".join([
        f"- {spec['name']}: treats {', '.join(spec['related_symptoms'][:5])} | emergency signs: {', '.join(spec.get('emergency_keywords', [])[:3])}"
        for spec in specialties_data[:20]  # Limit context size
    ])
    
    prompt = f"""You are an advanced medical AI assistant that performs sophisticated analysis of patient queries, similar to how Juicebox analyzes talent profiles. Your analysis should be comprehensive, nuanced, and intelligent.

Available Medical Specialties:
{specialty_context}

ANALYSIS FRAMEWORK:
1. Deep Intent Understanding: Go beyond surface keywords to understand the patient's true needs
2. Context Awareness: Consider implied symptoms, age factors, lifestyle indicators  
3. Risk Assessment: Evaluate urgency with medical precision
4. Specialist Matching: Rank specialties by relevance and necessity
5. Care Pathway: Determine optimal appointment timing and type

Analyze this patient query: "{user_input}"

Extract and categorize with sophisticated medical reasoning:
1. Symptoms mentioned (specific physical complaints)
2. Medical conditions mentioned (potential diagnoses)
3. Relevant medical specialties (ranked by importance)
4. Urgency level (emergency, urgent, routine)
5. Appointment type (emergency, same_day, within_week, routine)
6. Body parts/systems involved
7. Emergency indicators (life-threatening symptoms)
8. Confidence score for analysis (0.0-1.0)
9. Reasoning for specialty recommendations
10. Secondary specialties that might be relevant

EMERGENCY INDICATORS: chest pain, difficulty breathing, shortness of breath, severe bleeding, loss of consciousness, stroke symptoms, severe burns, severe allergic reactions.

Provide intelligent, context-aware medical analysis."""

    try:
        response = client.chat.completions.create(
            model="openai/gpt-4o-mini",
            messages=[
                {"role": "system", "content": "You are a medical AI that extracts structured information from patient queries."},
                {"role": "user", "content": prompt}
            ],
            response_format={
                "type": "json_schema",
                "json_schema": {
                    "name": "medical_analysis",
                    "strict": True,
                    "schema": {
                        "type": "object",
                        "properties": {
                            "symptoms": {
                                "type": "array",
                                "description": "List of specific symptoms mentioned",
                                "items": {"type": "string"}
                            },
                            "conditions": {
                                "type": "array", 
                                "description": "List of medical conditions mentioned",
                                "items": {"type": "string"}
                            },
                            "specialties": {
                                "type": "array",
                                "description": "List of relevant medical specialties",
                                "items": {"type": "string"}
                            },
                            "urgency_level": {
                                "type": "string",
                                "description": "Level of medical urgency",
                                "enum": ["emergency", "urgent", "routine"]
                            },
                            "appointment_type": {
                                "type": "string",
                                "description": "Type of medical appointment needed",
                                "enum": ["emergency", "same_day", "within_week", "routine"]
                            },
                            "body_parts": {
                                "type": "array",
                                "description": "Body parts or systems involved",
                                "items": {"type": "string"}
                            },
                            "emergency_indicators": {
                                "type": "array",
                                "description": "Any emergency warning signs detected",
                                "items": {"type": "string"}
                            },
                            "confidence_score": {
                                "type": "number",
                                "description": "Confidence level of analysis (0.0-1.0)",
                                "minimum": 0.0,
                                "maximum": 1.0
                            },
                            "reasoning": {
                                "type": "array",
                                "description": "Brief explanations for specialty recommendations",
                                "items": {"type": "string"}
                            },
                            "secondary_specialties": {
                                "type": "array", 
                                "description": "Additional relevant specialties",
                                "items": {"type": "string"}
                            }
                        },
                        "required": ["symptoms", "conditions", "specialties", "urgency_level", "appointment_type", "body_parts", "emergency_indicators", "confidence_score", "reasoning", "secondary_specialties"],
                        "additionalProperties": False
                    }
                }
            }
        )
        
        result = json.loads(response.choices[0].message.content)
        
        # Create QueryAnalysis object
        analysis = QueryAnalysis()
        analysis.symptoms = result.get("symptoms", [])
        analysis.conditions = result.get("conditions", [])
        analysis.specialties = result.get("specialties", [])
        analysis.urgency_level = result.get("urgency_level", "routine")
        analysis.appointment_type = result.get("appointment_type", "consultation")
        analysis.body_parts = result.get("body_parts", [])
        analysis.emergency_indicators = result.get("emergency_indicators", [])
        
        return analysis
        
    except Exception as e:
        # Fallback analysis if AI fails
        analysis = QueryAnalysis()
        analysis.urgency_level = "routine"
        analysis.appointment_type = "consultation"
        
        # Basic keyword matching as fallback
        lower_input = user_input.lower()
        if any(word in lower_input for word in ["emergency", "severe", "can't breathe", "chest pain", "unconscious"]):
            analysis.urgency_level = "emergency"
            analysis.appointment_type = "emergency"
        elif any(word in lower_input for word in ["urgent", "persistent", "getting worse", "fever"]):
            analysis.urgency_level = "urgent"
            
        return analysis

def save_query_analysis(user_input: str, analysis: QueryAnalysis, user_location: Optional[str] = None,
                       latitude: Optional[float] = None, longitude: Optional[float] = None) -> str:
    """
    Save the user query and analysis results to the database.
    Returns the query ID for tracking.
    """
    
    query = UserQuery(
        original_query=user_input,
        user_location=user_location,
        user_latitude=latitude,
        user_longitude=longitude,
        extracted_symptoms=analysis.symptoms,
        extracted_conditions=analysis.conditions,
        extracted_specialties=analysis.specialties,
        urgency_level=analysis.urgency_level,
        appointment_type=analysis.appointment_type
    )
    
    query.sync()
    return str(query.id)