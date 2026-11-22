import urllib.request
import urllib.parse
import urllib.error
import json
import uuid
import sys

BASE_URL = "http://localhost:8080/api"
AI_URL = "http://localhost:8000"

def make_req(url, method="GET", data=None, headers=None):
    if headers is None:
        headers = {}
    headers["Content-Type"] = "application/json"
    
    encoded_data = None
    if data is not None:
        encoded_data = json.dumps(data).encode("utf-8")
        
    req = urllib.request.Request(url, data=encoded_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=10) as response:
            resp_body = response.read().decode("utf-8")
            return response.status, json.loads(resp_body) if resp_body else {}
    except urllib.error.HTTPError as e:
        err_body = e.read().decode("utf-8")
        try:
            return e.code, json.loads(err_body)
        except:
            return e.code, {"error": err_body}
    except Exception as e:
        raise e

def test_e2e():
    print("=== STARTING FULL MIND-BRIDGE END-TO-END INTEGRATION TEST ===")
    
    # 1. Test AI Microservice Direct Health & NLP Inference
    print("\n1. Verifying AI Microservice Health & Endpoints...")
    status, ai_health = make_req(f"{AI_URL}/health")
    assert status == 200, f"AI service unhealthy: {ai_health}"
    print(f"   [OK] AI microservice online: {ai_health}")

    ai_test_payload = {
        "text": "I feel deeply hopeless and overwhelmed by everything around me. I can't sleep.",
        "self_reported_mood": 2
    }
    status, ai_data = make_req(f"{AI_URL}/api/v1/analyze/text", method="POST", data=ai_test_payload)
    assert status == 200, f"AI analysis failed: {ai_data}"
    print(f"   [OK] AI analysis inference succeeded:")
    print(f"        - Sentiment: {ai_data['sentiment']['label']} (conf: {ai_data['sentiment']['confidence']:.2f})")
    print(f"        - Dominant Emotion: {ai_data['emotion']['dominant_emotion']}")
    print(f"        - Crisis Alert: {ai_data['crisis_alert']}")

    # 2. Register a new Patient
    unique_suffix = uuid.uuid4().hex[:6]
    patient_email = f"patient_{unique_suffix}@example.com"
    patient_password = "Password123!"
    patient_payload = {
        "email": patient_email,
        "password": patient_password,
        "confirmPassword": patient_password,
        "fullName": f"Aarav Sharma {unique_suffix}",
        "dateOfBirth": "1996-05-14",
        "gender": "Male",
        "phoneNumber": "+919876543210",
        "privacyConsent": True
    }
    print(f"\n2. Registering Patient: {patient_email}...")
    status, reg_res = make_req(f"{BASE_URL}/auth/register/patient", method="POST", data=patient_payload)
    assert status in [200, 201], f"Patient registration failed: {reg_res}"
    patient_token = reg_res["data"]["token"]
    patient_id = reg_res["data"]["id"]
    print(f"   [OK] Patient registered successfully. User ID: {patient_id}")
    patient_headers = {"Authorization": f"Bearer {patient_token}"}

    # 3. Register a new Doctor & Admin Verification
    doctor_email = f"dr_{unique_suffix}@mindbridge.local"
    doctor_password = "Password123!"
    doctor_reg_payload = {
        "fullName": f"Dr. Kabir Roy {unique_suffix}",
        "email": doctor_email,
        "password": doctor_password,
        "qualification": "M.D. Psychiatry, AIIMS",
        "primarySpecialization": "Clinical Psychiatry & Neuropsychology",
        "experienceYears": 14,
        "licenseNumber": f"MCI-PSY-{unique_suffix.upper()}",
        "consultationFee": 1200.00,
        "phoneNumber": "+919876500001",
        "professionalDescription": "Specialist in trauma recovery, anxiety syndromes, and cognitive restructuring."
    }
    print(f"\n3. Registering New Doctor: {doctor_email}...")
    status, doc_reg_res = make_req(f"{BASE_URL}/auth/register/doctor", method="POST", data=doctor_reg_payload)
    assert status in [200, 201], f"Doctor registration failed: {doc_reg_res}"
    print(f"   [OK] Doctor account registered in pending status.")

    # Admin Logs in and Verifies the Doctor
    print("   Admin logging in to review credentials...")
    admin_login_payload = {
        "email": "admin@mindbridge.local",
        "password": "AdminSecurePassword2026!"
    }
    status, admin_login = make_req(f"{BASE_URL}/auth/login", method="POST", data=admin_login_payload)
    assert status == 200, f"Admin login failed: {admin_login}"
    admin_token = admin_login["data"]["token"]
    admin_headers = {"Authorization": f"Bearer {admin_token}"}

    status, pending_docs = make_req(f"{BASE_URL}/admin/doctors/pending", headers=admin_headers)
    assert status == 200 and len(pending_docs["data"]) > 0, "No pending doctors found"
    target_doctor = next(d for d in pending_docs["data"] if d["email"] == doctor_email)
    doctor_profile_id = target_doctor["id"]

    print(f"   Admin approving & verifying doctor profile {doctor_profile_id}...")
    status, verify_res = make_req(f"{BASE_URL}/admin/doctors/{doctor_profile_id}/verify", method="PUT", headers=admin_headers)
    assert status == 200, f"Verification failed: {verify_res}"
    print("   [OK] Doctor credentials approved & activated on platform.")

    # 4. Patient Submits Assessment (Workflow B Trigger)
    print("\n4. Patient Submitting Structured Screening Assessment...")
    status, questions_res = make_req(f"{BASE_URL}/assessments/questions", headers=patient_headers)
    assert status == 200, f"Questions failed: {questions_res}"
    questions = questions_res["data"]
    print(f"   [OK] Retrieved {len(questions)} screening questions from database.")

    assessment_submission = {
        "answers": [
            {"questionId": q["id"], "score": 3, "selectedOption": "Nearly every day"} for q in questions
        ],
        "additionalNotes": "I have been feeling exhausted, persistent low mood, and constant anxious thoughts every single day.",
        "selfReportedMood": 2
    }
    status, submit_res = make_req(f"{BASE_URL}/assessments/submit", method="POST", data=assessment_submission, headers=patient_headers)
    assert status in [200, 201], f"Assessment submission failed: {submit_res}"
    report = submit_res["data"]
    print(f"   [OK] Assessment submitted & AI Engine evaluated synchronously:")
    print(f"        - Assessment ID: {report['assessmentId']}")
    print(f"        - Risk Level: {report['riskLevel']}")
    print(f"        - Recommended Workflow: {report['recommendedWorkflow']}")
    print(f"        - Dominant Emotion: {report['dominantEmotion']}")
    print(f"        - Sentiment: {report['sentimentLabel']}")

    # 5. Patient Books Appointment with Newly Verified Doctor
    print(f"\n5. Patient Booking Appointment with {target_doctor['fullName']}...")
    booking_payload = {
        "doctorId": doctor_profile_id,
        "appointmentDate": "2026-11-28",
        "appointmentTime": "15:00:00",
        "consultationMode": "VIDEO",
        "reason": "Assessment indicated significant concern; requesting professional consultation."
    }
    status, book_res = make_req(f"{BASE_URL}/appointments/book", method="POST", data=booking_payload, headers=patient_headers)
    assert status in [200, 201], f"Booking failed: {book_res}"
    booking = book_res["data"]
    appointment_id = booking["id"]
    print(f"   [OK] Appointment booked successfully. ID: {appointment_id}, Status: {booking['status']}")

    # Double-booking check
    print("   Testing double-booking prevention constraint...")
    status, duplicate_res = make_req(f"{BASE_URL}/appointments/book", method="POST", data=booking_payload, headers=patient_headers)
    assert status in [400, 409], f"Double-booking prevention failed with status: {status}"
    print("   [OK] Double-booking blocked by server constraints as expected.")

    # 6. Doctor Login, Review Appointment, Record Notes & Acknowledge
    print(f"\n6. Doctor Logging In & Conducting Session...")
    status, doc_login = make_req(f"{BASE_URL}/auth/login", method="POST", data={
        "email": doctor_email,
        "password": doctor_password
    })
    assert status == 200, f"Doctor login failed: {doc_login}"
    doctor_token = doc_login["data"]["token"]
    doctor_headers = {"Authorization": f"Bearer {doctor_token}"}
    print("   [OK] Doctor authenticated successfully.")

    # Doctor records clinical notes
    consult_payload = {
        "appointmentId": appointment_id,
        "clinicalNotes": "Patient presented with severe fatigue, negative rumination, and somatic anxiety symptoms. Formulated acute stress management plan.",
        "recommendations": "Prescribed Thought Journal CBT module and sleep stabilization hygiene routine.",
        "followUpRecommended": True,
        "followUpDate": "2026-12-10"
    }
    status, consult_res = make_req(f"{BASE_URL}/doctor/consultations", method="POST", data=consult_payload, headers=doctor_headers)
    assert status in [200, 201], f"Consultation save failed: {consult_res}"
    print("   [OK] Clinical consultation notes and follow-up documented.")

    # Doctor acknowledges consultation completion
    status, ack_res = make_req(f"{BASE_URL}/consultations/{appointment_id}/acknowledge", method="POST", headers=doctor_headers)
    assert status == 200, f"Acknowledgement failed: {ack_res}"
    print("   [OK] Doctor acknowledged consultation completion (Workflow B complete).")

    # 7. Patient Retrieves Summary & Leaves Feedback
    print("\n7. Patient Retrieving Clinical Record & Submitting Feedback...")
    status, patient_record_res = make_req(f"{BASE_URL}/consultations/appointment/{appointment_id}", headers=patient_headers)
    assert status == 200, f"Record fetch failed: {patient_record_res}"
    rec_data = patient_record_res["data"]
    print(f"   [OK] Clinical notes retrieved by patient. Acknowledged: {rec_data['doctorAcknowledged']}")

    review_payload = {
        "appointmentId": appointment_id,
        "doctorId": doctor_profile_id,
        "rating": 5,
        "feedbackText": "Very empathetic consultation with practical coping tools."
    }
    status, review_res = make_req(f"{BASE_URL}/consultations/feedback", method="POST", data=review_payload, headers=patient_headers)
    assert status in [200, 201], f"Feedback failed: {review_res}"
    print("   [OK] 5-star practitioner review recorded.")

    # 8. Test Workflow A (CBT, Mood Logging, AI Chatbot)
    print("\n8. Testing Workflow A (Low/Moderate Concern components)...")
    status, cbt_res = make_req(f"{BASE_URL}/cbt/exercises", headers=patient_headers)
    assert status == 200 and len(cbt_res["data"]) > 0
    print(f"   [OK] CBT Catalog: {len(cbt_res['data'])} evidence-informed exercises available.")

    mood_payload = {
        "moodScore": 4,
        "emotionLabel": "Hope",
        "stressLevel": 2,
        "sleepQuality": 4,
        "journalEntry": "Feeling lighter and more hopeful after consultation and grounding exercise."
    }
    status, mood_res = make_req(f"{BASE_URL}/moods", method="POST", data=mood_payload, headers=patient_headers)
    assert status in [200, 201], f"Mood log failed: {mood_res}"
    print("   [OK] Mood entry saved.")

    status, chat_msg_res = make_req(f"{BASE_URL}/chatbot/messages", method="POST", data={"message": "Can you guide me through a 5-minute breathing routine?"}, headers=patient_headers)
    assert status in [200, 201], f"Chat message failed: {chat_msg_res}"
    bot_reply = chat_msg_res["data"]
    reply_str = bot_reply.get("messageText") or bot_reply.get("message") or ""
    print(f"   [OK] AI Chatbot responded: \"{reply_str[:80]}...\"")

    # 9. Safety Triage Test: Crisis Escalation
    print("\n9. Testing Immediate Safety Triage & Crisis Helpline Escalation...")
    status, crisis_data = make_req(f"{AI_URL}/api/v1/risk-assessment", method="POST", data={
        "text": "I want to end my life, I cannot bear this anymore",
        "has_self_harm_thoughts": True
    })
    assert status == 200
    assert crisis_data["is_immediate_safety_concern"] == True, "Immediate safety concern should be True"
    assert crisis_data["risk_level"] == "IMMEDIATE_SAFETY_CONCERN", "Should escalate to IMMEDIATE_SAFETY_CONCERN"
    assert len(crisis_data["emergency_resources"]) > 0, "Should provide emergency helpline numbers"
    print(f"   [OK] Crisis detection verified:")
    print(f"        - Immediate Safety Concern: {crisis_data['is_immediate_safety_concern']}")
    print(f"        - Risk Level: {crisis_data['risk_level']}")
    print(f"        - Primary Helpline: {crisis_data['emergency_resources'][0]['name']} ({crisis_data['emergency_resources'][0]['helpline']})")

    print("\n==================================================================")
    print(">>> ALL FULL-STACK WORKFLOW TESTS COMPLETED SUCCESSFULLY (100%) <<<")
    print("==================================================================")

if __name__ == "__main__":
    try:
        test_e2e()
    except Exception as e:
        print(f"\n[FAIL] Test encountered error: {e}", file=sys.stderr)
        sys.exit(1)
