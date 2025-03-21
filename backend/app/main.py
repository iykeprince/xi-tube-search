import os

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

from .api import search, speech, summary, transcript

# Load environment variables
load_dotenv()

# Check for required API keys
required_keys = [
    "YOUTUBE_API_KEY",
    "GOOGLE_SEARCH_API_KEY",
    "GOOGLE_SEARCH_ENGINE_ID",
    "GROQ_API_KEY",
]

for key in required_keys:
    if not os.getenv(key):
        print(f"Warning: {key} environment variable is not set")

# Initialize FastAPI app
app = FastAPI(
    title="YouTube Video Analyzer",
    description="An AI-powered application that automatically finds, analyzes and summarizes YouTube videos based on user queries",
    version="1.0.0",
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(search.router, prefix="/api", tags=["search"])
app.include_router(transcript.router, prefix="/api", tags=["transcript"])
app.include_router(summary.router, prefix="/api", tags=["summary"])
app.include_router(speech.router, prefix="/api", tags=["speech"])


@app.get("/")
async def root():
    """Health check endpoint"""
    return {"status": "online", "message": "YouTube Video Analyzer API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
