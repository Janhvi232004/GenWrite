"""
ai_service.py
=============
All AI logic lives in this single file so the rest of the app never needs to
know *how* content is generated. app.py simply calls `generate_content()`.

Flow:
    topic + content type + tone  ->  prompt  ->  NVIDIA NIM API  ->  text
"""

import os
import re

import requests

# NVIDIA NIM exposes an OpenAI-compatible "chat completions" endpoint.
NVIDIA_API_URL = "https://integrate.api.nvidia.com/v1/chat/completions"

# Default model (can be overridden with NVIDIA_MODEL in the .env file).
DEFAULT_MODEL = "nvidia/nemotron-3.5-lightning-30b-a3b"

# The values the frontend is allowed to send.
CONTENT_TYPES = [
    "Blog",
    "LinkedIn Post",
    "Instagram Caption",
    "Product Description",
    "Email",
]
TONES = ["Professional", "Casual", "Friendly", "Creative", "Marketing"]

# The base prompt template.
PROMPT_TEMPLATE = """You are an expert content writer.

Topic: {topic}

Content Type: {content_type}

Tone: {tone}

Generate detailed, engaging, professional and high-quality content."""

# Extra guidance for each content type so the output has the right shape.
FORMAT_HINTS = {
    "Blog": (
        "Write a complete blog post with a catchy title, a short introduction, "
        "3-5 sections with clear headings and a conclusion. Aim for 500-700 words."
    ),
    "LinkedIn Post": (
        "Write a LinkedIn post with a strong opening hook, short punchy paragraphs, "
        "one key takeaway, a closing question and 3-5 relevant hashtags. "
        "Aim for 150-250 words."
    ),
    "Instagram Caption": (
        "Write an engaging Instagram caption with a hook, a few relevant emojis, "
        "a call to action and 8-12 relevant hashtags at the end. "
        "Keep the caption itself under 120 words."
    ),
    "Product Description": (
        "Write a persuasive product description with a headline, a short overview, "
        "4-6 benefit-focused bullet points and a closing call to action. "
        "Aim for 150-250 words."
    ),
    "Email": (
        "Write a complete email with a 'Subject:' line, a greeting, a clear body, "
        "a call to action and a sign-off. Aim for 150-250 words."
    ),
}

FORMAT_RULES = (
    "Respond with the final content only - no preamble and no explanations. "
    "Use simple Markdown (# headings, - bullet points, **bold**) only where it helps."
)


class AIServiceError(Exception):
    """Raised when content could not be generated. Carries an HTTP status code."""

    def __init__(self, message, status_code=502):
        super().__init__(message)
        self.status_code = status_code


def build_prompt(topic, content_type, tone):
    """Fill the prompt template and add the type-specific hints."""
    base = PROMPT_TEMPLATE.format(topic=topic, content_type=content_type, tone=tone)
    hint = FORMAT_HINTS.get(content_type, "")
    return f"{base}\n\n{hint}\n\n{FORMAT_RULES}"


def _clean_output(text):
    """Remove any <think>...</think> block some reasoning models add."""
    text = re.sub(r"<think>.*?</think>", "", text, flags=re.DOTALL)
    return text.strip()


def generate_content(topic, content_type, tone):
    """
    Ask the NVIDIA NIM API to write content and return it as a string.
    Raises AIServiceError with a friendly message if anything goes wrong.
    """
    api_key = os.getenv("NVIDIA_API_KEY", "").strip()
    if not api_key or api_key == "YOUR_API_KEY":
        raise AIServiceError(
            "NVIDIA_API_KEY is not set. Add your key to the .env file and restart the server.",
            status_code=500,
        )

    model = os.getenv("NVIDIA_MODEL", DEFAULT_MODEL).strip() or DEFAULT_MODEL

    payload = {
        "model": model,
        "messages": [
            {"role": "user", "content": build_prompt(topic, content_type, tone)}
        ],
        "temperature": 0.7,
        "top_p": 0.95,
        "max_tokens": 2048,
        "stream": False,
    }
    headers = {
        "Authorization": f"Bearer {api_key}",
        "Accept": "application/json",
        "Content-Type": "application/json",
    }

    try:
        response = requests.post(
            NVIDIA_API_URL, headers=headers, json=payload, timeout=90
        )
    except requests.Timeout:
        raise AIServiceError("The AI took too long to respond. Please try again.", 504)
    except requests.ConnectionError:
        raise AIServiceError(
            "Could not reach the NVIDIA API. Check your internet connection.", 503
        )
    except requests.RequestException as exc:
        raise AIServiceError(f"Request to the AI service failed: {exc}", 502)

    # Translate common HTTP errors into clear messages.
    if response.status_code in (401, 403):
        raise AIServiceError("The NVIDIA API key was rejected. Please check it.", 502)
    if response.status_code == 429:
        raise AIServiceError("Rate limit reached. Please wait a moment and retry.", 429)
    if not response.ok:
        raise AIServiceError(
            f"The AI service returned an error ({response.status_code}).", 502
        )

    try:
        data = response.json()
        content = data["choices"][0]["message"]["content"] or ""
    except (ValueError, KeyError, IndexError, TypeError):
        raise AIServiceError("The AI service returned an unexpected response.", 502)

    content = _clean_output(content)
    if not content:
        raise AIServiceError("The AI returned empty content. Please try again.", 502)

    return content
