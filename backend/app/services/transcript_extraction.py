from fastapi import HTTPException
from youtube_transcript_api import YouTubeTranscriptApi, _errors


def get_video_transcript(video_id: str):
    """
    Fetch the transcript of a YouTube video using its video ID.
    """
    try:
        transcript = YouTubeTranscriptApi.get_transcript(video_id)
        text = " ".join([item["text"] for item in transcript])
        return text
    except _errors.TranscriptsDisabled:
        raise HTTPException(
            status_code=500,
            detail=f"Transcripts are disabled for video: {video_id}\n{e}",
        )
    except _errors.NoTranscriptFound:
        raise HTTPException(
            status_code=500,
            detail=f"No transcript available for video: {video_id}\n{e}",
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Transcript error: {e}")
