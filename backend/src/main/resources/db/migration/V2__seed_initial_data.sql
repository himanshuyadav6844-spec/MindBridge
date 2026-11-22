-- ==============================================================================
-- MindBridge Database Migration: V2__seed_initial_data.sql
-- Description: Seed evidence-informed CBT exercises, assessment questions,
--              sample verified doctors with availability, and development seed data.
-- ==============================================================================

-- 1. SEED CBT EXERCISES (9 evidence-informed exercises)
INSERT INTO cbt_exercises (id, title, slug, category, description, instructions, duration_minutes, exercise_type, prompt_template_json, is_active)
VALUES
(
    'c0000000-0000-0000-0000-000000000001',
    'Thought Journal',
    'thought-journal',
    'Cognitive Restructuring',
    'Record automatic thoughts, examine situations that triggered them, and notice connection to emotions.',
    '1. Describe the situation or trigger.\n2. Write down your immediate automatic thought.\n3. Rate the intensity of your emotion (1-100).\n4. Identify whether the thought is fully accurate or biased.',
    15,
    'THOUGHT_JOURNAL',
    '{"fields": ["situation", "automatic_thought", "emotion_and_intensity", "initial_belief_percentage"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000002',
    'Cognitive Restructuring',
    'cognitive-restructuring',
    'Cognitive Restructuring',
    'Transform unhelpful cognitive distortions into balanced, realistic, and compassionate perspectives.',
    '1. Note the catastrophic or distorted thought.\n2. Identify cognitive distortions (e.g., all-or-nothing, jumping to conclusions).\n3. Find evidence supporting and contradicting the thought.\n4. Formulate an adaptive, balanced replacement thought.',
    20,
    'RESTRUCTURING',
    '{"fields": ["negative_thought", "distortion_type", "evidence_for", "evidence_against", "balanced_perspective"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000003',
    'Identifying Negative Thought Patterns',
    'identifying-thought-patterns',
    'Awareness',
    'Recognize frequent cognitive traps such as catastrophizing, mental filtering, and emotional reasoning.',
    'Select recurring thoughts from your week and tag them against common cognitive distortion patterns.',
    10,
    'PATTERN_DETECTION',
    '{"fields": ["recent_thoughts", "identified_distortion", "personal_impact", "action_step"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000004',
    'Thought Challenging & Socratic Questioning',
    'thought-challenging',
    'Cognitive Restructuring',
    'Apply structured Socratic inquiry to test the validity and utility of distressing automatic beliefs.',
    'Ask yourself: What is the worst that could realistically happen? How would I cope? What would I tell a close friend?',
    15,
    'SOCRATIC_CHALLENGE',
    '{"fields": ["worry_belief", "worst_case_reality", "best_case_scenario", "most_likely_outcome", "friend_advice"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000005',
    'Gratitude Journal',
    'gratitude-journal',
    'Positive Psychology',
    'Cultivate positive emotional resilience by identifying meaningful moments, relationships, and achievements.',
    'List three specific things you feel grateful for today, why each is meaningful, and how it made you feel.',
    10,
    'GRATITUDE',
    '{"fields": ["gratitude_1", "gratitude_2", "gratitude_3", "reflection"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000006',
    'Guided Box & 4-7-8 Breathing',
    'guided-breathing',
    'Somatic Regulation',
    'Regulate autonomic nervous system arousal through rhythmically paced 4-4-4-4 box breathing or 4-7-8 relaxation.',
    'Inhale gently through nose for 4 seconds, hold for 4, exhale slowly through mouth for 4, pause for 4. Repeat 4 cycles.',
    5,
    'BREATHING',
    '{"technique": "BOX_BREATHING", "cycles": 4, "inhale_sec": 4, "hold_sec": 4, "exhale_sec": 4, "pause_sec": 4}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000007',
    'Progressive Stress & Muscle Management',
    'stress-management',
    'Stress Management',
    'Release somatic tension through intentional progressive muscle relaxation and grounding techniques.',
    'Work from toes to shoulders: tense muscle group for 5 seconds, release completely for 10 seconds. Notice warm sensation.',
    15,
    'SOMATIC_RELAXATION',
    '{"fields": ["tension_points_before", "sensations_during", "calm_score_after"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000008',
    'Daily Reflection & Mindful Check-in',
    'daily-reflection',
    'Mindfulness',
    'End your day with compassionate self-inquiry, recognizing accomplishments and releasing uncontrollable stressors.',
    'Reflect on: What went well? What challenged me? What can I let go of tonight to rest peacefully?',
    10,
    'REFLECTION',
    '{"fields": ["successes", "challenges_encountered", "things_to_release", "intention_for_tomorrow"]}',
    TRUE
),
(
    'c0000000-0000-0000-0000-000000000009',
    'Positive Activity Planning & Behavioral Activation',
    'positive-activity-planning',
    'Behavioral Activation',
    'Overcome withdrawal and inertia by scheduling manageable mastery and pleasure activities.',
    'Select one small pleasant activity and one mastery task. Schedule exact day, time, and track mood shift afterward.',
    15,
    'BEHAVIORAL_ACTIVATION',
    '{"fields": ["pleasure_activity", "mastery_task", "scheduled_datetime", "predicted_pleasure", "actual_pleasure"]}',
    TRUE
)
ON CONFLICT (slug) DO NOTHING;


