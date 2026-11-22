from typing import List, Dict, Optional, Any
from pydantic import BaseModel, Field

class SentimentResult(BaseModel):
    label: str = Field(..., description="POSITIVE, NEGATIVE, or NEUTRAL")
    confidence: float = Field(..., ge=0.0, le=1.0)
    probabilities: Dict[str, float] = Field(default_factory=dict)

class EmotionResult(BaseModel):
    dominant_emotion: str = Field(..., description="Happiness, Sadness, Anger, Fear, Anxiety, Frustration, Loneliness, Hope, Neutral")
    confidence: float = Field(..., ge=0.0, le=1.0)
    scores: Dict[str, float] = Field(..., description="Confidence scores across all 9 emotional dimensions")

class MoodAnalysisResult(BaseModel):
    self_reported_mood: int = Field(..., ge=1, le=5, description="1=Very Low, 2=Low, 3=Neutral, 4=Good, 5=Very Good")
    ai_inferred_mood: int = Field(..., ge=1, le=5, description="AI-inferred mood based on responses and emotional sentiment")
    mood_label: str
    mood_trend: str = Field("STABLE", description="IMPROVING, DECLINING, STABLE, or FLUCTUATING")
    description: str

class CrisisResource(BaseModel):
    name: str
    helpline: str
    hours: str
    description: str
    website: Optional[str] = None

class DistressRiskResult(BaseModel):
    risk_level: str = Field(..., description="LOW_CONCERN, MODERATE_CONCERN, SIGNIFICANT_CONCERN, IMMEDIATE_SAFETY_CONCERN")
    is_immediate_safety_concern: bool
    risk_score: float = Field(..., ge=0.0, le=100.0)
    contributing_factors: List[str]
    escalation_required: bool
    crisis_guidance: Optional[str] = None
    emergency_resources: List[CrisisResource] = Field(default_factory=list)

class ProbableConditionScreening(BaseModel):
    condition_name: str
    severity_indicator: str = Field(..., description="Minimal, Mild, Moderate, Moderately Severe, Severe")
    screening_score: int
    max_possible_score: int
    symptom_indicators: List[str]
    clinical_disclaimer: str

class AssessmentFullAnalysisResponse(BaseModel):
    status: str = "SUCCESS"
    sentiment: SentimentResult
    emotion: EmotionResult
    mood: MoodAnalysisResult
    distress_risk: DistressRiskResult
    screenings: List[ProbableConditionScreening]
    recommended_workflow: str = Field(..., description="WORKFLOW_A, WORKFLOW_B, or URGENT_SAFETY")
    recommendations: List[str]
    suggested_cbt_slugs: List[str]
    should_consult_professional: bool
    non_diagnostic_disclaimer: str

class BatchAnalysisResponse(BaseModel):
    results: List[Dict[str, Any]]
    total_processed: int

class ModelInfoResponse(BaseModel):
    service_name: str
    version: str
    sentiment_model: Dict[str, Any]
    emotion_model: Dict[str, Any]
    risk_engine: Dict[str, Any]
    supported_emotions: List[str]
    screening_instruments: List[str]
