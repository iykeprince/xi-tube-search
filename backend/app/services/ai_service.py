import os
import json
from typing import List, Optional, Dict, Any
from langchain_groq import ChatGroq
from langchain.schema import SystemMessage, HumanMessage
from langchain.output_parsers import ResponseSchema, StructuredOutputParser
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
import gtts
import io


class AIService:
    def __init__(self):
        self.api_key = os.getenv("GROQ_API_KEY", "")
        self.model_name = "llama3-70b-8192"  # Default model

    def _get_llm(self):
        """Create and return a Groq LLM instance."""
        return ChatGroq(
            groq_api_key=self.api_key,
            model_name=self.model_name,
            temperature=0.3,
            max_tokens=8000,
        )

    async def generate_summary(
        self,
        transcript: str,
        video_title: str,
        video_description: str,
        custom_instructions: Optional[str] = None,
    ) -> str:
        """
        Generate a comprehensive summary of a YouTube video based on its transcript.
        """
        llm = self._get_llm()

        # Prepare context information
        context = f"TITLE: {video_title}\n\nDESCRIPTION: {video_description}\n\n"

        # Determine if transcript needs to be truncated
        max_transcript_length = 40000  # Adjust based on model token limits
        if len(transcript) > max_transcript_length:
            transcript = (
                transcript[:max_transcript_length]
                + "... (transcript truncated due to length)"
            )

        # Create prompt with system instructions
        system_prompt = (
            "You are an expert video analyzer and summarizer. Your task is to create a comprehensive, "
            "accurate summary of a YouTube video based on its transcript, title, and description. "
            "Your summary should capture the core message, emotions, storyline, and key points of the video. "
            "Focus on being factual and objective while conveying the essence of the content. "
            "Structure your summary with clear paragraphs and transitions. "
            "Do not mention that you are summarizing a transcript in your response."
        )

        # Add custom instructions if provided
        if custom_instructions:
            system_prompt += (
                f"\n\nAdditional summary instructions: {custom_instructions}"
            )

        # Build human message with content
        human_prompt = (
            f"Please analyze and summarize the following YouTube video content:\n\n"
            f"{context}\n\n"
            f"TRANSCRIPT:\n{transcript}\n\n"
            "Provide a comprehensive, well-structured summary that captures the core message, "
            "emotional tone, and most important points from this video."
        )

        messages = [
            SystemMessage(content=system_prompt),
            HumanMessage(content=human_prompt),
        ]

        # Generate summary
        response = await llm.agenerate([messages])
        summary = response.generations[0][0].text.strip()

        return summary

    async def extract_key_points(self, summary: str) -> List[str]:
        """
        Extract key points from a summary using the Groq LLM.
        """
        llm = self._get_llm()

        prompt = (
            "Extract 3-5 key points or takeaways from the following summary. "
            "Format each point as a concise sentence that captures an important insight. "
            "Return ONLY a JSON array of strings representing the key points.\n\n"
            f"SUMMARY:\n{summary}"
        )

        response_schemas = [
            ResponseSchema(
                name="key_points",
                description="A list of key points extracted from the summary",
            )
        ]
        output_parser = StructuredOutputParser.from_response_schemas(response_schemas)

        format_instructions = output_parser.get_format_instructions()

        messages = [
            SystemMessage(
                content=(
                    "You are a precision extractor that identifies the most important points "
                    "from a text. Return your response in the exact JSON format requested."
                )
            ),
            HumanMessage(content=f"{prompt}\n\n{format_instructions}"),
        ]

        # Generate key points
        response = await llm.agenerate([messages])
        result = response.generations[0][0].text.strip()

        try:
            # Try to parse JSON directly
            json_result = json.loads(result)
            if isinstance(json_result, dict) and "key_points" in json_result:
                return json_result["key_points"]
            elif isinstance(json_result, list):
                return json_result
        except json.JSONDecodeError:
            # If JSON parsing fails, try to extract key points with regex
            import re

            # Look for anything that might be a list of points
            points = re.findall(r'"([^"]+)"', result)
            if points:
                return points

            # Fall back to line-by-line extraction
            lines = [line.strip() for line in result.split("\n") if line.strip()]
            # Remove list markers and other formatting
            clean_lines = [re.sub(r"^[\d\-\*\•\.]+\s*", "", line) for line in lines]
            return clean_lines[:5]  # Limit to 5 points

    async def analyze_sentiment(self, text: str) -> Dict[str, Any]:
        """
        Analyze the sentiment of the video content.
        """
        llm = self._get_llm()

        prompt = ChatPromptTemplate.from_messages(
            [
                SystemMessage(
                    content=(
                        "You are a sentiment analysis expert. Analyze the text and return ONLY a JSON object with "
                        "the following fields: 'overall_sentiment' (positive, negative, or neutral), "
                        "'sentiment_score' (a number from -1.0 to 1.0, where -1 is very negative and 1 is very positive), "
                        "and 'emotional_tones' (an array of emotional tones present in the content)."
                    )
                ),
                HumanMessagePromptTemplate.from_template(
                    "Analyze the sentiment of the following text and return ONLY the JSON result:\n\n{text}"
                ),
            ]
        )

        chain = prompt | llm

        result = await chain.ainvoke({"text": text})
        result_text = result.content

        try:
            # Try to parse the JSON response
            if isinstance(result_text, str):
                # Find JSON in the string if there's other text
                import re

                json_match = re.search(r"\{.*\}", result_text, re.DOTALL)
                if json_match:
                    json_str = json_match.group(0)
                    return json.loads(json_str)
                return json.loads(result_text)
            return result_text
        except json.JSONDecodeError:
            # Fallback if JSON parsing fails
            return {
                "overall_sentiment": "neutral",
                "sentiment_score": 0,
                "emotional_tones": ["unknown"],
            }

    async def text_to_speech(self, text: str) -> bytes:
        """
        Convert text to speech using gTTS (Google Text-to-Speech).
        Returns the audio as bytes.
        """
        # Create an in-memory bytes buffer
        mp3_fp = io.BytesIO()

        # Convert text to speech
        tts = gtts.gTTS(text=text, lang="en", slow=False)
        tts.write_to_fp(mp3_fp)

        # Reset buffer position to the beginning
        mp3_fp.seek(0)

        # Return the audio bytes
        return mp3_fp.read()
