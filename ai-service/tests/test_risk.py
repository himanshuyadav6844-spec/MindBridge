import pytest
from app.safety.crisis_detector import CrisisDetector

def test_immediate_safety_concern_trigger():
    detector = CrisisDetector()
    res = detector.evaluate_risk(
        text="I don't want to live anymore, planning to end my life tonight.",
        self_reported_safety_score=3,
        assessment_total_score=20
    )
    assert res.is_immediate_safety_concern is True
    assert res.risk_level == "IMMEDIATE_SAFETY_CONCERN"
    assert res.escalation_required is True
    assert len(res.emergency_resources) > 0

def test_significant_concern_trigger():
    detector = CrisisDetector()
    res = detector.evaluate_risk(
        text="Everything feels overwhelming, work is causing constant panic.",
        self_reported_safety_score=0,
        assessment_total_score=16,
        self_reported_mood=2
    )
    assert res.is_immediate_safety_concern is False
    assert res.risk_level == "SIGNIFICANT_CONCERN"
    assert res.escalation_required is True

def test_low_concern_trigger():
    detector = CrisisDetector()
    res = detector.evaluate_risk(
        text="Things are generally fine, just minor everyday fatigue.",
        self_reported_safety_score=0,
        assessment_total_score=3,
        self_reported_mood=4
    )
    assert res.is_immediate_safety_concern is False
    assert res.risk_level == "LOW_CONCERN"
    assert res.escalation_required is False
