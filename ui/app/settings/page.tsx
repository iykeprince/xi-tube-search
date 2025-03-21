import type { Metadata } from "next"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import CacheStatus from "@/components/cache-status"

export const metadata: Metadata = {
  title: "Settings | YouTube Video Analyzer",
  description: "Configure application settings and manage cache",
}

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Application Settings</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="text-md font-medium mb-2">Cache Management</h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                    The application caches search results, video details, transcripts, and summaries to improve
                    performance and reduce API calls.
                  </p>

                  <CacheStatus />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
              <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">About</h2>

              <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
                YouTube Video Analyzer is an AI-powered application that automatically finds, analyzes, and summarizes
                YouTube videos based on user queries.
              </p>

              <p className="text-sm text-slate-600 dark:text-slate-400">Version 1.0.0</p>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
            <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Performance Optimizations</h2>

            <div className="space-y-4">
              <div>
                <h3 className="text-md font-medium mb-2">Search Caching</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Search results are cached for 30 minutes to reduce API calls and improve performance. This means that
                  repeated searches for the same query will be served from the cache instead of making a new API call.
                </p>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Video Details Caching</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Video details are cached for 1 hour to reduce API calls and improve performance. This means that
                  repeated visits to the same video will be served from the cache instead of making a new API call.
                </p>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Transcript and Summary Caching</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Transcripts and summaries are cached for 24 hours to reduce API calls and improve performance. This
                  means that repeated requests for the same transcript or summary will be served from the cache instead
                  of making a new API call.
                </p>
              </div>

              <div>
                <h3 className="text-md font-medium mb-2">Debounced Search</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Search requests are debounced to prevent excessive API calls when typing quickly. This means that the
                  search will only be performed after you stop typing for a short period of time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
