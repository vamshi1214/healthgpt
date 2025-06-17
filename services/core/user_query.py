from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class UserQuery(Table):
    __tablename__ = "user_queries"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    
    # Query input
    original_query: str  # User's natural language input
    user_location: Optional[str] = None  # City, address, or "current location"
    user_latitude: Optional[float] = None
    user_longitude: Optional[float] = None
    
    # AI extraction results
    extracted_symptoms: Optional[List[str]] = None
    extracted_conditions: Optional[List[str]] = None
    extracted_specialties: Optional[List[str]] = None
    urgency_level: Optional[str] = None  # "emergency", "urgent", "routine"
    appointment_type: Optional[str] = None  # "consultation", "follow-up", "routine"
    
    # User preferences
    preferred_distance_miles: Optional[int] = None
    insurance_provider: Optional[str] = None
    insurance_plan: Optional[str] = None
    language_preference: Optional[str] = None
    gender_preference: Optional[str] = None
    
    # Search results
    search_results_count: Optional[int] = None
    top_doctor_id: Optional[uuid.UUID] = None  # Reference to selected doctor
    
    # Session tracking
    session_id: Optional[str] = None
    user_agent: Optional[str] = None
    ip_address: Optional[str] = None
    
    # Feedback
    result_rating: Optional[int] = None  # 1-5 scale
    feedback_text: Optional[str] = None
    appointment_booked: bool = False
    
    created_at: datetime = ColumnDetails(default_factory=datetime.now)