from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class MedicalSpecialty(Table):
    __tablename__ = "medical_specialties"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    
    # Specialty information
    name: str  # "Cardiology", "Dermatology", etc.
    description: str
    category: str  # "Primary Care", "Medical Specialty", "Surgical Specialty"
    
    # Keywords for AI matching
    common_keywords: List[str]  # Keywords that suggest this specialty
    related_symptoms: List[str]  # Symptoms commonly treated
    related_conditions: List[str]  # Conditions commonly treated
    body_parts: List[str]  # Body parts/systems this specialty covers
    
    # Urgency indicators
    emergency_keywords: Optional[List[str]] = None  # Keywords that suggest emergency
    urgent_keywords: Optional[List[str]] = None  # Keywords that suggest urgency
    
    # Specialty relationships
    parent_specialty: Optional[str] = None  # For subspecialties
    related_specialties: Optional[List[str]] = None  # Often referred to/from
    
    # System fields
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    last_updated: datetime = ColumnDetails(default_factory=datetime.now)
    is_active: bool = True