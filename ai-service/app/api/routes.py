import time
from typing import Dict, Any, List
from fastapi import APIRouter, HTTPException, status
from app.schemas.request_models import (
    AssessmentAnalysisRequest,
    SingleTextAnalysisRequest,
    BatchAnalysisRequest,
    RiskAssessmentOnlyRequest
)
from app.schemas.response_models import (
    AssessmentFullAnalysisResponse,
    BatchAnalysisResponse,
    ModelInfoResponse,
    DistressRiskResult
)
from app.services.assessment_pipeline import AssessmentPipeline
from app.models.emotion_model import SUPPORTED_EMOTIONS

router = APIRouter(prefix="/api/v1", tags=["AI Mental Health Engine"])
pipeline = AssessmentPipeline()

@router.post("/analyze", response_model=AssessmentFullAnalysisResponse)
async def analyze_assessment(request: AssessmentAnalysisRequest):
    """
    Core AI Analysis Endpoint:
    Executes Sentiment Analysis, Emotion Detection, Mood Analysis,
    Distress/Risk Assessment, and Probable Condition Screening.
    """
    try:
        return pipeline.process_assessment(request)
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"AI pipeline analysis failure: {str(e)}"
        )

@router.post("/analyze/text")
async def analyze_single_text(request: SingleTextAnalysisRequest):
    """Analyzes a single conversational or journal snippet for sentiment and emotion."""
    try:
        sentiment = pipeline.sentiment_analyzer.analyze(request.text)
        emotion = pipeline.emotion_detector.detect(request.text)
        crisis_flag, triggers = pipeline.crisis_detector.evaluate_text_for_crisis(request.text)
        return {
            "sentiment": sentiment.model_dump(),
            "emotion": emotion.model_dump(),
            "crisis_alert": crisis_flag,
            "safety_triggers": triggers
        }
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Text analysis failure: {str(e)}"
        )

@router.post("/analyze/batch", response_model=BatchAnalysisResponse)
async def analyze_batch(request: BatchAnalysisRequest):
    """Processes multiple text inputs in a single batch request."""
    try:
        results = []
        for item in request.items:
            sentiment = pipeline.sentiment_analyzer.analyze(item.text)
            emotion = pipeline.emotion_detector.detect(item.text)
            crisis_flag, triggers = pipeline.crisis_detector.evaluate_text_for_crisis(item.text)
            results.append({
                "text_snippet": item.text[:80] + "..." if len(item.text) > 80 else item.text,
                "sentiment": sentiment.model_dump(),
                "emotion": emotion.model_dump(),
                "crisis_alert": crisis_flag,
                "safety_triggers": triggers
            })
        return BatchAnalysisResponse(
            results=results,
            total_processed=len(results)
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Batch analysis failure: {str(e)}"
        )

@router.post("/risk-assessment", response_model=DistressRiskResult)
async def evaluate_risk_endpoint(request: RiskAssessmentOnlyRequest):
    """Direct safety evaluation for real-time monitoring and crisis checks."""
    try:
        return pipeline.crisis_detector.evaluate_risk(
            text=request.text or "",
            self_reported_safety_score=request.self_reported_safety_score or 0,
            assessment_total_score=request.assessment_total_score or 0,
            self_reported_mood=2 if request.has_self_harm_thoughts else 3,
            additional_statements=request.qualitative_statements
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Risk evaluation failure: {str(e)}"
        )

@router.get("/model-info", response_model=ModelInfoResponse)
async def get_model_info():
    """Returns metadata and runtime configuration of all AI models."""
    return ModelInfoResponse(
        service_name="MindBridge AI Mental Health Microservice",
        version="1.0.0",
        sentiment_model={
            "architecture": "TF-IDF N-Gram Vectorizer + LogisticRegression Classifier",
            "classes": ["POSITIVE", "NEGATIVE", "NEUTRAL"],
            "calibrated": True
        },
        emotion_model={
            "architecture": "TF-IDF N-Gram Vectorizer + Multi-Class Logistic Classifier",
            "classes": SUPPORTED_EMOTIONS,
            "calibrated": True
        },
        risk_engine={
            "architecture": "Deterministic Multi-Criteria Crisis & Distress Escalation Engine",
            "classifications": ["LOW_CONCERN", "MODERATE_CONCERN", "SIGNIFICANT_CONCERN", "IMMEDIATE_SAFETY_CONCERN"],
            "safety_first_policy": "Sentiment alone never determines self-harm risk; crisis triggers deterministically escalate to emergency guidance."
        },
        supported_emotions=SUPPORTED_EMOTIONS,
        screening_instruments=["PHQ-9 (Depression Indicators)", "GAD-7 (Anxiety Indicators)", "Sleep Disturbance Scale", "Perceived Stress"]
    )
