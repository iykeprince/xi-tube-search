from fastapi import FastAPI
from .api.v1.endpoints import video
from dotenv import load_dotenv


load_dotenv()
app = FastAPI()

app.include_router(video.router, prefix="/api/v1", tags=["video"])
