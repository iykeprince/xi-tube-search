import { Suspense } from "react"
import type { Metadata } from "next"
import VideoAnalysis from "@/components/video-analysis"
import { Loader2 } from "lucide-react"

interface VideoPageProps {
  params: {
    id: string
  }
}

export async function generateMetadata({ params }: VideoPageProps): Promise<Metadata> {
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || ""}/api/video/${params.id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
      next: { revalidate: 3600 }, // Cache for 1 hour
    })

    if (!response.ok) {
      return {
        title: "Video Analysis",
        description: "Analyze and summarize YouTube videos",
      }
    }

    const video = await response.json()

    return {
      title: `Analysis: ${video.title || "YouTube Video"}`,
      description: `AI-generated summary and analysis of "${video.title}"`,
      openGraph: {
        images: [{ url: video.thumbnail_url || "" }],
      },
    }
  } catch (error) {
    return {
      title: "Video Analysis",
      description: "Analyze and summarize YouTube videos",
    }
  }
}

export default function VideoPage({ params }: VideoPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      <div className="container mx-auto px-4 py-8">
        <Suspense
          fallback={
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-12 w-12 animate-spin text-primary mb-4" />
              <p className="text-slate-600 dark:text-slate-400">Loading video analysis...</p>
            </div>
          }
        >
          <VideoAnalysis videoId={params.id} />
        </Suspense>
      </div>
    </div>
  )
}
