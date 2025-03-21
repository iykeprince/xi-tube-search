"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { Badge } from "@/components/ui/badge"
import {
  ArrowLeft,
  FileText,
  BookOpen,
  Play,
  Volume2,
  Loader2,
  ExternalLink,
  ThumbsUp,
  MessageCircle,
  Calendar,
  User,
  RefreshCw,
} from "lucide-react"
import SentimentAnalysis from "@/components/sentiment-analysis"
import TextToSpeech from "@/components/text-to-speech"
import { useVideoDetailsCache } from "@/hooks/use-video-details-cache"

interface VideoAnalysisProps {
  videoId: string
}

export default function VideoAnalysis({ videoId }: VideoAnalysisProps) {
  const router = useRouter()
  const [transcript, setTranscript] = useState<string>("")
  const [summary, setSummary] = useState<string>("")
  const [isLoadingTranscript, setIsLoadingTranscript] = useState(false)
  const [isLoadingSummary, setIsLoadingSummary] = useState(false)
  const [activeTab, setActiveTab] = useState("summary")
  const [transcriptCache, setTranscriptCache] = useState<Record<string, { text: string; timestamp: number }>>({})
  const [summaryCache, setSummaryCache] = useState<Record<string, { text: string; timestamp: number }>>({})

  // Use our custom hook for cached video details
  const {
    videoDetails,
    isLoading: isLoadingDetails,
    error,
    fetchVideoDetails,
    invalidateVideo,
  } = useVideoDetailsCache()

  // Fetch video details on mount
  useEffect(() => {
    fetchVideoDetails(videoId)

    // Load cached transcript and summary from localStorage
    if (typeof window !== "undefined") {
      try {
        const savedTranscriptCache = localStorage.getItem("transcript-cache")
        if (savedTranscriptCache) {
          setTranscriptCache(JSON.parse(savedTranscriptCache))
        }

        const savedSummaryCache = localStorage.getItem("summary-cache")
        if (savedSummaryCache) {
          setSummaryCache(JSON.parse(savedSummaryCache))
        }
      } catch (err) {
        console.error("Error loading cache from localStorage:", err)
      }
    }
  }, [videoId, fetchVideoDetails])

  // Save transcript cache to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined" || Object.keys(transcriptCache).length === 0) return

    try {
      localStorage.setItem("transcript-cache", JSON.stringify(transcriptCache))
    } catch (err) {
      console.error("Error saving transcript cache to localStorage:", err)
    }
  }, [transcriptCache])

  // Save summary cache to localStorage when it changes
  useEffect(() => {
    if (typeof window === "undefined" || Object.keys(summaryCache).length === 0) return

    try {
      localStorage.setItem("summary-cache", JSON.stringify(summaryCache))
    } catch (err) {
      console.error("Error saving summary cache to localStorage:", err)
    }
  }, [summaryCache])

  // Fetch transcript with caching
  const fetchTranscript = async (force = false) => {
    // Check cache first (if not forcing refresh)
    if (!force && transcriptCache[videoId] && Date.now() - transcriptCache[videoId].timestamp < 24 * 60 * 60 * 1000) {
      console.log("Using cached transcript for:", videoId)
      setTranscript(transcriptCache[videoId].text)
      return
    }

    setIsLoadingTranscript(true)

    try {
      console.log("Fetching fresh transcript for:", videoId)
      const response = await fetch("/api/transcript", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch transcript")
      }

      const data = await response.json()
      const transcriptText = data.transcript || "No transcript available for this video."

      setTranscript(transcriptText)

      // Update cache
      setTranscriptCache((prev) => ({
        ...prev,
        [videoId]: {
          text: transcriptText,
          timestamp: Date.now(),
        },
      }))
    } catch (err) {
      console.error("Error fetching transcript:", err)
      setTranscript("Failed to load transcript. The video might not have captions available.")
    } finally {
      setIsLoadingTranscript(false)
    }
  }

  // Generate summary with caching
  const generateSummary = async (force = false) => {
    // Check cache first (if not forcing refresh)
    if (!force && summaryCache[videoId] && Date.now() - summaryCache[videoId].timestamp < 24 * 60 * 60 * 1000) {
      console.log("Using cached summary for:", videoId)
      setSummary(summaryCache[videoId].text)
      return
    }

    setIsLoadingSummary(true)

    try {
      console.log("Generating fresh summary for:", videoId)
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate summary")
      }

      const data = await response.json()
      const summaryText = data.summary || "Unable to generate summary for this video."

      setSummary(summaryText)

      // Update cache
      setSummaryCache((prev) => ({
        ...prev,
        [videoId]: {
          text: summaryText,
          timestamp: Date.now(),
        },
      }))
    } catch (err) {
      console.error("Error generating summary:", err)
      setSummary("Failed to generate summary. Please try again later.")
    } finally {
      setIsLoadingSummary(false)
    }
  }

  // Handle tab changes
  const handleTabChange = (value: string) => {
    setActiveTab(value)

    if (value === "transcript" && !transcript) {
      fetchTranscript()
    }

    if (value === "summary" && !summary) {
      generateSummary()
    }
  }

  // Refresh data
  const refreshData = () => {
    invalidateVideo(videoId)
    fetchVideoDetails(videoId)

    if (activeTab === "transcript" || transcript) {
      fetchTranscript(true)
    }

    if (activeTab === "summary" || summary) {
      generateSummary(true)
    }
  }

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  // Format numbers with commas
  const formatNumber = (num: string) => {
    return Number.parseInt(num).toLocaleString()
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-red-500 mb-4">{error}</p>
        <Button onClick={() => router.back()}>Go Back</Button>
      </div>
    )
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <Button variant="ghost" onClick={() => router.back()}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Results
        </Button>

        <Button variant="outline" onClick={refreshData} className="flex items-center" disabled={isLoadingDetails}>
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh Data
        </Button>
      </div>

      {isLoadingDetails ? (
        <VideoDetailsSkeleton />
      ) : videoDetails ? (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            <div className="lg:col-span-2">
              <div className="relative aspect-video rounded-lg overflow-hidden mb-4">
                <Image
                  src={videoDetails.thumbnail_url || `/placeholder.svg?height=720&width=1280`}
                  alt={videoDetails.title}
                  fill
                  className="object-cover"
                  priority
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <Link
                    href={videoDetails.video_url || `https://www.youtube.com/watch?v=${videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white rounded-full p-4 transition-transform hover:scale-110"
                  >
                    <Play className="h-8 w-8" />
                  </Link>
                </div>
              </div>

              <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white mb-4">
                {videoDetails.title}
              </h1>

              <div className="flex flex-wrap items-center gap-4 mb-6">
                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <User className="h-4 w-4 mr-1" />
                  <span>{videoDetails.channel_title}</span>
                </div>

                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Calendar className="h-4 w-4 mr-1" />
                  <span>{formatDate(videoDetails.published_at)}</span>
                </div>

                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <Play className="h-4 w-4 mr-1" />
                  <span>{formatNumber(videoDetails.view_count || "0")} views</span>
                </div>

                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  <span>{formatNumber(videoDetails.like_count || "0")}</span>
                </div>

                <div className="flex items-center text-slate-600 dark:text-slate-300">
                  <MessageCircle className="h-4 w-4 mr-1" />
                  <span>{formatNumber(videoDetails.comment_count || "0")} comments</span>
                </div>
              </div>

              <p className="text-slate-700 dark:text-slate-300 mb-6 line-clamp-3">{videoDetails.description}</p>

              <Link
                href={videoDetails.video_url || `https://www.youtube.com/watch?v=${videoId}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center text-primary hover:text-primary/80"
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Watch on YouTube
              </Link>
            </div>

            <div className="lg:col-span-1">
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">AI Analysis Tools</h2>

                  <div className="space-y-4">
                    <Button
                      variant={activeTab === "summary" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTabChange("summary")}
                    >
                      <BookOpen className="mr-2 h-4 w-4" />
                      Generate Summary
                    </Button>

                    <Button
                      variant={activeTab === "transcript" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => handleTabChange("transcript")}
                    >
                      <FileText className="mr-2 h-4 w-4" />
                      View Transcript
                    </Button>

                    <Button
                      variant={activeTab === "speech" ? "default" : "outline"}
                      className="w-full justify-start"
                      onClick={() => {
                        handleTabChange("speech")
                        if (!summary) generateSummary()
                      }}
                    >
                      <Volume2 className="mr-2 h-4 w-4" />
                      Text to Speech
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="speech">Text to Speech</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="mt-6">
              {isLoadingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Generating summary...</p>
                  <p className="text-sm text-slate-500 dark:text-slate-500 mt-2">
                    This may take a minute for longer videos
                  </p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-semibold text-slate-900 dark:text-white">AI-Generated Summary</h2>
                    <Badge variant="outline" className="text-primary">
                      AI Generated
                    </Badge>
                  </div>

                  <div className="prose dark:prose-invert max-w-none">
                    {summary.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-slate-700 dark:text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>

                  <SentimentAnalysis text={summary} />
                </div>
              )}
            </TabsContent>

            <TabsContent value="transcript" className="mt-6">
              {isLoadingTranscript ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Loading transcript...</p>
                </div>
              ) : (
                <div className="bg-white dark:bg-slate-800 rounded-lg p-6 shadow-sm">
                  <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Video Transcript</h2>

                  <div className="max-h-[500px] overflow-y-auto pr-4 prose dark:prose-invert max-w-none">
                    {transcript.split("\n\n").map((paragraph, index) => (
                      <p key={index} className="mb-4 text-slate-700 dark:text-slate-300">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="speech" className="mt-6">
              {isLoadingSummary ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
                  <p className="text-slate-600 dark:text-slate-400">Preparing text for speech...</p>
                </div>
              ) : (
                <TextToSpeech text={summary} videoId={videoId} />
              )}
            </TabsContent>
          </Tabs>
        </>
      ) : (
        <div className="text-center py-12">
          <p className="text-slate-600 dark:text-slate-400">Video not found</p>
          <Button onClick={() => router.push("/")} className="mt-4">
            Return to Home
          </Button>
        </div>
      )}
    </div>
  )
}

function VideoDetailsSkeleton() {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
      <div className="lg:col-span-2">
        <Skeleton className="aspect-video w-full rounded-lg mb-4" />
        <Skeleton className="h-10 w-3/4 mb-4" />
        <div className="flex flex-wrap gap-4 mb-6">
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
          <Skeleton className="h-6 w-32" />
        </div>
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-full mb-2" />
        <Skeleton className="h-4 w-2/3" />
      </div>
      <div className="lg:col-span-1">
        <Skeleton className="h-[300px] w-full rounded-lg" />
      </div>
    </div>
  )
}
