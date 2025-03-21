"use client"
import { Suspense } from "react"
import SearchForm from "@/components/search-form"
import VideoResults from "@/components/video-results"
import { Loader2 } from "lucide-react"
import { useSpeech } from "react-text-to-speech";

export function SpeechComponent({ text }: { text: string }) {
  const {
    Text, // Component that returns the modified text property
    speechStatus, // String that stores current speech status
    isInQueue, // Boolean that stores whether a speech utterance is either being spoken or present in queue
    start, // Function to start the speech or put it in queue
    pause, // Function to pause the speech
    stop, // Function to stop the speech or remove it from queue
  } = useSpeech({ text });

  return (
    <div style={{ display: "flex", flexDirection: "column", rowGap: "1rem" }}>
      <Text />
      <div style={{ display: "flex", columnGap: "0.5rem" }}>
        {speechStatus !== "started" ? <button onClick={start}>Start</button> : <button onClick={pause}>Pause</button>}
        <button onClick={stop}>Stop</button>
      </div>
    </div>
  );
}

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

