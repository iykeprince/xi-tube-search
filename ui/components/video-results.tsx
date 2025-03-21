"use client"

import { useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
import VideoCard from "@/components/video-card"
import { Button } from "@/components/ui/button"
import { useSearchCache } from "@/hooks/use-search-cache"

export default function VideoResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get("q")

  // Use our custom hook for cached search
  const { results, isLoading, error, searchVideos } = useSearchCache()

  // Fetch results when query changes
  useEffect(() => {
    if (query) {
      searchVideos(query)
    }
  }, [query, searchVideos])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
        <p className="text-slate-600 dark:text-slate-400">Searching for videos...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => searchVideos(query || "")}>Try Again</Button>
      </div>
    )
  }

  if (results.length === 0 && query) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-600 dark:text-slate-400 mb-4">No videos found for "{query}"</p>
        <p className="text-slate-500 dark:text-slate-500">Try a different search term or paste a YouTube URL</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {query && results.length > 0 && (
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Found {results.length} results for "{query}"
        </p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {results.map((video) => (
          <VideoCard key={video.video_id} video={video} />
        ))}
      </div>
    </div>
  )
}
