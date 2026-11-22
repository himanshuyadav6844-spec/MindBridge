import re
from typing import List, Tuple, Dict, Any
from app.safety.emergency_resources import VERIFIED_CRISIS_RESOURCES
from app.schemas.response_models import DistressRiskResult

# Explicit crisis patterns indicating immediate self-harm, suicidal ideation or acute danger
CRISIS_PATTERNS = [
    r'\b(want to|gonna|going to|feel like|plan to)\s+(die|end my life|kill myself|hang myself|slit my wrist|overdose)\b',
    r'\b(suicid(e|al)|kill myself|end it all|better off dead|no reason to live|don\'?t want to live|wish i was dead|tired of living)\b',
    r'\b(goodbye cruel world|saying goodbye to everyone|writing my suicide note|final goodbye)\b',
    r'\b(hanging myself|poison myself|cutting myself to bleed out|jump in front of)\b'
]

# Secondary distress patterns representing significant struggle without acute stated intent
DISTRESS_PATTERNS = [
    r'\b(hopeless|worthless|unbearable pain|cannot take it anymore|can\'?t go on|falling apart)\b',
    r'\b(nobody cares|completely alone|trapped in my head|drowning in anxiety|panic attack)\b',
    r'\b(hate myself|ruined everything|despair|exhausted of everything)\b'
]

class CrisisDetector:
    """
    Transparent, rule-anchored safety and risk escalation engine.
    Ensures immediate safety concerns are identified deterministically,
    never relying solely on sentiment or probabilistic ML outputs.
    """

    def __init__(self):
        self.compiled_crisis = [re.compile(p, re.IGNORECASE) for p in CRISIS_PATTERNS]
        self.compiled_distress = [re.compile(p, re.IGNORECASE) for p in DISTRESS_PATTERNS]

    def evaluate_text_for_crisis(self, text: str) -> Tuple[bool, List[str]]:
        if not text:
            return False, []
        matched_triggers = []
        for pat in self.compiled_crisis:
            matches = pat.findall(text)
            if matches:
                matched_triggers.append(f"Safety trigger identified: '{matches[0]}'")
        return len(matched_triggers) > 0, matched_triggers

    def evaluate_risk(
        self,
        text: str = "",
        self_reported_safety_score: int = 0, # e.g. PHQ-9 item 9 (0 to 3)
        assessment_total_score: int = 0,
        self_reported_mood: int = 3,
        additional_statements: List[str] = None
    ) -> DistressRiskResult:
        factors: List[str] = []
        has_immediate_crisis = False

        # 1. Direct text analysis for self-harm / suicidal ideation
        combined_text = (text or "") + " " + " ".join(additional_statements or [])
        text_crisis, text_triggers = self.evaluate_text_for_crisis(combined_text)
        if text_crisis:
            has_immediate_crisis = True
            factors.extend(text_triggers)

        # 2. Check PHQ-9 Question 9 safety indicator
        # Score 1: several days, 2: more than half days, 3: nearly every day
        if self_reported_safety_score >= 1:
            factors.append(f"Screening question indicates thoughts of self-harm (intensity rating: {self_reported_safety_score}/3)")
            if self_reported_safety_score >= 2:
                has_immediate_crisis = True

        # 3. Assessment Total Score Thresholds (Standard Clinical Cutoffs: 0-4 minimal, 5-9 mild, 10-14 moderate, 15-19 moderately severe, 20+ severe)
        if assessment_total_score >= 18:
            factors.append(f"Total screening symptom score is high ({assessment_total_score}/27), indicating significant emotional distress")
        elif assessment_total_score >= 10:
            factors.append(f"Total screening symptom score indicates moderate emotional strain ({assessment_total_score}/27)")

        # 4. Check for general distress patterns in text
        if not text_crisis:
            for pat in self.compiled_distress:
                if pat.search(combined_text):
                    factors.append("Narrative contains expressions of feeling overwhelmed or emotionally exhausted")
                    break

        # 5. Low mood self-report
        if self_reported_mood == 1:
            factors.append("Patient self-reports mood as very low (1/5)")

        # Classification Logic
        if has_immediate_crisis:
            risk_level = "IMMEDIATE_SAFETY_CONCERN"
            risk_score = 95.0
            escalation_required = True
            guidance = (
                "IMMEDIATE ASSISTANCE: Your safety and well-being are paramount. "
                "MindBridge is an automated companion and cannot provide emergency medical care. "
                "Please connect with trained mental health crisis professionals or emergency services right now."
            )
            resources = VERIFIED_CRISIS_RESOURCES
        elif assessment_total_score >= 15 or self_reported_safety_score == 1 or (assessment_total_score >= 10 and self_reported_mood <= 2):
            risk_level = "SIGNIFICANT_CONCERN"
            risk_score = 70.0
            escalation_required = True
            guidance = (
                "Your responses reflect significant emotional strain and difficulties in daily life. "
                "We strongly encourage booking a consultation with a qualified mental health professional."
            )
            resources = VERIFIED_CRISIS_RESOURCES[:2]
        elif assessment_total_score >= 8 or self_reported_mood == 2:
            risk_level = "MODERATE_CONCERN"
            risk_score = 45.0
            escalation_required = False
            guidance = (
                "Your responses show moderate levels of stress or low mood. "
                "Engaging in guided CBT exercises, mood tracking, and restful habits can support emotional balance."
            )
            resources = []
        else:
            risk_level = "LOW_CONCERN"
            risk_score = 15.0
            escalation_required = False
            guidance = (
                "Your responses suggest manageable or mild everyday stress. "
                "Continue practicing healthy habits, mindfulness, and regular wellness check-ins."
            )
            resources = []

        return DistressRiskResult(
            risk_level=risk_level,
            is_immediate_safety_concern=has_immediate_crisis,
            risk_score=risk_score,
            contributing_factors=factors if factors else ["No significant acute risk factors detected."],
            escalation_required=escalation_required,
            crisis_guidance=guidance,
            emergency_resources=resources
        )
