from typing import List, Dict, Optional
from solar.access import public
from core.ai_query_processor import analyze_medical_query
from core.enhanced_ai_query_processor import analyze_medical_query_enhanced, explain_doctor_ranking
from core.doctor_search import search_doctors, DoctorMatch
from core.doctor import Doctor
from core.appointment import Appointment
from core.user_query import UserQuery
from core.doctor_review import DoctorReview
import uuid
from datetime import datetime, timedelta

@public
def find_doctors(query: str, user_location: Optional[str] = None, 
                user_latitude: Optional[float] = None, user_longitude: Optional[float] = None,
                max_distance_miles: int = 25, insurance_provider: Optional[str] = None) -> Dict:
    """
    Main endpoint for finding doctors based on natural language query.
    Returns ranked list of doctors with match explanations.
    """
    
    # Analyze the user's query with enhanced AI
    try:
        enhanced_analysis = analyze_medical_query_enhanced(query)
        # Convert to legacy format for compatibility  
        analysis = MedicalQueryAnalysis(
            urgency_level=enhanced_analysis.urgency_level,
            specialties=enhanced_analysis.specialties,
            symptoms=enhanced_analysis.symptoms,
            conditions=enhanced_analysis.conditions,
            emergency_indicators=enhanced_analysis.emergency_indicators,
            confidence_score=enhanced_analysis.confidence_score,
            reasoning=enhanced_analysis.reasoning,
            appointment_type="consultation"
        )
    except Exception as e:
        print(f"Enhanced AI analysis failed, using basic AI: {e}")
        try:
            analysis = analyze_medical_query(query)
        except Exception as e2:
            print(f"Basic AI analysis also failed, using fallback: {e2}")
            analysis = MedicalQueryAnalysis(
                urgency_level="routine",
                specialties=["Family Medicine"],
                symptoms=[],
                conditions=[],
                emergency_indicators=[],
                confidence_score=0.5,
                reasoning="Fallback analysis due to AI processing error",
                appointment_type="consultation"
            )
    
    # Save the query for tracking and learning
    from core.ai_query_processor import save_query_analysis
    query_id = save_query_analysis(query, analysis, user_location, user_latitude, user_longitude)
    
    # Search for matching doctors
    doctor_matches = search_doctors(
        analysis, user_latitude, user_longitude, 
        max_distance_miles, insurance_provider, limit=20
    )
    
    # Format response
    results = []
    for match in doctor_matches:
        doctor_data = {
            "doctor_id": str(match.doctor.id),
            "name": match.doctor.name,
            "specialties": match.doctor.specialties,
            "practice_name": match.doctor.practice_name,
            "practice_address": match.doctor.practice_address,
            "practice_city": match.doctor.practice_city,
            "practice_state": match.doctor.practice_state,
            "phone": match.doctor.phone,
            "overall_rating": match.doctor.overall_rating,
            "total_reviews": match.doctor.total_reviews,
            "years_in_practice": match.doctor.years_in_practice,
            "new_patient_accepting": match.doctor.new_patient_accepting,
            "telehealth_available": match.doctor.telehealth_available,
            "insurance_networks": match.doctor.insurance_networks,
            "next_available_appointment": match.doctor.next_available_appointment.isoformat() if match.doctor.next_available_appointment else None,
            "match_score": round(match.score, 2),
            "match_reasons": match.match_reasons
        }
        results.append(doctor_data)
    
    return {
        "query_id": query_id,
        "original_query": query,
        "analysis": {
            "symptoms": analysis.symptoms,
            "conditions": analysis.conditions,
            "specialties": analysis.specialties,
            "urgency_level": analysis.urgency_level,
            "appointment_type": analysis.appointment_type,
            "emergency_indicators": analysis.emergency_indicators
        },
        "total_results": len(results),
        "doctors": results,
        "search_metadata": {
            "max_distance_miles": max_distance_miles,
            "insurance_filter": insurance_provider,
            "user_location": user_location
        }
    }

