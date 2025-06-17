from solar import Table, ColumnDetails
from typing import Optional, List, Dict
from datetime import datetime
import uuid

class Appointment(Table):
    __tablename__ = "appointments"
    
    id: uuid.UUID = ColumnDetails(default_factory=uuid.uuid4, primary_key=True)
    
    # Core appointment details
    doctor_id: uuid.UUID  # Reference to doctor
    patient_name: str
    patient_email: str
    patient_phone: str
    
    # Appointment scheduling
    appointment_datetime: datetime
    duration_minutes: int = 30
    appointment_type: str  # "consultation", "follow-up", "routine", "urgent"
    visit_type: str = "in-person"  # "in-person", "telehealth"
    
    # Patient information
    chief_complaint: str  # Main reason for visit
    symptoms_description: Optional[str] = None
    insurance_provider: Optional[str] = None
    insurance_plan: Optional[str] = None
    insurance_id: Optional[str] = None
    
    # Appointment status
    status: str = "scheduled"  # "scheduled", "confirmed", "completed", "cancelled", "no-show"
    confirmation_sent: bool = False
    reminder_sent: bool = False
    
    # Visit details
    check_in_time: Optional[datetime] = None
    check_out_time: Optional[datetime] = None
    visit_notes: Optional[str] = None
    follow_up_required: bool = False
    follow_up_in_days: Optional[int] = None
    
    # Payment information
    estimated_cost: Optional[float] = None
    copay_amount: Optional[float] = None
    payment_status: str = "pending"  # "pending", "paid", "insurance_billed"
    
    # Cancellation details
    cancelled_at: Optional[datetime] = None
    cancellation_reason: Optional[str] = None
    cancelled_by: Optional[str] = None  # "patient", "doctor", "system"
    
    # System fields
    created_at: datetime = ColumnDetails(default_factory=datetime.now)
    last_updated: datetime = ColumnDetails(default_factory=datetime.now)
    
    # Related query tracking
    source_query_id: Optional[uuid.UUID] = None  # Link back to original search