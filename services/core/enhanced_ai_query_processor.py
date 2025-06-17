"""
Enhanced AI Query Processor with Advanced Medical Understanding
Provides sophisticated medical intent analysis and doctor ranking explanations
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import os
import requests
import json
import re
from solar.access import public

@dataclass
class EnhancedMedicalAnalysis:
    """Enhanced medical analysis with detailed explanations"""
    urgency_level: str
    specialties: List[str]
    symptoms: List[str]
    conditions: List[str]
    emergency_indicators: List[str]
    confidence_score: float
    reasoning: str
    extracted_location: Optional[str]
    extracted_insurance: Optional[str]
    extracted_preferences: List[str]
    appointment_urgency: str
    red_flags: List[str]
    
@dataclass  
class DoctorRankingExplanation:
    """Detailed explanation of doctor ranking logic"""
    doctor_id: str
    rank: int
    overall_score: float
    factor_scores: Dict[str, float]
    match_reasons: List[str]
    ranking_explanation: str
    confidence_level: str

def analyze_medical_query_enhanced(query: str) -> EnhancedMedicalAnalysis:
    """Enhanced medical query analysis with sophisticated AI reasoning"""
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        raise ValueError("OPENROUTER_API_KEY environment variable is required")
    
    # Enhanced system prompt for sophisticated medical understanding
    system_prompt = """You are an expert medical AI assistant with deep knowledge of:
- Medical specialties and subspecialties
- Symptom patterns and disease associations
- Emergency vs. routine care indicators
- Healthcare system navigation
- Insurance and practical considerations

Analyze the patient query and provide comprehensive medical intelligence.

CRITICAL SAFETY: If you detect any emergency symptoms (chest pain, difficulty breathing, severe injuries, mental health crisis, etc.), mark urgency as "emergency" and include specific emergency indicators.

Extract and analyze:
1. Medical urgency (emergency/urgent/routine)
2. Symptoms and conditions mentioned
3. Appropriate medical specialties
4. Location/insurance/timing preferences
5. Red flags requiring immediate attention
6. Confidence in your analysis

Respond in JSON format only."""

    user_prompt = f"""Analyze this medical query with maximum precision:

Query: "{query}"

Provide detailed analysis in this JSON structure:
{{
    "urgency_level": "emergency|urgent|routine",
    "specialties": ["primary specialty", "secondary specialty"],
    "symptoms": ["symptom1", "symptom2"],
    "conditions": ["possible condition1", "possible condition2"],
    "emergency_indicators": ["red flag 1", "red flag 2"],
    "confidence_score": 0.95,
    "reasoning": "Detailed explanation of analysis",
    "extracted_location": "City, State if mentioned",
    "extracted_insurance": "Insurance provider if mentioned",
    "extracted_preferences": ["preference1", "preference2"],
    "appointment_urgency": "same-day|this-week|routine",
    "red_flags": ["concerning symptom requiring immediate attention"]
}}

