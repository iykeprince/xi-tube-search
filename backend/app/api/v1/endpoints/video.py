from fastapi import APIRouter, HTTPException
from app.services import (
    video_search,
    transcript_extraction,
    # summary_generation,
    # text_to_speech,
    # sentiment_analysis,
)


router = APIRouter()


@router.get("/search")
async def search_videos(query: str):
    """
    Search for videos based on a query string.
    """
    video_links = video_search.serpapi_youtube_search(query)
    if not video_links:
        raise HTTPException(status_code=404, detail="No videos found.")
    return {"video_links": video_links}


@router.get("/transcript")
async def get_transcript(video_id: str):
    """
    Extract or generate a transcript for a given video.
    """
    transcript = transcript_extraction.get_video_transcript(video_id)
    if not transcript:
        raise HTTPException(status_code=404, detail="No transcipt found.")
    return {"transcipt": transcript}


@router.get("/summarize")
async def summarize_transcript(transcript: str):
    """
    Generate a summary of the transcript for a given video.
    """
    pass


@router.get("/text-to-speech")
async def text_to_speech_conversion(summary: str):
    """
    Convert the summary of a video into speech.
    """
    pass


@router.get("/sentiment")
async def analyze_sentiment(transcript: str):
    """
    Perform sentiment analysis on the transcript of a video.
    """
    pass
