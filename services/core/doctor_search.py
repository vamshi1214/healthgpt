from typing import List, Dict, Optional, Tuple
from core.doctor import Doctor
from core.ai_query_processor import QueryAnalysis
import math

class DoctorMatch:
    def __init__(self, doctor: Doctor, score: float, match_reasons: List[str]):
        self.doctor = doctor
        self.score = score
        self.match_reasons = match_reasons

def calculate_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """
    Calculate the distance between two points on Earth using the Haversine formula.
    Returns distance in miles.
    """
    R = 3959  # Earth's radius in miles
    
    lat1_rad = math.radians(lat1)
    lon1_rad = math.radians(lon1)
    lat2_rad = math.radians(lat2)
    lon2_rad = math.radians(lon2)
    
    dlat = lat2_rad - lat1_rad
    dlon = lon2_rad - lon1_rad
    
    a = math.sin(dlat/2)**2 + math.cos(lat1_rad) * math.cos(lat2_rad) * math.sin(dlon/2)**2
    c = 2 * math.asin(math.sqrt(a))
    
    return R * c

def search_doctors(analysis: QueryAnalysis, user_latitude: Optional[float] = None, 
                  user_longitude: Optional[float] = None, max_distance_miles: int = 25,
                  insurance_provider: Optional[str] = None, limit: int = 20) -> List[DoctorMatch]:
    """
    Search for doctors based on AI analysis results and user preferences.
    Returns a ranked list of doctor matches with scoring explanations.
    """
    
    # Base query to get active doctors
    base_query = "SELECT * FROM doctors WHERE is_active = true AND license_active = true"
    params = {}
    
    # Add insurance filter if specified
    if insurance_provider:
        base_query += " AND %(insurance)s = ANY(insurance_networks)"
        params["insurance"] = insurance_provider
    
    # Get all potential doctors
    doctor_results = Doctor.sql(base_query, params)
    doctors = [Doctor(**result) for result in doctor_results]
    
    doctor_matches = []
    
    for doctor in doctors:
        score = 0.0
        match_reasons = []
        
        # 1. Specialty matching (40% of score)
        specialty_score = calculate_specialty_match(doctor, analysis)
        if specialty_score > 0:
            score += specialty_score * 0.4
            if specialty_score >= 0.8:
                match_reasons.append(f"Perfect specialty match: {', '.join(analysis.specialties)}")
            elif specialty_score >= 0.5:
                match_reasons.append(f"Good specialty match")
            else:
                match_reasons.append(f"Related specialty")
        
        # 2. Distance scoring (25% of score)
        if user_latitude and user_longitude:
            distance = calculate_distance(user_latitude, user_longitude, 
                                        doctor.practice_latitude, doctor.practice_longitude)
            if distance <= max_distance_miles:
                distance_score = max(0, 1 - (distance / max_distance_miles))
                score += distance_score * 0.25
                match_reasons.append(f"{distance:.1f} miles away")
            else:
                continue  # Skip doctors outside max distance
        else:
            score += 0.25  # Neutral score if no location provided
        
        # 3. Experience and credentials (15% of score)
        experience_score = calculate_experience_score(doctor, analysis)
        score += experience_score * 0.15
        if experience_score > 0.7:
            match_reasons.append(f"{doctor.years_in_practice} years experience")
        
        # 4. Availability and patient ratings (10% of score)
        availability_score = calculate_availability_score(doctor)
        score += availability_score * 0.1
        if doctor.new_patient_accepting:
            match_reasons.append("Accepting new patients")
        
        # 5. Patient ratings (10% of score)
        if doctor.overall_rating and doctor.total_reviews and doctor.total_reviews > 5:
            rating_score = (doctor.overall_rating - 1) / 4  # Normalize 1-5 to 0-1
            score += rating_score * 0.1
            match_reasons.append(f"{doctor.overall_rating:.1f}★ ({doctor.total_reviews} reviews)")
        
        # Urgency adjustments
        if analysis.urgency_level == "emergency":
            # Prioritize doctors with immediate availability
            if doctor.next_available_appointment and doctor.average_wait_time_days and doctor.average_wait_time_days <= 1:
                score += 0.2
                match_reasons.append("Emergency availability")
        elif analysis.urgency_level == "urgent":
            # Prioritize doctors with near-term availability
            if doctor.average_wait_time_days and doctor.average_wait_time_days <= 7:
                score += 0.1
                match_reasons.append("Quick availability")
        
        # Only include doctors with a reasonable match score
        if score > 0.3:
            doctor_matches.append(DoctorMatch(doctor, score, match_reasons))
    
    # Sort by score (highest first) and limit results
    doctor_matches.sort(key=lambda x: x.score, reverse=True)
    return doctor_matches[:limit]

def calculate_specialty_match(doctor: Doctor, analysis: QueryAnalysis) -> float:
    """
    Calculate how well a doctor's specialties match the analysis.
    Returns a score from 0.0 to 1.0.
    """
    if not analysis.specialties:
        return 0.5  # Neutral score if no specific specialty needed
    
    doctor_specialties = [s.lower() for s in doctor.specialties]
    if doctor.subspecialties:
        doctor_specialties.extend([s.lower() for s in doctor.subspecialties])
    
    analysis_specialties = [s.lower() for s in analysis.specialties]
    
    # Check for exact matches
    exact_matches = len(set(doctor_specialties) & set(analysis_specialties))
    if exact_matches > 0:
        return min(1.0, 0.8 + (exact_matches * 0.2))
    
    # Check for partial matches (contains keywords)
    partial_score = 0.0
    for analysis_spec in analysis_specialties:
        for doctor_spec in doctor_specialties:
            if analysis_spec in doctor_spec or doctor_spec in analysis_spec:
                partial_score += 0.3
                break
    
    # Check conditions treated
    if doctor.conditions_treated:
        doctor_conditions = [c.lower() for c in doctor.conditions_treated]
        analysis_conditions = [c.lower() for c in analysis.conditions] if analysis.conditions else []
        analysis_symptoms = [s.lower() for s in analysis.symptoms] if analysis.symptoms else []
        
        for condition in analysis_conditions + analysis_symptoms:
            for doc_condition in doctor_conditions:
                if condition in doc_condition or doc_condition in condition:
                    partial_score += 0.2
                    break
    
    return min(1.0, partial_score)

def calculate_experience_score(doctor: Doctor, analysis: QueryAnalysis) -> float:
    """
    Calculate experience-based score for the doctor.
    """
    base_score = min(1.0, doctor.years_in_practice / 20)  # 20+ years = full score
    
    # Boost for board certifications
    if doctor.board_certifications and len(doctor.board_certifications) > 0:
        base_score += 0.2
    
    # Boost for relevant fellowships
    if doctor.fellowships and analysis.specialties:
        fellowship_boost = 0.0
        for fellowship in doctor.fellowships:
            for specialty in analysis.specialties:
                if specialty.lower() in fellowship.lower():
                    fellowship_boost = 0.3
                    break
        base_score += fellowship_boost
    
    return min(1.0, base_score)

def calculate_availability_score(doctor: Doctor) -> float:
    """
    Calculate availability-based score for the doctor.
    """
    score = 0.0
    
    if doctor.new_patient_accepting:
        score += 0.5
    
    if doctor.average_wait_time_days is not None:
        if doctor.average_wait_time_days <= 3:
            score += 0.5
        elif doctor.average_wait_time_days <= 7:
            score += 0.3
        elif doctor.average_wait_time_days <= 14:
            score += 0.1
    else:
        score += 0.2  # Neutral if unknown
    
    if doctor.telehealth_available:
        score += 0.2
    
    return min(1.0, score)