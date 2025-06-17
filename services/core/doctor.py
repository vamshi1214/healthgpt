from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class Doctor(Table):
    __tablename__ = "doctors"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    name: str
    email: str
    phone: str
    
    # Medical credentials
    medical_license_number: str
    specialties: List[str]  # Primary specialties
    subspecialties: Optional[List[str]] = None  # Subspecialties
    board_certifications: List[str]
    medical_school: str
    residency: Optional[str] = None
    fellowships: Optional[List[str]] = None
    years_in_practice: int
    
    # Practice information
    practice_name: str
    practice_address: str
    practice_city: str
    practice_state: str
    practice_zip: str
    practice_latitude: float
    practice_longitude: float
    office_hours: Dict  # JSON object with schedule
    languages_spoken: List[str]
    
    # Professional details
    conditions_treated: List[str]  # Common conditions this doctor treats
    procedures_performed: Optional[List[str]] = None  # Procedures they perform
    hospital_affiliations: Optional[List[str]] = None
    insurance_networks: List[str]  # Insurance plans accepted
    
    # Patient experience
    overall_rating: Optional[float] = None  # 1-5 scale
    total_reviews: Optional[int] = 0
    telehealth_available: bool = False
    new_patient_accepting: bool = True
    
    # Availability
    next_available_appointment: Optional[datetime] = None
    average_wait_time_days: Optional[int] = None
    
    # Verification status
    credentials_verified: bool = False
    license_active: bool = True
    last_credential_check: datetime = ColumnDetails(default_factory=datetime.now)
    
    # System fields
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    last_updated: datetime = ColumnDetails(default_factory=datetime.now)
    is_active: bool = True