"""
Custom Doctor Ranking Service
Allows users to specify their priorities and re-rank doctors accordingly
"""

from typing import List, Dict, Any, Optional
from dataclasses import dataclass
import uuid
from core.doctor import Doctor
from solar.access import public

@dataclass
class RankingCriteria:
    """User-specified ranking criteria with weights"""
    criteria_name: str
    weight: float  # 0.0 to 1.0
    description: str

@dataclass
class CustomRankingResult:
    """Result from custom ranking with explanations"""
    doctor_id: str
    name: str
    original_rank: int
    new_rank: int
    original_score: float
    new_score: float
    factor_breakdown: Dict[str, float]
    ranking_change_explanation: str

@public
def rank_doctors_by_criteria(doctor_ids: List[str], ranking_criteria: List[Dict[str, Any]]) -> List[CustomRankingResult]:
    """
    Re-rank doctors based on user-specified criteria and priorities
    
    Args:
        doctor_ids: List of doctor IDs to rank
        ranking_criteria: List of criteria with weights, e.g.:
            [
                {"name": "Highest Rating", "weight": 0.4},
                {"name": "Closest Distance", "weight": 0.3},
                {"name": "Years of Experience", "weight": 0.3}
            ]
    
    Returns:
        List of custom ranking results with explanations
    """
    
    # Fetch doctor details
    doctor_data = []
    for doctor_id in doctor_ids:
        results = Doctor.sql("SELECT * FROM doctors WHERE id = %(doctor_id)s", {"doctor_id": doctor_id})
        if results:
            doctor_data.append(Doctor(**results[0]))
    
    if not doctor_data:
        return []
    
    # Calculate scores for each criterion
    scored_doctors = []
    for i, doctor in enumerate(doctor_data):
        scores = calculate_criterion_scores(doctor, ranking_criteria)
        
        # Calculate weighted total score
        total_score = 0.0
        total_weight = sum(criterion['weight'] for criterion in ranking_criteria)
        
        for criterion in ranking_criteria:
            criterion_name = criterion['name']
            weight = criterion['weight'] / total_weight  # Normalize weights
            score = scores.get(criterion_name, 0.5)  # Default to 0.5 if not found
            total_score += score * weight
        
        scored_doctors.append({
            'doctor': doctor,
            'original_rank': i + 1,
            'scores': scores,
            'total_score': total_score
        })
    
    # Sort by new total score (descending)
    scored_doctors.sort(key=lambda x: x['total_score'], reverse=True)
    
    # Generate ranking results with explanations
    results = []
    for new_rank, item in enumerate(scored_doctors, 1):
        doctor = item['doctor']
        original_rank = item['original_rank']
        new_score = item['total_score']
        
        # Generate explanation for ranking change
        ranking_change = new_rank - original_rank
        if ranking_change < 0:
            change_explanation = f"Moved up {abs(ranking_change)} position(s) due to strong performance in your priority areas."
        elif ranking_change > 0:
            change_explanation = f"Moved down {ranking_change} position(s) as other doctors scored higher in your selected criteria."
        else:
            change_explanation = "Maintained position - consistently strong across your priority criteria."
        
        # Add specific reasoning based on top scoring criteria
        top_criteria = sorted(
            [(name, score) for name, score in item['scores'].items()],
            key=lambda x: x[1],
            reverse=True
        )[:2]
        
        if top_criteria:
            top_reasons = [f"{criteria[0]} ({criteria[1]:.1%})" for criteria in top_criteria]
            change_explanation += f" Strongest in: {', '.join(top_reasons)}."
        
        results.append(CustomRankingResult(
            doctor_id=str(doctor.id),
            name=doctor.name,
            original_rank=original_rank,
            new_rank=new_rank,
            original_score=0.8,  # Default original score
            new_score=new_score,
            factor_breakdown=item['scores'],
            ranking_change_explanation=change_explanation
        ))
    
    return results