-- 2. SEED ASSESSMENT QUESTIONS (Validated screening dimensions: PHQ-9 & GAD-7 indicators, sleep, stress, safety)
INSERT INTO assessment_questions (id, category, question_text, question_type, options_json, display_order, is_active)
VALUES
(
    'a0000000-0000-0000-0000-000000000001',
    'Mood & Interest',
    'Over the last 2 weeks, how often have you had little interest or pleasure in doing things?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    1,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000002',
    'Mood & Affect',
    'Over the last 2 weeks, how often have you felt down, depressed, or hopeless?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    2,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000003',
    'Sleep Quality',
    'Over the last 2 weeks, how often have you had trouble falling or staying asleep, or sleeping too much?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    3,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000004',
    'Energy & Fatigue',
    'Over the last 2 weeks, how often have you felt tired or had little energy?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    4,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000005',
    'Anxiety & Nervousness',
    'Over the last 2 weeks, how often have you felt nervous, anxious, or on edge?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    5,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000006',
    'Worry & Control',
    'Over the last 2 weeks, how often have you not been able to stop or control worrying?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    6,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000007',
    'Concentration & Focus',
    'Over the last 2 weeks, how often have you had trouble concentrating on things, such as reading or work?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    7,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000008',
    'Daily Functioning & Overwhelm',
    'Over the last 2 weeks, how difficult have these emotional or physical problems made it for you to do your work, take care of things at home, or get along with other people?',
    'LIKERT_4',
    '[{"label": "Not difficult at all", "score": 0}, {"label": "Somewhat difficult", "score": 1}, {"label": "Very difficult", "score": 2}, {"label": "Extremely difficult", "score": 3}]',
    8,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000009',
    'Personal Safety & Distress',
    'Over the past 2 weeks, have you had thoughts that you would be better off dead, or thoughts of hurting yourself in any way?',
    'LIKERT_4',
    '[{"label": "Not at all", "score": 0}, {"label": "Several days", "score": 1}, {"label": "More than half the days", "score": 2}, {"label": "Nearly every day", "score": 3}]',
    9,
    TRUE
),
(
    'a0000000-0000-0000-0000-000000000010',
    'Qualitative Reflection',
    'In your own words, please describe what has been causing you the most stress or how you have been feeling lately (optional):',
    'TEXT',
    '[]',
    10,
    TRUE
)
ON CONFLICT (id) DO NOTHING;


