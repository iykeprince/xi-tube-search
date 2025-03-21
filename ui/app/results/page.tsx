import { Suspense } from "react"
import type { Metadata } from "next"
import Link from "next/link"
import SearchForm from "@/components/search-form"
import VideoResults from "@/components/video-results"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Loader2 } from "lucide-react"

export const metadata: Metadata = {
  title: "Search Results | YouTube Video Analyzer",
  description: "Search results for YouTube videos to analyze and summarize",
}

export default function ResultsPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center mb-8">
          <Link href="/">
            <Button variant="ghost" className="mr-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
          </Link>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Search Results</h1>
        </div>

        <SearchForm />

        <Suspense
          fallback={
            <div className="flex justify-center items-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2 text-slate-600 dark:text-slate-400">Loading results...</span>
            </div>
          }
        >
          <VideoResults />
        </Suspense>
      </div>
    </div>
  )
}

