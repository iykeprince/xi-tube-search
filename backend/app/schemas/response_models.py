from pydantic import BaseModel, Field
from typing import Optional, List, Dict, Any


class VideoSearchResult(BaseModel):
    """Model for video search results"""

    video_id: str
    title: str
    description: str
    thumbnail_url: str
    channel_title: str
    view_count: int
    like_count: int
    comment_count: int
    published_at: str
    video_url: str


class TranscriptResponse(BaseModel):
    """Model for video transcript response"""

    video_id: str
    transcript: str


class SummaryResponse(BaseModel):
    """Model for video summary response"""

    video_id: str
    title: str
    summary: str
    key_points: List[str]
    sentiment: Optional[Dict[str, Any]] = None
