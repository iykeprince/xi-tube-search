from googleapiclient.discovery import build
from dotenv import load_dotenv
from os import getenv
import serpapi

load_dotenv()
YOUTUBE_SEARCH_KEY = getenv("YOUTUBE_SEARCH_KEY")
SERP_API_KEY = getenv("SERP_API_KEY")


def search_youtube_api(query, max_results=5, api_key=YOUTUBE_SEARCH_KEY):
    """
    Search YouTube for videos matching the query string using the YouTube Data API.
    """
    if not api_key:
        raise ValueError("YouTube API key is not provided.")
    if not query:
        raise ValueError("Query string is empty.")
    if not isinstance(max_results, int) or max_results <= 0:
        raise ValueError("max_results must be a positive integer.")
    if not isinstance(query, str):
        raise ValueError("Query must be a string.")
    if not isinstance(api_key, str):
        raise ValueError("API key must be a string.")

    youtube = build("youtube", "v3", developerKey=api_key)
    request = youtube.search().list(
        part="snippet", maxResults=max_results, q=query, type="video"
    )
    response = request.execute()
    video_links = []
    for item in response.get("items", []):
        video_id = item["id"]["videoId"]
        video_links.append(f"https://www.youtube.com/watch?v={video_id}")
    return video_links


def serpapi_youtube_search(query, max_results=5):
    """
    Search YouTube using SerpAPI.
    """
    if not query:
        raise ValueError("Query string is empty.")
    if not isinstance(max_results, int) or max_results <= 0:
        raise ValueError("max_results must be a positive integer.")
    if not isinstance(query, str):
        raise ValueError("Query must be a string.")

    print(SERP_API_KEY)
    if not SERP_API_KEY:
        raise ValueError("SerpAPI key is not provided.")
    if not isinstance(SERP_API_KEY, str):
        raise ValueError("SerpAPI key must be a string.")

    client = serpapi.Client(api_key=SERP_API_KEY)
    results = client.search(
        {
            "engine": "youtube",
            "search_query": query,
        }
    )

    # Go through the results and extract the video links
    count = 0
    if "video_results" not in results:
        return []
    video_info = []
    for result in results.get("video_results", []):
        if count >= max_results:
            break
        count += 1
        if "link" in result:
            video_info.append(result)
    return video_info
