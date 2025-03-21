"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Slider } from "@/components/ui/slider"
import { Play, Pause, Volume2, Download, Loader2 } from "lucide-react"

interface TextToSpeechProps {
  text: string
  videoId: string
}

export default function TextToSpeech({ text, videoId }: TextToSpeechProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)
  const [volume, setVolume] = useState(80)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  const generateSpeech = async () => {
    if (audioUrl) {
      togglePlayback()
      return
    }

    setIsGenerating(true)

    try {
      const response = await fetch("/api/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text: text.length > 5000 ? text.substring(0, 5000) + "..." : text,
          videoId,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const data = await response.json()

      if (data.audioUrl) {
        setAudioUrl(data.audioUrl)
        const audio = new Audio(data.audioUrl)
        audio.volume = volume / 100
        setAudioElement(audio)

        audio.addEventListener("ended", () => {
          setIsPlaying(false)
        })

        audio.play()
        setIsPlaying(true)
      }
    } catch (err) {
      console.error("Error generating speech:", err)
    } finally {
      setIsGenerating(false)
    }
  }

  const togglePlayback = () => {
    if (!audioElement) return

    if (isPlaying) {
      audioElement.pause()
    } else {
      audioElement.play()
    }

    setIsPlaying(!isPlaying)
  }

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0]
    setVolume(newVolume)

    if (audioElement) {
      audioElement.volume = newVolume / 100
    }
  }

  const downloadAudio = async () => {
    if (!audioUrl) return

    try {
      const response = await fetch("/api/text-to-speech/download", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ videoId }),
      })

      if (!response.ok) {
        throw new Error("Failed to download audio")
      }

      const blob = await response.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.style.display = "none"
      a.href = url
      a.download = `summary-${videoId}.mp3`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
    } catch (err) {
      console.error("Error downloading audio:", err)
    }
  }

  return (
    <Card>
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold mb-4 text-slate-900 dark:text-white">Text to Speech</h2>

        <p className="text-slate-600 dark:text-slate-400 mb-6">Listen to the AI-generated summary of this video</p>

        <div className="flex flex-col space-y-6">
          <div className="flex justify-center">
            <Button size="lg" onClick={generateSpeech} disabled={isGenerating} className="rounded-full h-16 w-16 p-0">
              {isGenerating ? (
                <Loader2 className="h-8 w-8 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-8 w-8" />
              ) : (
                <Play className="h-8 w-8 ml-1" />
              )}
            </Button>
          </div>

          <div className="flex items-center space-x-4">
            <Volume2 className="h-5 w-5 text-slate-500" />
            <Slider value={[volume]} min={0} max={100} step={1} onValueChange={handleVolumeChange} className="flex-1" />
            <span className="text-sm text-slate-500 w-8">{volume}%</span>
          </div>

          {audioUrl && (
            <Button variant="outline" onClick={downloadAudio} className="w-full">
              <Download className="mr-2 h-4 w-4" />
              Download Audio
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