Focus on patient safety - err on the side of caution for emergency detection."""

    try:
        response = requests.post(
            "https://openrouter.ai/api/v1/chat/completions",
            headers={
                "Authorization": f"Bearer {api_key}",
                "Content-Type": "application/json"
            },
            json={
                "model": "anthropic/claude-3.5-sonnet",
                "messages": [
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                "temperature": 0.1,
                "max_tokens": 1000
            },
            timeout=30
        )
        
        if response.status_code != 200:
            raise Exception(f"OpenRouter API error: {response.status_code} - {response.text}")
        
        ai_response = response.json()["choices"][0]["message"]["content"]
        
        # Clean and parse JSON response
        json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
        if json_match:
            analysis_data = json.loads(json_match.group())
        else:
            analysis_data = json.loads(ai_response)
        
        return EnhancedMedicalAnalysis(
            urgency_level=analysis_data.get("urgency_level", "routine"),
            specialties=analysis_data.get("specialties", []),
            symptoms=analysis_data.get("symptoms", []),
            conditions=analysis_data.get("conditions", []),
            emergency_indicators=analysis_data.get("emergency_indicators", []),
            confidence_score=analysis_data.get("confidence_score", 0.8),
            reasoning=analysis_data.get("reasoning", "Analysis completed"),
            extracted_location=analysis_data.get("extracted_location"),
            extracted_insurance=analysis_data.get("extracted_insurance"),
            extracted_preferences=analysis_data.get("extracted_preferences", []),
            appointment_urgency=analysis_data.get("appointment_urgency", "routine"),
            red_flags=analysis_data.get("red_flags", [])
        )
        
    except Exception as e:
        print(f"Enhanced AI analysis error: {e}")
        # Fallback analysis
        return _fallback_analysis(query)

def _fallback_analysis(query: str) -> EnhancedMedicalAnalysis:
    """Fallback analysis using pattern matching"""
    query_lower = query.lower()
    
    # Emergency keyword detection
    emergency_keywords = [
        'chest pain', 'heart attack', 'stroke', 'difficulty breathing', 'can\'t breathe',
        'severe pain', 'bleeding heavily', 'unconscious', 'overdose', 'suicide',
        'severe allergic reaction', 'anaphylaxis', 'head injury', 'broken bone'
    ]
    
    emergency_indicators = [keyword for keyword in emergency_keywords if keyword in query_lower]
    urgency_level = "emergency" if emergency_indicators else "routine"
    
    # Specialty detection
    specialty_keywords = {
        'cardiology': ['heart', 'chest pain', 'cardiac', 'blood pressure'],
        'dermatology': ['skin', 'rash', 'acne', 'mole', 'dermatologist'],
        'orthopedics': ['bone', 'joint', 'fracture', 'sports injury', 'back pain'],
        'neurology': ['headache', 'migraine', 'neurologist', 'brain', 'seizure'],
        'pediatrics': ['child', 'kid', 'pediatrician', 'baby', 'infant'],
        'psychiatry': ['depression', 'anxiety', 'mental health', 'psychiatrist'],
        'family medicine': ['general', 'family doctor', 'primary care', 'checkup']
    }
    
    detected_specialties = []
    for specialty, keywords in specialty_keywords.items():
        if any(keyword in query_lower for keyword in keywords):
            detected_specialties.append(specialty.title())
    
    if not detected_specialties:
        detected_specialties = ['Family Medicine']
    
    return EnhancedMedicalAnalysis(
        urgency_level=urgency_level,
        specialties=detected_specialties,
        symptoms=[],
        conditions=[],
        emergency_indicators=emergency_indicators,
        confidence_score=0.7,
        reasoning="Pattern-based analysis completed",
        extracted_location=None,
        extracted_insurance=None,
        extracted_preferences=[],
        appointment_urgency="routine",
        red_flags=emergency_indicators
    )

@public
def explain_doctor_ranking(query: str, doctors: List[Dict], analysis: Dict) -> List[DoctorRankingExplanation]:
    """
    Provide detailed explanation of why doctors are ranked in a specific order
    and what factors contribute to their match scores
    """
    
    api_key = os.getenv("OPENROUTER_API_KEY")
    if not api_key:
        # Fallback to basic explanations
        return _basic_ranking_explanation(doctors, analysis)
    
    # AI-powered ranking explanation
    system_prompt = """You are a medical AI that explains doctor ranking logic to patients in clear, helpful language. 

Analyze the patient query, doctor profiles, and matching algorithm to explain:
1. Why each doctor is ranked where they are
2. What specific factors made them a good match
3. How the ranking algorithm weighs different criteria
4. What patients should consider when choosing

Be transparent, educational, and help patients make informed decisions."""

    rankings = []
    
    for rank, doctor in enumerate(doctors, 1):
        user_prompt = f"""
Patient Query: "{query}"
AI Analysis: {json.dumps(analysis)}

Doctor Profile:
- Name: {doctor.get('name')}
- Specialties: {doctor.get('specialties', [])}
- Rating: {doctor.get('overall_rating')}
- Experience: {doctor.get('years_in_practice')} years
- Location: {doctor.get('practice_city')}, {doctor.get('practice_state')}
- Match Score: {doctor.get('match_score', 0) * 100:.0f}%
- New Patients: {doctor.get('new_patient_accepting')}
- Telehealth: {doctor.get('telehealth_available')}

