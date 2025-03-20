from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.v1.endpoints import video
from dotenv import load_dotenv


load_dotenv()

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

app.include_router(video.router, prefix="/api/v1", tags=["video"])
