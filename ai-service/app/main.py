import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="MindBridge AI Mental Health Microservice",
    description="Dedicated AI service powering sentiment analysis, emotion detection, mood inference, safety/distress assessment, and symptom screening.",
    version="1.0.0"
)

# Cross-Origin Resource Sharing
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

@app.get("/health", tags=["Health"])
async def health_check():
    """Health check endpoint for container orchestrators and backend gateway."""
    return {
        "status": "UP",
        "service": "mindbridge-ai-service",
        "models_ready": True,
        "environment": "production-ready"
    }

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run("app.main:app", host="0.0.0.0", port=port, reload=False)