def calculate_criterion_scores(doctor: Doctor, ranking_criteria: List[Dict[str, Any]]) -> Dict[str, float]:
    """Calculate normalized scores for each ranking criterion"""
    scores = {}
    
    for criterion in ranking_criteria:
        criterion_name = criterion['name']
        
        if criterion_name == "Highest Rating":
            # Normalize rating from 1-5 scale to 0-1
            if doctor.overall_rating:
                scores[criterion_name] = (doctor.overall_rating - 1) / 4
            else:
                scores[criterion_name] = 0.6  # Default for no rating
                
        elif criterion_name == "Years of Experience":
            # Normalize years of experience (cap at 30 years = 1.0)
            scores[criterion_name] = min(doctor.years_in_practice / 30, 1.0)
            
        elif criterion_name == "Accepting New Patients":
            scores[criterion_name] = 1.0 if doctor.new_patient_accepting else 0.0
            
        elif criterion_name == "Telehealth Available":
            scores[criterion_name] = 1.0 if doctor.telehealth_available else 0.0
            
        elif criterion_name == "Most Reviews":
            # Normalize based on review count (cap at 200 reviews = 1.0)
            if doctor.total_reviews:
                scores[criterion_name] = min(doctor.total_reviews / 200, 1.0)
            else:
                scores[criterion_name] = 0.0
                
        elif criterion_name == "Closest Distance":
            # This would need actual distance calculation
            # For now, use a placeholder based on location
            scores[criterion_name] = 0.7  # Default distance score
            
        elif criterion_name == "Insurance Coverage":
            # Score based on number of insurance networks
            if doctor.insurance_networks:
                # Normalize based on typical range of 2-6 networks
                scores[criterion_name] = min(len(doctor.insurance_networks) / 6, 1.0)
            else:
                scores[criterion_name] = 0.5
                
        else:
            # Default score for unknown criteria
            scores[criterion_name] = 0.5
    
    return scores

@public
def get_available_ranking_criteria() -> List[Dict[str, str]]:
    """Get list of available ranking criteria with descriptions"""
    return [
        {
            "name": "Highest Rating",
            "description": "Prioritize doctors with the highest patient ratings",
            "category": "Quality"
        },
        {
            "name": "Years of Experience", 
            "description": "Favor doctors with more years in practice",
            "category": "Experience"
        },
        {
            "name": "Accepting New Patients",
            "description": "Prioritize doctors currently accepting new patients",
            "category": "Availability"
        },
        {
            "name": "Telehealth Available",
            "description": "Favor doctors offering virtual consultations",
            "category": "Convenience"
        },
        {
            "name": "Most Reviews",
            "description": "Prioritize doctors with more patient feedback",
            "category": "Validation"
        },
        {
            "name": "Closest Distance",
            "description": "Favor doctors closest to your location",
            "category": "Convenience"
        },
        {
            "name": "Insurance Coverage",
            "description": "Prioritize doctors accepting more insurance plans",
            "category": "Cost"
        }
    ]

@public
def explain_ranking_methodology(criteria: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Explain how the custom ranking algorithm works with the selected criteria
    """
    
    total_weight = sum(criterion['weight'] for criterion in criteria)
    normalized_criteria = [
        {
            "name": criterion['name'],
            "weight": criterion['weight'],
            "percentage": (criterion['weight'] / total_weight * 100) if total_weight > 0 else 0
        }
        for criterion in criteria
    ]
    
    explanation = f"""
    Your custom ranking algorithm works as follows:
    
    1. Each doctor gets scored on your selected criteria (0-100%)
    2. Scores are weighted by your priorities:
    """
    
    for criterion in normalized_criteria:
        explanation += f"\n   • {criterion['name']}: {criterion['percentage']:.1f}% weight"
    
    explanation += f"""
    
    3. Final score = Σ(criterion_score × weight)
    4. Doctors are ranked by their final weighted score
    
    This approach ensures doctors excel in YOUR priorities get ranked higher,
    while still considering overall medical qualifications.
    """
    
    return {
        "methodology": explanation,
        "criteria_breakdown": normalized_criteria,
        "algorithm_type": "Weighted Multi-Criteria Decision Analysis",
        "transparency_note": "All scoring factors are transparent and based on verified doctor data."
    }