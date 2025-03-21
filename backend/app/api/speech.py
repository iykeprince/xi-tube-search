import base64
import io

from fastapi import APIRouter, Depends, HTTPException, Response

from ..schemas.request_models import TextToSpeechRequest
from ..services.ai_service import AIService

router = APIRouter()


# Service dependency injection
def get_ai_service() -> AIService:
    return AIService()


@router.post("/text-to-speech")
async def text_to_speech(
    request: TextToSpeechRequest, ai_service: AIService = Depends(get_ai_service)
):
    """
    Convert text to speech and return the audio file.
    """
    try:
        # Generate speech from text
        audio_bytes = await ai_service.text_to_speech(request.text)

        # Encode audio to base64 for frontend
        audio_base64 = base64.b64encode(audio_bytes).decode("utf-8")

        return {"audio_data": audio_base64, "mime_type": "audio/mp3"}
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to convert text to speech: {str(e)}"
        )


@router.post("/text-to-speech/download")
async def text_to_speech_download(
    request: TextToSpeechRequest, ai_service: AIService = Depends(get_ai_service)
):
    """
    Convert text to speech and return the audio file for download.
    """
    try:
        # Generate speech from text
        audio_bytes = await ai_service.text_to_speech(request.text)

        # Return audio as downloadable file
        return Response(
            content=audio_bytes,
            media_type="audio/mp3",
            headers={"Content-Disposition": f"attachment; filename=summary.mp3"},
        )
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to convert text to speech: {str(e)}"
        )
