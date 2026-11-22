from typing import List, Dict, Any, Optional
from app.models.sentiment_model import SentimentAnalyzer
from app.models.emotion_model import EmotionDetector
from app.models.mood_analyzer import MoodAnalyzer
from app.models.condition_screener import ConditionScreener
from app.safety.crisis_detector import CrisisDetector
from app.schemas.request_models import AssessmentAnalysisRequest, SingleTextAnalysisRequest
from app.schemas.response_models import AssessmentFullAnalysisResponse, DistressRiskResult

class AssessmentPipeline:
    def __init__(self):
        self.sentiment_analyzer = SentimentAnalyzer()
        self.emotion_detector = EmotionDetector()
        self.mood_analyzer = MoodAnalyzer()
        self.condition_screener = ConditionScreener()
        self.crisis_detector = CrisisDetector()

    def process_assessment(self, request: AssessmentAnalysisRequest) -> AssessmentFullAnalysisResponse:
        # 1. Aggregate textual information
        narrative_parts = []
        if request.qualitative_text:
            narrative_parts.append(request.qualitative_text)
        for resp in request.responses:
            if resp.response_text:
                narrative_parts.append(resp.response_text)

        combined_text = " ".join(narrative_parts)

        # 2. Extract self-reported safety score (from question 9 if available)
        self_reported_safety_score = 0
        total_score = 0
        for r in request.responses:
            total_score += r.score
            if "safety" in (r.category or "").lower() or "dead" in (r.question_text or "").lower() or "hurting" in (r.question_text or "").lower():
                self_reported_safety_score = max(self_reported_safety_score, r.score)

        # 3. Sentiment & Emotion Analysis
        sentiment = self.sentiment_analyzer.analyze(combined_text)
        emotion = self.emotion_detector.detect(combined_text)

        # 4. Distress & Risk Assessment
        distress_risk = self.crisis_detector.evaluate_risk(
            text=combined_text,
            self_reported_safety_score=self_reported_safety_score,
            assessment_total_score=total_score,
            self_reported_mood=request.self_reported_mood,
            additional_statements=narrative_parts
        )

        # 5. Mood Analysis
        mood = self.mood_analyzer.analyze_mood(
            self_reported_mood=request.self_reported_mood,
            assessment_total_score=total_score,
            dominant_emotion=emotion.dominant_emotion,
            sentiment_label=sentiment.label,
            historical_mood_average=request.historical_mood_average
        )

        # 6. Probable Condition Screening
        screenings = self.condition_screener.screen(request.responses)

        # 7. Workflow Determination
        # URGENT_SAFETY -> immediate human support / helpline
        # WORKFLOW_B (SIGNIFICANT_CONCERN) -> recommend doctor consultation & appointment booking
        # WORKFLOW_A (LOW / MODERATE CONCERN) -> CBT exercises, mood tracking, chatbot
        if distress_risk.is_immediate_safety_concern:
            workflow = "URGENT_SAFETY"
            should_consult = True
            cbt_slugs = ["guided-breathing", "gratitude-journal"]
            recommendations = [
                "URGENT: Please reach out immediately to one of our verified national crisis helplines.",
                "Speak with a trusted family member, close friend, or emergency medical personnel.",
                "MindBridge is an automated companion and is not equipped to handle acute crises independently."
            ]
        elif distress_risk.risk_level == "SIGNIFICANT_CONCERN":
            workflow = "WORKFLOW_B"
            should_consult = True
            cbt_slugs = ["thought-journal", "cognitive-restructuring", "guided-breathing"]
            recommendations = [
                "Schedule a clinical consultation with one of our verified mental health professionals.",
                "Practice daily breathing and grounding exercises to manage acute somatic tension.",
                "Maintain your daily mood tracker to record emotional changes for your doctor's review."
            ]
        else: # LOW_CONCERN or MODERATE_CONCERN
            workflow = "WORKFLOW_A"
            should_consult = False
            cbt_slugs = ["thought-journal", "guided-breathing", "gratitude-journal", "identifying-thought-patterns"]
            recommendations = [
                "Engage in personalized CBT exercises to build cognitive resilience and counter automatic negative thoughts.",
                "Check in daily with your mood tracker to recognize emotional triggers and trends.",
                "Chat with our AI wellness companion anytime for supportive guidance and reflection prompts.",
                "Maintain healthy sleep routines and active physical movement."
            ]

        disclaimer = (
            "MindBridge is an emotional wellness and preliminary screening platform, not a medical diagnostic system. "
            "The AI does not diagnose depression, anxiety, or any medical condition. "
            "Professional clinical judgment must remain with qualified healthcare professionals."
        )

        return AssessmentFullAnalysisResponse(
            status="SUCCESS",
            sentiment=sentiment,
            emotion=emotion,
            mood=mood,
            distress_risk=distress_risk,
            screenings=screenings,
            recommended_workflow=workflow,
            recommendations=recommendations,
            suggested_cbt_slugs=cbt_slugs,
            should_consult_professional=should_consult,
            non_diagnostic_disclaimer=disclaimer
        )
