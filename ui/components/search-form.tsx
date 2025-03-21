"use client"

import type React from "react"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useDebounce } from "@/hooks/use-debounce"

export default function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const initialQuery = searchParams.get("q") || ""

  const [query, setQuery] = useState(initialQuery)
  const [isLoading, setIsLoading] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])

  // Debounce the query to prevent excessive URL updates
  const debouncedQuery = useDebounce(query, 300)

  // Load recent searches from localStorage on mount
  useEffect(() => {
    if (typeof window === "undefined") return

    try {
      const savedSearches = localStorage.getItem("recent-searches")
      if (savedSearches) {
        setRecentSearches(JSON.parse(savedSearches))
      }
    } catch (err) {
      console.error("Error loading recent searches:", err)
    }
  }, [])

  // Save recent searches to localStorage
  const saveRecentSearch = useCallback((searchQuery: string) => {
    if (!searchQuery.trim()) return

    setRecentSearches((prev) => {
      // Remove the query if it already exists and add it to the front
      const filtered = prev.filter((item) => item !== searchQuery)
      const updated = [searchQuery, ...filtered].slice(0, 5) // Keep only the 5 most recent

      // Save to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem("recent-searches", JSON.stringify(updated))
      }

      return updated
    })
  }, [])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!query.trim()) return

    setIsLoading(true)

    try {
      // Save to recent searches
      saveRecentSearch(query)

      // Navigate to results page with the query
      router.push(`/results?q=${encodeURIComponent(query)}`)
    } catch (error) {
      console.error("Search error:", error)
    } finally {
      setIsLoading(false)
    }
  }

  // Clear the search input
  const clearSearch = () => {
    setQuery("")
  }

  // Select a recent search
  const selectRecentSearch = (searchQuery: string) => {
    setQuery(searchQuery)
    router.push(`/results?q=${encodeURIComponent(searchQuery)}`)
  }

  return (
    <div className="max-w-2xl mx-auto mb-12">
      <form onSubmit={handleSubmit} className="mb-2">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Input
              type="text"
              placeholder="Enter a video title, topic, or YouTube URL..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="pl-4 pr-10 py-6 text-base bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 rounded-lg shadow-sm"
            />
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          <Button type="submit" disabled={isLoading || !query.trim()} className="px-6 py-6">
            {isLoading ? (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Searching...
              </span>
            ) : (
              <span className="flex items-center">
                <Search className="mr-2 h-4 w-4" />
                Search
              </span>
            )}
          </Button>
        </div>
      </form>

      {/* Recent searches */}
      {recentSearches.length > 0 && !query && (
        <div className="mt-2 mb-4">
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">Recent searches:</p>
          <div className="flex flex-wrap gap-2">
            {recentSearches.map((search, index) => (
              <button
                key={index}
                onClick={() => selectRecentSearch(search)}
                className="text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-3 py-1 rounded-full transition-colors"
              >
                {search}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">
        Try: "The Social Dilemma Netflix" or paste a YouTube URL
      </p>
    </div>
  )
}

