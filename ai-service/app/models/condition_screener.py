from typing import List, Dict, Any
from app.schemas.request_models import QuestionResponseItem
from app.schemas.response_models import ProbableConditionScreening

class ConditionScreener:
    """
    Evidence-informed screening assessment based on standardized instrument indicators.
    Explicitly provides supportive screening reflections, NOT clinical medical diagnoses.
    """

    def screen(self, responses: List[QuestionResponseItem]) -> List[ProbableConditionScreening]:
        # Group scores by symptom clusters
        depression_score = 0
        depression_items = []

        anxiety_score = 0
        anxiety_items = []

        stress_score = 0
        stress_items = []

        sleep_score = 0
        sleep_items = []

        for item in responses:
            cat = (item.category or "").lower()
            q_text = (item.question_text or "").lower()
            s = item.score

            if "mood" in cat or "interest" in q_text or "hopeless" in q_text or "depress" in q_text:
                depression_score += s
                if s >= 2:
                    depression_items.append("Frequent low mood or loss of interest in daily activities")
            
            if "anxiety" in cat or "nervous" in q_text or "worry" in q_text or "edge" in q_text:
                anxiety_score += s
                if s >= 2:
                    anxiety_items.append("Persistent feelings of nervousness or uncontrollable worry")

            if "sleep" in cat or "sleep" in q_text or "insomnia" in q_text:
                sleep_score += s
                if s >= 2:
                    sleep_items.append("Disrupted sleep cycle or difficulty resting")

            if "stress" in cat or "functioning" in cat or "overwhelm" in q_text or "difficult" in q_text or "fatigue" in cat:
                stress_score += s
                if s >= 2:
                    stress_items.append("Challenges with daily task management and elevated fatigue")

        screenings = []

        # 1. Depression Symptom Screening (Max ~9 across relevant questions)
        dep_sev = self._get_severity(depression_score, max_score=6)
        screenings.append(ProbableConditionScreening(
            condition_name="Depression-Related Symptom Screening",
            severity_indicator=dep_sev,
            screening_score=depression_score,
            max_possible_score=6,
            symptom_indicators=depression_items if depression_items else ["Few or no significant depressive symptoms reported."],
            clinical_disclaimer="Your responses indicate symptoms that may correlate with low mood or depressive episodes. This is not a formal diagnosis. A qualified psychologist or psychiatrist can provide full diagnostic clarity."
        ))

        # 2. Anxiety Symptom Screening (Max ~6 across relevant questions)
        anx_sev = self._get_severity(anxiety_score, max_score=6)
        screenings.append(ProbableConditionScreening(
            condition_name="Anxiety-Related Symptom Screening",
            severity_indicator=anx_sev,
            screening_score=anxiety_score,
            max_possible_score=6,
            symptom_indicators=anxiety_items if anxiety_items else ["Few or no persistent anxiety symptoms reported."],
            clinical_disclaimer="Your responses suggest anxiety-related indicators. This is an informational screening and does not constitute an anxiety disorder diagnosis. Consulting a healthcare provider is recommended for thorough evaluation."
        ))

        # 3. Stress & Fatigue Concerns (Max ~6)
        stress_sev = self._get_severity(stress_score, max_score=6)
        screenings.append(ProbableConditionScreening(
            condition_name="Stress & Daily Functioning Indicators",
            severity_indicator=stress_sev,
            screening_score=stress_score,
            max_possible_score=6,
            symptom_indicators=stress_items if stress_items else ["Daily functioning and stress levels appear manageable."],
            clinical_disclaimer="Stress screening reflects self-reported pressure in personal and professional environments."
        ))

        # 4. Sleep Pattern Screening (Max 3)
        sleep_sev = "Minimal"
        if sleep_score == 3:
            sleep_sev = "Severe"
        elif sleep_score == 2:
            sleep_sev = "Moderate"
        elif sleep_score == 1:
            sleep_sev = "Mild"

        screenings.append(ProbableConditionScreening(
            condition_name="Sleep Disturbance Screening",
            severity_indicator=sleep_sev,
            screening_score=sleep_score,
            max_possible_score=3,
            symptom_indicators=sleep_items if sleep_items else ["No severe sleep disruption reported."],
            clinical_disclaimer="Sleep quality substantially impacts emotional resilience. Ongoing sleep disruption warrants medical and behavioral review."
        ))

        return screenings

    def _get_severity(self, score: int, max_score: int) -> str:
        ratio = score / max(1, max_score)
        if ratio >= 0.75:
            return "Severe"
        elif ratio >= 0.50:
            return "Moderate"
        elif ratio >= 0.25:
            return "Mild"
        return "Minimal"