Explain in JSON format why this doctor is ranked #{rank}:
{{
    "overall_score": {doctor.get('match_score', 0)},
    "factor_scores": {{
        "specialty_match": 0.9,
        "experience": 0.8,
        "rating": 0.85,
        "availability": 0.7,
        "location": 0.6
    }},
    "match_reasons": ["reason 1", "reason 2", "reason 3"],
    "ranking_explanation": "Clear explanation of why this doctor is ranked here",
    "confidence_level": "high|medium|low"
}}
"""

        try:
            response = requests.post(
                "https://openrouter.ai/api/v1/chat/completions",
                headers={
                    "Authorization": f"Bearer {api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": "anthropic/claude-3.5-sonnet",
                    "messages": [
                        {"role": "system", "content": system_prompt},
                        {"role": "user", "content": user_prompt}
                    ],
                    "temperature": 0.1,
                    "max_tokens": 500
                },
                timeout=20
            )
            
            if response.status_code == 200:
                ai_response = response.json()["choices"][0]["message"]["content"]
                json_match = re.search(r'\{.*\}', ai_response, re.DOTALL)
                if json_match:
                    explanation_data = json.loads(json_match.group())
                    
                    rankings.append(DoctorRankingExplanation(
                        doctor_id=doctor.get('id', ''),
                        rank=rank,
                        overall_score=explanation_data.get('overall_score', doctor.get('match_score', 0)),
                        factor_scores=explanation_data.get('factor_scores', {}),
                        match_reasons=explanation_data.get('match_reasons', []),
                        ranking_explanation=explanation_data.get('ranking_explanation', ''),
                        confidence_level=explanation_data.get('confidence_level', 'medium')
                    ))
                    continue
            
        except Exception as e:
            print(f"Ranking explanation error for doctor {rank}: {e}")
        
        # Fallback explanation for this doctor
        rankings.append(_basic_doctor_explanation(doctor, rank, analysis))
    
    return rankings

def _basic_ranking_explanation(doctors: List[Dict], analysis: Dict) -> List[DoctorRankingExplanation]:
    """Basic ranking explanation without AI"""
    rankings = []
    
    for rank, doctor in enumerate(doctors, 1):
        rankings.append(_basic_doctor_explanation(doctor, rank, analysis))
    
    return rankings

def _basic_doctor_explanation(doctor: Dict, rank: int, analysis: Dict) -> DoctorRankingExplanation:
    """Generate basic explanation for a single doctor"""
    
    # Calculate factor scores based on available data
    specialty_match = 0.9 if any(spec.lower() in [s.lower() for s in analysis.get('specialties', [])] 
                                 for spec in doctor.get('specialties', [])) else 0.6
    
    rating_score = (doctor.get('overall_rating', 3.0) - 3.0) / 2.0  # Normalize 3-5 to 0-1
    experience_score = min(doctor.get('years_in_practice', 0) / 20.0, 1.0)  # Cap at 20 years
    availability_score = 0.8 if doctor.get('new_patient_accepting') else 0.3
    
    match_reasons = []
    if specialty_match > 0.8:
        match_reasons.append(f"Perfect specialty match: {', '.join(doctor.get('specialties', []))}")
    if doctor.get('overall_rating', 0) >= 4.5:
        match_reasons.append(f"Excellent patient ratings ({doctor.get('overall_rating')} stars)")
    if doctor.get('years_in_practice', 0) >= 10:
        match_reasons.append(f"Experienced practitioner ({doctor.get('years_in_practice')} years)")
    if doctor.get('new_patient_accepting'):
        match_reasons.append("Currently accepting new patients")
    if doctor.get('telehealth_available'):
        match_reasons.append("Telehealth options available")
    
    ranking_explanation = f"Ranked #{rank} based on strong specialty alignment, " + \
                         f"{'excellent' if doctor.get('overall_rating', 0) >= 4.5 else 'good'} patient reviews, " + \
                         f"and {doctor.get('years_in_practice', 0)} years of experience."
    
    return DoctorRankingExplanation(
        doctor_id=doctor.get('id', ''),
        rank=rank,
        overall_score=doctor.get('match_score', 0),
        factor_scores={
            'specialty_match': specialty_match,
            'rating': rating_score,
            'experience': experience_score,
            'availability': availability_score,
            'location': 0.7  # Default
        },
        match_reasons=match_reasons,
        ranking_explanation=ranking_explanation,
        confidence_level='medium'
    )