@public
def get_doctor_details(doctor_id: str) -> Doctor:
    """
    Get comprehensive details for a specific doctor.
    """
    results = Doctor.sql("SELECT * FROM doctors WHERE id = %(doctor_id)s AND is_active = true", 
                        {"doctor_id": doctor_id})
    
    if not results:
        raise ValueError("Doctor not found")
    
    return Doctor(**results[0])

@public
def get_doctor_reviews(doctor_id: str, limit: int = 10) -> List[DoctorReview]:
    """
    Get patient reviews for a specific doctor.
    """
    results = DoctorReview.sql(
        "SELECT * FROM doctor_reviews WHERE doctor_id = %(doctor_id)s AND is_active = true AND moderator_approved = true ORDER BY created_at DESC LIMIT %(limit)s",
        {"doctor_id": doctor_id, "limit": limit}
    )
    
    return [DoctorReview(**result) for result in results]

@public
def book_appointment(doctor_id: str, patient_name: str, patient_email: str, 
                    patient_phone: str, appointment_datetime: str,
                    chief_complaint: str, appointment_type: str = "consultation",
                    visit_type: str = "in-person", insurance_provider: Optional[str] = None,
                    insurance_plan: Optional[str] = None, source_query_id: Optional[str] = None) -> Appointment:
    """
    Book an appointment with a doctor.
    """
    
    # Validate doctor exists and is accepting patients
    doctor_results = Doctor.sql("SELECT * FROM doctors WHERE id = %(doctor_id)s AND is_active = true AND new_patient_accepting = true",
                               {"doctor_id": doctor_id})
    
    if not doctor_results:
        raise ValueError("Doctor not found or not accepting new patients")
    
    # Parse appointment datetime
    appointment_dt = datetime.fromisoformat(appointment_datetime.replace('Z', '+00:00'))
    
    # Check for conflicts (basic check - in real system would integrate with doctor's calendar)
    existing_appointments = Appointment.sql(
        "SELECT * FROM appointments WHERE doctor_id = %(doctor_id)s AND appointment_datetime = %(appointment_datetime)s AND status IN ('scheduled', 'confirmed')",
        {"doctor_id": doctor_id, "appointment_datetime": appointment_dt}
    )
    
    if existing_appointments:
        raise ValueError("Time slot not available")
    
    # Create appointment
    appointment = Appointment(
        doctor_id=uuid.UUID(doctor_id),
        patient_name=patient_name,
        patient_email=patient_email,
        patient_phone=patient_phone,
        appointment_datetime=appointment_dt,
        appointment_type=appointment_type,
        visit_type=visit_type,
        chief_complaint=chief_complaint,
        insurance_provider=insurance_provider,
        insurance_plan=insurance_plan,
        source_query_id=uuid.UUID(source_query_id) if source_query_id else None,
        status="scheduled"
    )
    
    appointment.sync()
    
    # Update query with booking success if linked
    if source_query_id:
        UserQuery.sql(
            "UPDATE user_queries SET appointment_booked = true, top_doctor_id = %(doctor_id)s WHERE id = %(query_id)s",
            {"doctor_id": doctor_id, "query_id": source_query_id}
        )
    
    return appointment

