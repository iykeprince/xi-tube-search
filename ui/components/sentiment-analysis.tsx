"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Smile, Meh, Frown } from "lucide-react"

interface SentimentAnalysisProps {
  text: string
}

export default function SentimentAnalysis({ text }: SentimentAnalysisProps) {
  const [sentiment, setSentiment] = useState<{
    positive: number
    neutral: number
    negative: number
    overall: "positive" | "neutral" | "negative"
  }>({
    positive: 0,
    neutral: 0,
    negative: 0,
    overall: "neutral",
  })

  useEffect(() => {
    // This is a simplified sentiment analysis for demonstration
    // In a real app, you would call an API endpoint for this
    const analyzeSentiment = () => {
      // Count positive and negative words (very simplified)
      const positiveWords = [
        "good",
        "great",
        "excellent",
        "amazing",
        "love",
        "best",
        "important",
        "helpful",
        "benefit",
        "positive",
        "solution",
      ]
      const negativeWords = [
        "bad",
        "terrible",
        "awful",
        "hate",
        "worst",
        "problem",
        "issue",
        "concern",
        "negative",
        "harmful",
        "dangerous",
      ]

      const lowerText = text.toLowerCase()
      let positiveCount = 0
      let negativeCount = 0

      positiveWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "g")
        const matches = lowerText.match(regex)
        if (matches) positiveCount += matches.length
      })

      negativeWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "g")
        const matches = lowerText.match(regex)
        if (matches) negativeCount += matches.length
      })

      const total = positiveCount + negativeCount
      const neutralCount = Math.max(text.split(" ").length / 20 - total, 0)

      const positive = total === 0 ? 33 : Math.round((positiveCount / (total + neutralCount)) * 100)
      const negative = total === 0 ? 33 : Math.round((negativeCount / (total + neutralCount)) * 100)
      const neutral = total === 0 ? 34 : 100 - positive - negative

      let overall: "positive" | "neutral" | "negative" = "neutral"
      if (positive > negative && positive > neutral) overall = "positive"
      if (negative > positive && negative > neutral) overall = "negative"

      setSentiment({
        positive,
        neutral,
        negative,
        overall,
      })
    }

    if (text) {
      analyzeSentiment()
    }
  }, [text])

  const getSentimentIcon = () => {
    switch (sentiment.overall) {
      case "positive":
        return <Smile className="h-6 w-6 text-green-500" />
      case "negative":
        return <Frown className="h-6 w-6 text-red-500" />
      default:
        return <Meh className="h-6 w-6 text-amber-500" />
    }
  }

  const getSentimentColor = (type: "positive" | "neutral" | "negative") => {
    switch (type) {
      case "positive":
        return "bg-green-500"
      case "negative":
        return "bg-red-500"
      default:
        return "bg-amber-500"
    }
  }

  return (
    <Card className="mt-6">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4 flex items-center">
          {getSentimentIcon()}
          <span className="ml-2">Sentiment Analysis</span>
        </h3>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-400">Positive</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{sentiment.positive}%</span>
            </div>
            <Progress value={sentiment.positive} className="h-2" indicatorClassName={getSentimentColor("positive")} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-400">Neutral</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{sentiment.neutral}%</span>
            </div>
            <Progress value={sentiment.neutral} className="h-2" indicatorClassName={getSentimentColor("neutral")} />
          </div>

          <div>
            <div className="flex justify-between mb-1">
              <span className="text-sm text-slate-600 dark:text-slate-400">Negative</span>
              <span className="text-sm font-medium text-slate-900 dark:text-white">{sentiment.negative}%</span>
            </div>
            <Progress value={sentiment.negative} className="h-2" indicatorClassName={getSentimentColor("negative")} />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