-- 3. SEED INITIAL VERIFIED DOCTORS (with BCrypt password hash for 'Password123!')
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy ('Password123!')
INSERT INTO users (id, email, password_hash, full_name, role, phone_number, is_active)
VALUES
(
    '10000000-0000-0000-0000-000000000001',
    'dr.sharma@mindbridge.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Dr. Priya Sharma, Ph.D.',
    'ROLE_DOCTOR',
    '+91-9876543210',
    TRUE
),
(
    '10000000-0000-0000-0000-000000000002',
    'dr.verma@mindbridge.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Dr. Rajesh Verma, M.D.',
    'ROLE_DOCTOR',
    '+91-9876543211',
    TRUE
),
(
    '10000000-0000-0000-0000-000000000003',
    'dr.ananya@mindbridge.local',
    '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy',
    'Dr. Ananya Iyer, M.Phil',
    'ROLE_DOCTOR',
    '+91-9876543212',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO doctor_profiles (id, user_id, qualification, primary_specialization, experience_years, license_number, consultation_fee, professional_description, consultation_modes, is_verified, rating, total_reviews)
VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'Ph.D. in Clinical Psychology (NIMHANS)',
    'Clinical Psychology',
    12,
    'RCI-PSY-2012-00481',
    1500.00,
    'Specialist in Cognitive Behavioral Therapy (CBT), adult anxiety disorders, depressive episodes, and trauma-informed care with over 12 years of clinical hospital and private practice experience.',
    'VIDEO,AUDIO,IN_PERSON',
    TRUE,
    4.9,
    48
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'M.D. in Psychiatry (AIIMS New Delhi)',
    'Psychiatry',
    15,
    'MCI-MED-2009-88319',
    2200.00,
    'Consultant Psychiatrist specializing in affective mood disorders, severe anxiety states, neuro-psychiatry, and combined bio-psychosocial interventions.',
    'VIDEO,IN_PERSON',
    TRUE,
    4.8,
    62
),
(
    '20000000-0000-0000-0000-000000000003',
    '10000000-0000-0000-0000-000000000003',
    'M.Phil in Counselling Psychology',
    'Counselling Psychology',
    8,
    'RCI-COU-2016-01994',
    1200.00,
    'Empathetic counselling psychologist working with young adults, academic and workplace burnout, relationship distress, and mindfulness-based stress reduction.',
    'VIDEO,AUDIO',
    TRUE,
    4.9,
    37
)
ON CONFLICT (license_number) DO NOTHING;

-- Specializations
INSERT INTO doctor_specializations (doctor_id, specialization_name)
VALUES
('20000000-0000-0000-0000-000000000001', 'Cognitive Behavioral Therapy (CBT)'),
('20000000-0000-0000-0000-000000000001', 'Anxiety & Panic Disorders'),
('20000000-0000-0000-0000-000000000002', 'Affective Mood Disorders'),
('20000000-0000-0000-0000-000000000002', 'Clinical Depression & Bipolar'),
('20000000-0000-0000-0000-000000000003', 'Mindfulness-Based Stress Reduction'),
('20000000-0000-0000-0000-000000000003', 'Workplace Burnout & Stress')
ON CONFLICT DO NOTHING;

-- Availability slots for Dr. Priya Sharma
INSERT INTO doctor_availability (doctor_id, day_of_week, start_time, end_time, is_active)
VALUES
('20000000-0000-0000-0000-000000000001', 'MONDAY', '09:00', '13:00', TRUE),
('20000000-0000-0000-0000-000000000001', 'MONDAY', '14:00', '18:00', TRUE),
('20000000-0000-0000-0000-000000000001', 'TUESDAY', '09:00', '13:00', TRUE),
('20000000-0000-0000-0000-000000000001', 'WEDNESDAY', '10:00', '16:00', TRUE),
('20000000-0000-0000-0000-000000000001', 'THURSDAY', '09:00', '14:00', TRUE),
('20000000-0000-0000-0000-000000000001', 'FRIDAY', '10:00', '17:00', TRUE),

-- Availability slots for Dr. Rajesh Verma
('20000000-0000-0000-0000-000000000002', 'MONDAY', '11:00', '17:00', TRUE),
('20000000-0000-0000-0000-000000000002', 'TUESDAY', '11:00', '17:00', TRUE),
('20000000-0000-0000-0000-000000000002', 'THURSDAY', '14:00', '19:00', TRUE),
('20000000-0000-0000-0000-000000000002', 'SATURDAY', '10:00', '15:00', TRUE),

-- Availability slots for Dr. Ananya Iyer
('20000000-0000-0000-0000-000000000003', 'TUESDAY', '10:00', '18:00', TRUE),
('20000000-0000-0000-0000-000000000003', 'WEDNESDAY', '10:00', '18:00', TRUE),
('20000000-0000-0000-0000-000000000003', 'FRIDAY', '11:00', '18:00', TRUE),
('20000000-0000-0000-0000-000000000003', 'SATURDAY', '09:00', '14:00', TRUE)
ON CONFLICT DO NOTHING;
