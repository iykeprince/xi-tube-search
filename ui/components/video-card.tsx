"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

interface VideoCardProps {
  video: {
    video_id: string
    title: string
    thumbnail_url: string
    channel_title: string
    published_at: string
    description: string
    view_count?: number
    like_count?: number
    comment_count?: number
    video_url?: string
  }
}

export default function VideoCard({ video }: VideoCardProps) {
  const router = useRouter()
  const [isHovered, setIsHovered] = useState(false)

  const formattedDate = new Date(video.published_at).toLocaleDateString()

  const handleAnalyzeClick = () => {
    router.push(`/video/${video.video_id}`)
  }

  return (
    <Card
      className="overflow-hidden transition-all duration-300 hover:shadow-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="relative aspect-video overflow-hidden">
        <Image
          src={video.thumbnail_url || `/placeholder.svg?height=720&width=1280`}
          alt={video.title}
          fill
          className={`object-cover transition-transform duration-500 ${isHovered ? "scale-105" : "scale-100"}`}
        />
      </div>

      <CardContent className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2 text-slate-900 dark:text-white">{video.title}</h3>

        <div className="flex items-center text-sm text-slate-500 dark:text-slate-400 mb-2">
          <span>{video.channel_title}</span>
          <span className="mx-2">•</span>
          <span>{formattedDate}</span>
        </div>

        <p className="text-sm text-slate-600 dark:text-slate-300 line-clamp-2">{video.description}</p>
      </CardContent>

      <CardFooter className="px-4 pb-4 pt-0 flex justify-between">
        <Button variant="default" onClick={handleAnalyzeClick} className="w-full">
          <Info className="mr-2 h-4 w-4" />
          Analyze Video
        </Button>
      </CardFooter>
    </Card>
  )
}
