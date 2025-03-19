from fastapi import HTTPException
from youtube_transcript_api import YouTubeTranscriptApi


def get_video_transcript(video_id: str):
    """
    Fetch the transcript of a YouTube video using its video ID.
    """
    try:
        transcript = YouTubeTranscriptApi().fetch(video_id)
        text = " ".join([item["text"] for item in transcript])
        return text
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcript error: {e}")
        # Use a Google search summary if it fails
