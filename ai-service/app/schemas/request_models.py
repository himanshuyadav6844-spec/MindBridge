from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class SingleTextAnalysisRequest(BaseModel):
    text: str = Field(..., min_length=1, max_length=5000, description="Patient text or reflection for NLP analysis")
    self_reported_mood: Optional[int] = Field(None, ge=1, le=5, description="Self-reported mood on 1-5 scale")

class QuestionResponseItem(BaseModel):
    question_id: str
    category: str
    question_text: str
    score: int = Field(..., ge=0, le=5)
    selected_option: Optional[str] = None
    response_text: Optional[str] = None

class AssessmentAnalysisRequest(BaseModel):
    assessment_id: Optional[str] = None
    patient_id: Optional[str] = None
    self_reported_mood: int = Field(3, ge=1, le=5, description="1=Very Low, 2=Low, 3=Neutral, 4=Good, 5=Very Good")
    responses: List[QuestionResponseItem] = Field(default_factory=list)
    qualitative_text: Optional[str] = Field(None, description="Free-text narrative or reflection from patient")
    historical_mood_average: Optional[float] = Field(None, ge=1.0, le=5.0)

class BatchAnalysisRequest(BaseModel):
    items: List[SingleTextAnalysisRequest] = Field(..., min_length=1, max_length=50)

class RiskAssessmentOnlyRequest(BaseModel):
    text: Optional[str] = None
    self_reported_safety_score: Optional[int] = Field(None, ge=0, le=3)
    has_self_harm_thoughts: Optional[bool] = False
    assessment_total_score: Optional[int] = None
    qualitative_statements: List[str] = Field(default_factory=list)
