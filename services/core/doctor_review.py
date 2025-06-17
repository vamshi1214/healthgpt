from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class DoctorReview(Table):
    __tablename__ = "doctor_reviews"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    
    # Review details
    doctor_id: uuid.UUID  # Reference to doctor
    appointment_id: Optional[uuid.UUID] = None  # Reference to appointment if available
    
    # Patient information (anonymized)
    patient_name: Optional[str] = None  # Can be anonymous
    patient_email: Optional[str] = None
    verified_patient: bool = False  # Whether this was a real appointment
    
    # Rating details
    overall_rating: int  # 1-5 scale
    communication_rating: Optional[int] = None  # 1-5 scale
    bedside_manner_rating: Optional[int] = None  # 1-5 scale
    wait_time_rating: Optional[int] = None  # 1-5 scale
    office_staff_rating: Optional[int] = None  # 1-5 scale
    
    # Review content
    review_title: Optional[str] = None
    review_text: Optional[str] = None
    condition_treated: Optional[str] = None  # What condition was treated
    visit_type: Optional[str] = None  # "routine", "emergency", "consultation"
    
    # Visit experience
    wait_time_minutes: Optional[int] = None
    appointment_on_time: Optional[bool] = None
    would_recommend: bool = True
    
    # Review metadata
    helpful_votes: int = 0
    total_votes: int = 0
    flagged_inappropriate: bool = False
    moderator_approved: bool = True
    
    # System fields
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    last_updated: datetime = ColumnDetails(default_factory=datetime.now)
    is_active: bool = True