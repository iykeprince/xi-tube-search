from fastapi import APIRouter, Depends, HTTPException

from ..schemas.request_models import SummaryRequest
from ..schemas.response_models import SummaryResponse
from ..services.ai_service import AIService
from ..services.youtube_service import YouTubeService

router = APIRouter()


# Service dependency injection
def get_youtube_service() -> YouTubeService:
    return YouTubeService()


def get_ai_service() -> AIService:
    return AIService()


@router.post("/summary", response_model=SummaryResponse)
async def generate_summary(
    request: SummaryRequest,
    youtube_service: YouTubeService = Depends(get_youtube_service),
    ai_service: AIService = Depends(get_ai_service),
):
    """
    Generate a summary for a YouTube video using AI.
    """
    try:
        # First, get the transcript
        transcript = await youtube_service.get_transcript(request.video_id)
        if not transcript:
            raise HTTPException(
                status_code=404, detail="Transcript not available for this video."
            )

        # Next, get video details for context
        video_details = await youtube_service.get_video_details(request.video_id)
        if not video_details:
            raise HTTPException(status_code=404, detail="Video details not found.")

        # Generate summary using AI
        summary = await ai_service.generate_summary(
            transcript=transcript,
            video_title=video_details.title,
            video_description=video_details.description,
            custom_instructions=request.custom_instructions,
        )

        return SummaryResponse(
            video_id=request.video_id,
            title=video_details.title,
            summary=summary,
            key_points=await ai_service.extract_key_points(summary),
            sentiment=(
                await ai_service.analyze_sentiment(summary)
                if request.include_sentiment
                else None
            ),
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to generate summary: {str(e)}"
        )
