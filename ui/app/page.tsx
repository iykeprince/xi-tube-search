import { Suspense } from "react"
import SearchForm from "@/components/search-form"
import VideoResults from "@/components/video-results"
import { Loader2 } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold tracking-tight text-slate-900 dark:text-white mb-2">
            YouTube <span className="text-primary">Analyzer</span>
          </h1>
          <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
            Automatically find, analyze, and summarize YouTube videos without watching them
          </p>
        </header>

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

