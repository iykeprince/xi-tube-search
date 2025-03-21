"use client"

import { useState, useEffect, useCallback } from "react"

// Define the cache item structure with timestamp for invalidation
interface CacheItem<T> {
  data: T
  timestamp: number
}

// Define the video details interface
interface VideoDetails {
  video_id: string
  title: string
  description: string
  thumbnail_url: string
  channel_title: string
  published_at: string
  view_count: string
  like_count: string
  comment_count: string
  video_url: string
}

/**
 * A hook that provides cached video details with automatic invalidation
 *
 * @param cacheExpiryTime Time in milliseconds after which cache is considered stale
 * @returns Object containing video details state and functions
 */
export function useVideoDetailsCache(cacheExpiryTime = 1000 * 60 * 60) {
  // Default: 1 hour
  const [videoDetails, setVideoDetails] = useState<VideoDetails | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize cache from localStorage on mount
  const [cache, setCache] = useState<Record<string, CacheItem<VideoDetails>>>(() => {
    if (typeof window === "undefined") return {}

    try {
      const savedCache = localStorage.getItem("video-details-cache")
      return savedCache ? JSON.parse(savedCache) : {}
    } catch (err) {
      console.error("Error loading cache from localStorage:", err)
      return {}
    }
  })

  // Save cache to localStorage whenever it changes
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      localStorage.setItem("video-details-cache", JSON.stringify(cache))
    } catch (err) {
      console.error("Error saving cache to localStorage:", err)
    }
  }, [cache])

  // Clean up expired cache items
  useEffect(() => {
    const now = Date.now()
    const newCache = { ...cache }
    let hasChanges = false

    Object.keys(newCache).forEach((key) => {
      if (now - newCache[key].timestamp > cacheExpiryTime) {
        delete newCache[key]
        hasChanges = true
      }
    })

    if (hasChanges) {
      setCache(newCache)
    }
  }, [cache, cacheExpiryTime])

  // Function to fetch video details with caching
  const fetchVideoDetails = useCallback(
    async (videoId: string) => {
      if (!videoId) {
        setVideoDetails(null)
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Check if we have a valid cache entry
        const now = Date.now()
        const cacheKey = `video:${videoId}`
        const cacheEntry = cache[cacheKey]

        // Use cache if it exists and is not expired
        if (cacheEntry && now - cacheEntry.timestamp < cacheExpiryTime) {
          console.log("Using cached video details for:", videoId)
          setVideoDetails(cacheEntry.data)
          setIsLoading(false)
          return
        }

        // Otherwise, fetch from API
        console.log("Fetching fresh video details for:", videoId)
        const response = await fetch(`/api/video/${videoId}`)

        if (!response.ok) {
          throw new Error("Failed to fetch video details")
        }

        const data = await response.json()

        // Update state with the results
        setVideoDetails(data)

        // Update cache with the new results
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: {
            data,
            timestamp: now,
          },
        }))
      } catch (err) {
        console.error("Error fetching video details:", err)
        setError("Failed to load video details. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [cache, cacheExpiryTime],
  )

  // Function to clear the entire cache
  const clearCache = useCallback(() => {
    setCache({})
    localStorage.removeItem("video-details-cache")
  }, [])

  // Function to clear a specific video from cache
  const invalidateVideo = useCallback((videoId: string) => {
    const cacheKey = `video:${videoId}`
    setCache((prevCache) => {
      const newCache = { ...prevCache }
      delete newCache[cacheKey]
      return newCache
    })
  }, [])

  return {
    videoDetails,
    isLoading,
    error,
    fetchVideoDetails,
    clearCache,
    invalidateVideo,
  }
}
