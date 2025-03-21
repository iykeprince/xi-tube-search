from pydantic import BaseModel, Field
from typing import Optional, List


class SearchQuery(BaseModel):
    """Request model for searching videos"""

    query: str = Field(..., description="The search query or YouTube URL")


class TranscriptRequest(BaseModel):
    """Request model for fetching video transcript"""

    video_id: str = Field(..., description="The YouTube video ID")


class SummaryRequest(BaseModel):
    """Request model for generating video summary"""

    video_id: str = Field(..., description="The YouTube video ID")
    include_sentiment: bool = Field(
        False, description="Whether to include sentiment analysis"
    )
    custom_instructions: Optional[str] = Field(
        None, description="Custom instructions for summary generation"
    )


class TextToSpeechRequest(BaseModel):
    """Request model for text-to-speech conversion"""

    text: str = Field(..., description="The text to convert to speech")
