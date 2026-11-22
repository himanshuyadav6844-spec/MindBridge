# Mind-Bridge – AI-Powered Mental Health Companion

Mind-Bridge is a full-stack, AI-integrated emotional well-being assessment and support platform designed to help individuals evaluate their mental wellness, access personalized cognitive behavioral therapy (CBT) exercises, interact with a supportive mental wellness chatbot, and connect with verified mental health professionals.

> **CRITICAL MEDICAL DISCLAIMER**:
> Mind-Bridge is an emotional wellness, mood tracking, and preliminary screening platform. **It is NOT a diagnostic medical device and does NOT diagnose clinical conditions.** Diagnostic evaluations and medical treatment recommendations remain strictly the purview of licensed healthcare professionals. Any immediate safety or crisis indicators automatically trigger emergency human support routing.

---

## Architecture Overview

```
                                      +------------------------------------+
                                      |          React + Vite + TS         |
                                      |         Tailwind CSS Frontend      |
                                      +-----------------+------------------+
                                                        |
                                                        | REST / JWT
                                                        v
                                      +-----------------+------------------+
                                      |        Spring Boot 3 Backend       |
                                      |     (Java 21, Spring Security)     |
                                      +--------+------------------+--------+
                                               |                  |
                                    JPA/Flyway |                  | HTTP / REST
                                               v                  v
                            +------------------+----+     +-------+--------------------+
                            |  PostgreSQL 16.6 DB   |     |    Python 3.12 AI Engine   |
                            | (20 Relational Tables)|     | (FastAPI + Scikit-Learn)   |
                            +-----------------------+     +----------------------------+
```

### Care Routing Pathways
1. **Workflow A: Low / Moderate Concern**
   - Access to evidence-based CBT exercises (Cognitive Restructuring, Behavioral Activation, Grounding).
   - Daily Mood & Emotion Logging with interactive Recharts visualizations.
   - Non-judgmental AI Mental Wellness Chatbot.
   - Self-paced progress monitoring.

2. **Workflow B: Significant Concern**
   - Clinician recommendation highlighting vetted psychiatrists and clinical psychologists.
   - Integrated practitioner profile review, availability schedule, and appointment booking.
   - Prevention of double-booking via database constraints and transaction isolation.
   - Pre-session notifications and daily reminders.
   - Clinical consultation documentation workspace for practitioners.
   - Post-consultation doctor acknowledgement, clinical impression summaries, and patient review feedback.

3. **Urgent Safety Pathway (Crisis Triage)**
   - Rule-based keyword matching and high-risk PHQ-9 safety screening triggers.
   - Direct connection to emergency crisis helplines:
     - **Tele-MANAS**: `14416` (National Mental Health Helpline)
     - **KIRAN**: `1800-599-0019` (Mental Health Rehabilitation Helpline)
     - **National Emergency**: `112`
   - Emergency contact notification support.

---

## Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite 5, TypeScript 5, Tailwind CSS, Lucide React, Recharts, Axios, React Router DOM 6 |
| **Backend** | Java 21, Spring Boot 3.3.5, Spring Security 6, JWT, Spring Data JPA, Hibernate, Flyway Migrations |
| **Database** | PostgreSQL 16.6 (Normalized schema, FK constraints, unique slot indices) |
| **AI Microservice** | Python 3.12, FastAPI, Uvicorn, Scikit-learn, Pandas, NumPy, NLTK, PyTorch compatible |
| **Containerization** | Docker, Docker Compose, Multi-stage builds, Alpine Nginx |

---

## Directory Structure

