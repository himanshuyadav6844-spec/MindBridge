import pytest
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_health_endpoint():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json()["status"] == "UP"

def test_model_info_endpoint():
    response = client.get("/api/v1/model-info")
    assert response.status_code == 200
    data = response.json()
    assert "sentiment_model" in data
    assert "supported_emotions" in data

def test_full_assessment_analysis():
    payload = {
        "assessment_id": "test-assess-1",
        "self_reported_mood": 2,
        "qualitative_text": "I feel very stressed and down recently with constant fatigue.",
        "responses": [
            {"question_id": "q1", "category": "Mood & Interest", "question_text": "Little interest", "score": 2},
            {"question_id": "q2", "category": "Mood & Affect", "question_text": "Feeling down", "score": 2},
            {"question_id": "q3", "category": "Sleep Quality", "question_text": "Trouble sleeping", "score": 2},
            {"question_id": "q4", "category": "Energy & Fatigue", "question_text": "Little energy", "score": 2},
            {"question_id": "q5", "category": "Anxiety & Nervousness", "question_text": "Nervous and anxious", "score": 3},
            {"question_id": "q6", "category": "Personal Safety", "question_text": "Hurting yourself", "score": 0}
        ]
    }
    response = client.post("/api/v1/analyze", json=payload)
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "SUCCESS"
    assert "sentiment" in data
    assert "emotion" in data
    assert "mood" in data
    assert "distress_risk" in data
    assert "screenings" in data
    assert data["recommended_workflow"] in ["WORKFLOW_A", "WORKFLOW_B", "URGENT_SAFETY"]
