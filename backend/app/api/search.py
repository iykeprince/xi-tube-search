from typing import List, Optional

from fastapi import APIRouter, Depends, HTTPException

from ..schemas.request_models import SearchQuery
from ..schemas.response_models import VideoSearchResult
from ..services.google_search_service import GoogleSearchService
from ..services.youtube_service import YouTubeService

router = APIRouter()


# Service dependency injection
def get_google_search_service() -> GoogleSearchService:
    return GoogleSearchService()


def get_youtube_service() -> YouTubeService:
    return YouTubeService()


@router.post("/search", response_model=List[VideoSearchResult])
async def search_videos(
    query: SearchQuery,
    google_search_service: GoogleSearchService = Depends(get_google_search_service),
    youtube_service: YouTubeService = Depends(get_youtube_service),
):
    """
    Search for YouTube videos based on the provided query.

    First tries to find videos through Google Custom Search API,
    then falls back to direct YouTube search if needed.
    """
    try:
        # First try to find videos via Google Search
        videos = await google_search_service.search_videos(query.query)

        # If no results from Google, use YouTube API directly
        if not videos:
            videos = await youtube_service.search_videos(query.query)

        # If still no results, raise an exception
        if not videos:
            raise HTTPException(
                status_code=404, detail="No videos found for the given query."
            )

        return videos
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to search for videos: {str(e)}"
        )


@router.get("/video/{video_id}", response_model=VideoSearchResult)
async def get_video_details(
    video_id: str, youtube_service: YouTubeService = Depends(get_youtube_service)
):
    """
    Get detailed information about a specific YouTube video by ID.
    """
    try:
        video = await youtube_service.get_video_details(video_id)
        if not video:
            raise HTTPException(status_code=404, detail="Video not found")
        return video
    except Exception as e:
        raise HTTPException(
            status_code=500, detail=f"Failed to get video details: {str(e)}"
        )
