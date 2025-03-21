import os
from typing import List

import aiohttp

from ..schemas.response_models import VideoSearchResult
from ..services.youtube_service import YouTubeService


class GoogleSearchService:
    def __init__(self):
        self.api_key = os.getenv("GOOGLE_SEARCH_API_KEY", "")
        self.search_engine_id = os.getenv("GOOGLE_SEARCH_ENGINE_ID", "")
        self.base_url = "https://www.googleapis.com/customsearch/v1"
        self.youtube_service = YouTubeService()

    async def search_videos(
        self, query: str, max_results: int = 5
    ) -> List[VideoSearchResult]:
        """
        Search for YouTube videos using Google Custom Search API.
        This can find more contextually relevant videos than direct YouTube search.
        """
        if not self.api_key or not self.search_engine_id:
            print(
                "Google Search API key or engine ID not configured, falling back to YouTube search"
            )
            return await self.youtube_service.search_videos(query, max_results)

        # Append "youtube" to the query to improve chances of finding YouTube videos
        enhanced_query = f"{query} youtube"

        params = {
            "key": self.api_key,
            "cx": self.search_engine_id,
            "q": enhanced_query,
            "num": max_results
            * 2,  # Request more results as some might not be YouTube videos
            "siteSearch": "youtube.com",
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(self.base_url, params=params) as response:
                if response.status != 200:
                    # Log the error and fall back to YouTube search
                    error_text = await response.text()
                    print(f"Google Search API error: {error_text}")
                    return await self.youtube_service.search_videos(query, max_results)

                data = await response.json()

                youtube_urls = []
                for item in data.get("items", []):
                    url = item.get("link", "")
                    if "youtube.com/watch" in url or "youtu.be/" in url:
                        youtube_urls.append(url)

                # Extract video IDs and get details
                results = []
                for url in youtube_urls[:max_results]:
                    video_id = await self.youtube_service.extract_video_id(url)
                    if video_id:
                        video_details = await self.youtube_service.get_video_details(
                            video_id
                        )
                        if video_details:
                            results.append(video_details)

                return results
