from typing import List
from app.schemas.response_models import CrisisResource

VERIFIED_CRISIS_RESOURCES: List[CrisisResource] = [
    CrisisResource(
        name="Tele-MANAS (Govt. of India National Mental Health Helpline)",
        helpline="14416 / 1800-891-4416",
        hours="24/7 Available across India in 20+ Languages",
        description="Comprehensive mental health care service offering immediate tele-counselling by qualified psychiatric professionals.",
        website="https://telemanas.mohfw.gov.in"
    ),
    CrisisResource(
        name="KIRAN National Mental Health Helpline",
        helpline="1800-599-0019",
        hours="24/7 Free & Confidential",
        description="Initiative by the Ministry of Social Justice and Empowerment offering psychological first aid, distress mitigation, and crisis management.",
        website="https://disabilityaffairs.gov.in"
    ),
    CrisisResource(
        name="Vandrevala Foundation Helpline",
        helpline="+91 9999 666 555",
        hours="24/7 Free Telephone and WhatsApp Counselling",
        description="Experienced clinical psychologists and trained counsellors providing crisis intervention and empathetic emotional support.",
        website="https://www.vandrevalafoundation.com"
    ),
    CrisisResource(
        name="AASRA Suicide Prevention Helpline",
        helpline="+91 98204 66726",
        hours="24/7 Professional Crisis Care",
        description="Crisis intervention center providing confidential emotional support for individuals in acute distress or feeling suicidal.",
        website="http://www.aasra.info"
    ),
    CrisisResource(
        name="Emergency Medical Services",
        helpline="112",
        hours="24/7 All-India Emergency Response",
        description="National unified emergency response service for acute physical or medical crisis emergencies."
    )
]
