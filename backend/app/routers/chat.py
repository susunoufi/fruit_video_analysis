from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.schemas import ChatRequest
from app.services.openai_service import stream_chat_response

router = APIRouter()


@router.post("/chat")
async def chat(request: ChatRequest):
    async def event_stream():
        try:
            async for token in stream_chat_response(
                request.message,
                request.detected_fruits,
                [m.model_dump() for m in request.history],
            ):
                yield f"data: {token}\n\n"
            yield "data: [DONE]\n\n"
        except Exception as e:
            yield f"data: [ERROR] {str(e)}\n\n"

    return StreamingResponse(
        event_stream(),
        media_type="text/event-stream",
        headers={"Cache-Control": "no-cache", "X-Accel-Buffering": "no"},
    )
