from openai import AsyncOpenAI

from app.config import get_settings

SYSTEM_PROMPT = """You are a senior clinical nutritionist with 30 years of experience \
specializing in fruit-based nutrition, dietary planning, and the therapeutic use of fruits. \
You have worked with elite athletes, patients with metabolic disorders, and everyday people \
seeking optimal health.

Your role:
- Answer questions specifically about detected fruits and their nutritional properties
- Provide evidence-based nutritional advice backed by scientific research
- Explain health benefits, glycemic index, potential concerns (allergies, sugar content for diabetics, drug interactions)
- Suggest optimal consumption times, fruit combinations for maximum nutrient absorption, and preparation methods
- Compare nutritional values between the detected fruits when relevant
- Be conversational yet precise with scientific accuracy
- If asked about fruits not in the current detection, you may answer but remind the user those aren't currently visible"""


async def stream_chat_response(
    message: str,
    detected_fruits: list[str],
    history: list[dict],
):
    settings = get_settings()

    if settings.openai_api_key == "your-key-here":
        yield "Please configure your OpenAI API key in backend/.env to use the chat feature."
        return

    client = AsyncOpenAI(api_key=settings.openai_api_key)

    context = ""
    if detected_fruits:
        fruits_str = ", ".join(detected_fruits)
        context = (
            f"\n\nCurrently detected fruits in the camera feed: {fruits_str}"
        )

    messages = [
        {"role": "system", "content": SYSTEM_PROMPT + context},
        *[{"role": m["role"], "content": m["content"]} for m in history],
        {"role": "user", "content": message},
    ]

    stream = await client.chat.completions.create(
        model="gpt-4",
        messages=messages,
        stream=True,
        temperature=0.7,
        max_tokens=1000,
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
