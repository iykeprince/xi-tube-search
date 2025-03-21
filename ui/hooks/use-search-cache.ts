"use client"

import { useState, useEffect, useCallback } from "react"

// Define the cache item structure with timestamp for invalidation
interface CacheItem<T> {
  data: T
  timestamp: number
}

// Define the video result interface
interface VideoResult {
  video_id: string
  title: string
  thumbnail_url: string
  channel_title: string
  published_at: string
  description: string
  view_count: number
  like_count: number
  comment_count: number
  video_url: string
}

/**
 * A hook that provides cached search functionality with automatic invalidation
 *
 * @param cacheExpiryTime Time in milliseconds after which cache is considered stale
 * @returns Object containing search state and functions
 */
export function useSearchCache(cacheExpiryTime = 1000 * 60 * 30) {
  // Default: 30 minutes
  const [results, setResults] = useState<VideoResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Initialize cache from localStorage on mount
  const [cache, setCache] = useState<Record<string, CacheItem<VideoResult[]>>>(() => {
    if (typeof window === "undefined") return {}

    try {
      const savedCache = localStorage.getItem("video-search-cache")
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
      localStorage.setItem("video-search-cache", JSON.stringify(cache))
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

  // Function to search videos with caching
  const searchVideos = useCallback(
    async (query: string) => {
      if (!query.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      setError(null)

      try {
        // Check if we have a valid cache entry
        const now = Date.now()
        const cacheKey = `search:${query.toLowerCase()}`
        const cacheEntry = cache[cacheKey]

        // Use cache if it exists and is not expired
        if (cacheEntry && now - cacheEntry.timestamp < cacheExpiryTime) {
          console.log("Using cached search results for:", query)
          setResults(cacheEntry.data)
          setIsLoading(false)
          return
        }

        // Otherwise, fetch from API
        console.log("Fetching fresh search results for:", query)
        const response = await fetch("/api/search", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ query }),
        })

        if (!response.ok) {
          throw new Error("Failed to fetch search results")
        }

        const data = await response.json()

        // Update state with the results
        setResults(data || [])

        // Update cache with the new results
        setCache((prevCache) => ({
          ...prevCache,
          [cacheKey]: {
            data: data || [],
            timestamp: now,
          },
        }))
      } catch (err) {
        console.error("Error fetching results:", err)
        setError("Failed to fetch video results. Please try again.")
      } finally {
        setIsLoading(false)
      }
    },
    [cache, cacheExpiryTime],
  )

  // Function to clear the entire cache
  const clearCache = useCallback(() => {
    setCache({})
    localStorage.removeItem("video-search-cache")
  }, [])

  // Function to clear a specific query from cache
  const invalidateQuery = useCallback((query: string) => {
    const cacheKey = `search:${query.toLowerCase()}`
    setCache((prevCache) => {
      const newCache = { ...prevCache }
      delete newCache[cacheKey]
      return newCache
    })
  }, [])

  return {
    results,
    isLoading,
    error,
    searchVideos,
    clearCache,
    invalidateQuery,
  }
}
