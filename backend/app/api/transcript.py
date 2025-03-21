from fastapi import APIRouter, Depends, HTTPException

from ..schemas.request_models import TranscriptRequest
from ..schemas.response_models import TranscriptResponse
from ..services.youtube_service import YouTubeService

router = APIRouter()


# Service dependency injection
def get_youtube_service() -> YouTubeService:
    return YouTubeService()


@router.post("/transcript", response_model=TranscriptResponse)
async def get_transcript(
    request: TranscriptRequest,
    youtube_service: YouTubeService = Depends(get_youtube_service),
):
    """
    Extract transcript from a YouTube video.
    """
    try:
        transcript = await youtube_service.get_transcript(request.video_id)
        if not transcript:
            raise HTTPException(
                status_code=404, detail="Transcript not available for this video."
            )

        return TranscriptResponse(video_id=request.video_id, transcript=transcript)
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to extract transcript: {str(e)}"
        )
