import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { videoId } = await request.json()

    if (!videoId) {
      return NextResponse.json({ error: "Video ID is required" }, { status: 400 })
    }

    // Call the backend API
    const response = await fetch(`${process.env.API_URL || ""}/api/text-to-speech/download`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ videoId }),
    })

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`)
    }

    // Get the audio file as a blob
    const audioBlob = await response.blob()

    // Return the audio file
    return new NextResponse(audioBlob, {
      headers: {
        "Content-Type": "audio/mpeg",
        "Content-Disposition": `attachment; filename="summary-${videoId}.mp3"`,
      },
    })
  } catch (error) {
    console.error("Audio download error:", error)
    return NextResponse.json({ error: "Failed to download audio" }, { status: 500 })
  }
}

