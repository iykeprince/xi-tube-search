"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

export default function CacheStatus() {
  const [cacheStats, setCacheStats] = useState({
    searchCache: 0,
    videoCache: 0,
    transcriptCache: 0,
    summaryCache: 0,
    totalSize: 0,
  })

  // Calculate cache stats on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const searchCache = localStorage.getItem("video-search-cache")
      const videoCache = localStorage.getItem("video-details-cache")
      const transcriptCache = localStorage.getItem("transcript-cache")
      const summaryCache = localStorage.getItem("summary-cache")

      const searchSize = searchCache ? new Blob([searchCache]).size : 0
      const videoSize = videoCache ? new Blob([videoCache]).size : 0
      const transcriptSize = transcriptCache ? new Blob([transcriptCache]).size : 0
      const summarySize = summaryCache ? new Blob([summaryCache]).size : 0

      setCacheStats({
        searchCache: searchCache ? JSON.parse(searchCache).length : 0,
        videoCache: videoCache ? Object.keys(JSON.parse(videoCache)).length : 0,
        transcriptCache: transcriptCache ? Object.keys(JSON.parse(transcriptCache)).length : 0,
        summaryCache: summaryCache ? Object.keys(JSON.parse(summaryCache)).length : 0,
        totalSize: (searchSize + videoSize + transcriptSize + summarySize) / 1024, // KB
      })
    } catch (err) {
      console.error("Error calculating cache stats:", err)
    }
  }, [])

  // Clear all caches
  const clearAllCaches = () => {
    if (typeof window === "undefined") return

    try {
      localStorage.removeItem("video-search-cache")
      localStorage.removeItem("video-details-cache")
      localStorage.removeItem("transcript-cache")
      localStorage.removeItem("summary-cache")
      localStorage.removeItem("recent-searches")

      setCacheStats({
        searchCache: 0,
        videoCache: 0,
        transcriptCache: 0,
        summaryCache: 0,
        totalSize: 0,
      })

      alert("All caches cleared successfully!")
    } catch (err) {
      console.error("Error clearing caches:", err)
      alert("Failed to clear caches. Please try again.")
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Cache Status</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-2 mb-4">
          <p className="text-sm flex justify-between">
            <span>Search Results:</span>
            <span className="font-medium">{cacheStats.searchCache} queries</span>
          </p>
          <p className="text-sm flex justify-between">
            <span>Video Details:</span>
            <span className="font-medium">{cacheStats.videoCache} videos</span>
          </p>
          <p className="text-sm flex justify-between">
            <span>Transcripts:</span>
            <span className="font-medium">{cacheStats.transcriptCache} videos</span>
          </p>
          <p className="text-sm flex justify-between">
            <span>Summaries:</span>
            <span className="font-medium">{cacheStats.summaryCache} videos</span>
          </p>
          <p className="text-sm flex justify-between font-medium">
            <span>Total Cache Size:</span>
            <span>{cacheStats.totalSize.toFixed(2)} KB</span>
          </p>
        </div>

        <Button variant="destructive" size="sm" className="w-full" onClick={clearAllCaches}>
          <Trash2 className="h-4 w-4 mr-2" />
          Clear All Caches
        </Button>
      </CardContent>
    </Card>
  )
}