@public
def get_available_slots(doctor_id: str, start_date: str, end_date: str) -> List[Dict]:
    """
    Get available appointment slots for a doctor within a date range.
    This is a simplified version - real implementation would integrate with doctor's calendar system.
    """
    
    # Validate doctor exists
    doctor_results = Doctor.sql("SELECT * FROM doctors WHERE id = %(doctor_id)s AND is_active = true",
                               {"doctor_id": doctor_id})
    
    if not doctor_results:
        raise ValueError("Doctor not found")
    
    doctor = Doctor(**doctor_results[0])
    
    # Get existing appointments in the date range
    existing_appointments = Appointment.sql(
        "SELECT appointment_datetime FROM appointments WHERE doctor_id = %(doctor_id)s AND appointment_datetime >= %(start_date)s AND appointment_datetime <= %(end_date)s AND status IN ('scheduled', 'confirmed')",
        {
            "doctor_id": doctor_id,
            "start_date": start_date,
            "end_date": end_date
        }
    )
    
    booked_times = {result['appointment_datetime'] for result in existing_appointments}
    
    # Generate available slots (simplified - assumes 9 AM to 5 PM, 30-minute slots, weekdays only)
    available_slots = []
    start_dt = datetime.fromisoformat(start_date.replace('Z', '+00:00'))
    end_dt = datetime.fromisoformat(end_date.replace('Z', '+00:00'))
    
    current_date = start_dt.date()
    while current_date <= end_dt.date():
        # Skip weekends
        if current_date.weekday() < 5:  # Monday = 0, Friday = 4
            # Generate time slots from 9 AM to 5 PM
            for hour in range(9, 17):
                for minute in [0, 30]:
                    slot_time = datetime.combine(current_date, datetime.min.time().replace(hour=hour, minute=minute))
                    
                    if slot_time not in booked_times and slot_time > datetime.now():
                        available_slots.append({
                            "datetime": slot_time.isoformat(),
                            "display_time": slot_time.strftime("%I:%M %p"),
                            "date": current_date.strftime("%Y-%m-%d"),
                            "available": True
                        })
        
        current_date += timedelta(days=1)
    
    return available_slots[:20]  # Limit to first 20 available slots

@public
def submit_doctor_review(doctor_id: str, appointment_id: Optional[str], overall_rating: int,
                        review_text: Optional[str] = None, patient_name: Optional[str] = None,
                        condition_treated: Optional[str] = None, would_recommend: bool = True) -> DoctorReview:
    """
    Submit a review for a doctor.
    """
    
    # Validate doctor exists
    doctor_results = Doctor.sql("SELECT * FROM doctors WHERE id = %(doctor_id)s", {"doctor_id": doctor_id})
    if not doctor_results:
        raise ValueError("Doctor not found")
    
    # Validate rating
    if overall_rating < 1 or overall_rating > 5:
        raise ValueError("Rating must be between 1 and 5")
    
    # Create review
    review = DoctorReview(
        doctor_id=uuid.UUID(doctor_id),
        appointment_id=uuid.UUID(appointment_id) if appointment_id else None,
        overall_rating=overall_rating,
        review_text=review_text,
        patient_name=patient_name,
        condition_treated=condition_treated,
        would_recommend=would_recommend,
        verified_patient=appointment_id is not None  # Verified if linked to appointment
    )
    
    review.sync()
    
    # Update doctor's overall rating (simplified calculation)
    update_doctor_rating(doctor_id)
    
    return review

def update_doctor_rating(doctor_id: str) -> None:
    """
    Update a doctor's overall rating based on all reviews.
    """
    # Calculate new average rating
    rating_results = DoctorReview.sql(
        "SELECT AVG(overall_rating) as avg_rating, COUNT(*) as total_reviews FROM doctor_reviews WHERE doctor_id = %(doctor_id)s AND is_active = true",
        {"doctor_id": doctor_id}
    )
    
    if rating_results and rating_results[0]['total_reviews'] > 0:
        avg_rating = float(rating_results[0]['avg_rating'])
        total_reviews = int(rating_results[0]['total_reviews'])
        
        # Update doctor record
        Doctor.sql(
            "UPDATE doctors SET overall_rating = %(avg_rating)s, total_reviews = %(total_reviews)s, last_updated = %(now)s WHERE id = %(doctor_id)s",
            {
                "avg_rating": round(avg_rating, 1),
                "total_reviews": total_reviews,
                "doctor_id": doctor_id,
                "now": datetime.now()
            }
        )