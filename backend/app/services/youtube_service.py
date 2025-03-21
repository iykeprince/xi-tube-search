import json
import os
from typing import Any, Dict, List, Optional
from urllib.parse import parse_qs, urlparse

import aiohttp
from youtube_transcript_api import YouTubeTranscriptApi, _errors

from ..schemas.response_models import VideoSearchResult


class YouTubeService:
    def __init__(self):
        self.api_key = os.getenv("YOUTUBE_API_KEY", "")
        self.base_url = "https://www.googleapis.com/youtube/v3"

    async def extract_video_id(self, url: str) -> Optional[str]:
        """Extract the video ID from a YouTube URL."""
        parsed_url = urlparse(url)

        if parsed_url.hostname in ("youtu.be",):
            return parsed_url.path[1:]

        if parsed_url.hostname in ("www.youtube.com", "youtube.com"):
            if parsed_url.path == "/watch":
                return parse_qs(parsed_url.query)["v"][0]
            if parsed_url.path.startswith("/embed/"):
                return parsed_url.path.split("/")[2]
            if parsed_url.path.startswith("/v/"):
                return parsed_url.path.split("/")[2]

        # If it looks like just a video ID
        if len(url) == 11 and all(c.isalnum() or c in "-_" for c in url):
            return url

        return None

    async def search_videos(
        self, query: str, max_results: int = 5
    ) -> List[VideoSearchResult]:
        """Search for YouTube videos using the YouTube API."""
        # Check if query is a YouTube URL
        video_id = await self.extract_video_id(query)
        if video_id:
            # It's a URL, get details for this specific video
            video = await self.get_video_details(video_id)
            return [video] if video else []

        # Otherwise, perform a search
        params = {
            "part": "snippet",
            "q": query,
            "type": "video",
            "maxResults": max_results,
            "key": self.api_key,
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/search", params=params
            ) as response:
                if response.status != 200:
                    # Log the error details
                    error_text = await response.text()
                    print(f"YouTube API error: {error_text}")
                    return []

                data = await response.json()

                results = []
                for item in data.get("items", []):
                    video_id = item["id"]["videoId"]
                    snippet = item["snippet"]

                    # Get more details about the video
                    video_details = await self.get_video_details(video_id)
                    if video_details:
                        results.append(video_details)

                return results

    async def get_video_details(self, video_id: str) -> Optional[VideoSearchResult]:
        """Get detailed information about a YouTube video."""
        params = {
            "part": "snippet,contentDetails,statistics",
            "id": video_id,
            "key": self.api_key,
        }

        async with aiohttp.ClientSession() as session:
            async with session.get(
                f"{self.base_url}/videos", params=params
            ) as response:
                if response.status != 200:
                    return None

                data = await response.json()

                if not data.get("items"):
                    return None

                item = data["items"][0]
                snippet = item["snippet"]
                statistics = item["statistics"]

                return VideoSearchResult(
                    video_id=video_id,
                    title=snippet.get("title", ""),
                    description=snippet.get("description", ""),
                    thumbnail_url=snippet.get("thumbnails", {})
                    .get("high", {})
                    .get("url", ""),
                    channel_title=snippet.get("channelTitle", ""),
                    view_count=int(statistics.get("viewCount", 0)),
                    like_count=int(statistics.get("likeCount", 0)),
                    comment_count=int(statistics.get("commentCount", 0)),
                    published_at=snippet.get("publishedAt", ""),
                    video_url=f"https://www.youtube.com/watch?v={video_id}",
                )

    async def get_transcript(self, video_id: str) -> Optional[str]:
        """Get the transcript of a YouTube video."""
        try:
            # Try to get the transcript
            transcript_list = YouTubeTranscriptApi.get_transcript(video_id)

            # Combine all transcript parts
            transcript_text = " ".join([part["text"] for part in transcript_list])

            return transcript_text
        except _errors.TranscriptsDisabled:
            print(f"Transcripts are disabled for video {video_id}")
            return None
        except _errors.NoTranscriptFound:
            print(f"No transcript available for video {video_id}")
            return None
        except Exception as e:
            print(f"Error fetching transcript for video {video_id}: {str(e)}")
            return None