```
MindBridge/
├── ai-service/                   # Python FastAPI AI Microservice
│   ├── app/
│   │   ├── api/v1/               # Health, inference, batch & risk assessment endpoints
│   │   ├── models/               # Model candidate loaders (sentiment & 9-class emotion)
│   │   ├── preprocessing/        # NLP text cleaning and tokenization
│   │   ├── safety/               # Crisis detection engine & emergency helpline directory
│   │   ├── schemas/              # Pydantic validation schemas
│   │   ├── services/             # Scoring, condition screening & workflow routing
│   │   └── training/             # Scikit-learn training scripts with synthetic corpora
│   ├── tests/                    # Pytest test suite (12 passing tests)
│   ├── trained_models/           # Serialized joblib pipelines
│   ├── Dockerfile
│   └── requirements.txt
├── backend/                      # Spring Boot 3 Core Backend
│   ├── src/main/java/com/mindbridge/
│   │   ├── config/               # Security, WebMvc, OpenAPI, CORS configuration
│   │   ├── security/             # JWT filter, UserDetailsService, AuthEntryPoint
│   │   ├── common/               # ApiResponse, global ExceptionHandler, BaseEntity
│   │   └── modules/              # 15 Domain modules (auth, patient, doctor, assessment,
│   │                             # cbt, mood, chatbot, appointment, consultation, admin...)
│   ├── src/main/resources/
│   │   ├── application.yml       # Production/development configuration
│   │   └── db/migration/         # Flyway V1 (20 tables) and V2 (seed data)
│   ├── src/test/java/            # Integration & double-booking prevention tests
│   ├── Dockerfile
│   └── pom.xml
├── frontend/                     # React + Vite + TypeScript Frontend
│   ├── src/
│   │   ├── components/           # Navbar, Sidebar, Footer, ProtectedRoute
│   │   ├── context/              # AuthContext with token persistence
│   │   ├── layouts/              # AppLayout shell
│   │   ├── pages/                # 18 Full-featured pages (Landing, Dashboard, Assessment,
│   │   │                         # Doctor directory, Booking, Consultation, CBT, Chat...)
│   │   ├── routes/               # AppRoutes with role-based guards
│   │   ├── services/             # Axios API clients for all domains
│   │   └── types/                # Strongly-typed TypeScript interfaces
│   ├── Dockerfile
│   └── nginx.conf
├── docs/                         # Architecture documentation & API references
├── docker-compose.yml            # Multi-service container orchestration
├── .env.example                  # Environment configuration template
├── DEVELOPMENT_PROGRESS.md       # Exhaustive phase-by-phase implementation log
└── README.md
```

---

## AI Engine Capabilities

The AI service operates five core analytical modules:
1. **Sentiment Analysis**: Classifies patient narratives as Positive, Negative, or Neutral with confidence probabilities using TF-IDF and Logistic Regression.
2. **Emotion Detection**: Predicts 9 discrete affective states: `Happiness`, `Sadness`, `Anger`, `Fear`, `Anxiety`, `Frustration`, `Loneliness`, `Hope`, and `Neutral`.
3. **Mood Analysis**: Synthesizes questionnaire response indicators and self-reported ratings onto a unified 1–5 mood index.
4. **Distress & Risk Assessment**: Multi-tiered risk classification into `LOW_CONCERN`, `MODERATE_CONCERN`, `SIGNIFICANT_CONCERN`, or `IMMEDIATE_SAFETY_CONCERN`.
5. **Probable Condition Screening**: Identifies non-diagnostic symptom clusters related to Depressive Symptoms, Generalized Anxiety, Chronic Stress, or Sleep Disruption.

---

## Seed Test Accounts

All accounts use the password: `Password123!`

| Role | Email | Name / Specialization | Status |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@mindbridge.org` | Platform Administrator | Active |
| **Doctor** | `dr.ananya@mindbridge.org` | Dr. Ananya Sen (Clinical Psychologist) | Verified |
| **Doctor** | `dr.rohit@mindbridge.org` | Dr. Rohit Verma (Psychiatrist) | Verified |
| **Doctor** | `dr.priya@mindbridge.org` | Dr. Priya Nair (CBT Specialist) | Verified |
| **Patient** | `patient@example.com` | Aarav Sharma | Active |

---

## Running with Docker Compose

To launch all four services (PostgreSQL, AI Microservice, Spring Boot, and Frontend) simultaneously:

```bash
docker-compose up --build
```

- **Frontend**: `http://localhost:5173`
- **Backend API**: `http://localhost:8080/api`
- **Swagger UI**: `http://localhost:8080/swagger-ui.html`
- **AI Microservice**: `http://localhost:8000/docs`
