from unittest.mock import AsyncMock, patch

import pytest
from httpx import ASGITransport, AsyncClient

from app.main import app


@pytest.fixture
def anyio_backend():
    return "asyncio"


@pytest.fixture
async def client():
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as c:
        yield c


@pytest.mark.anyio
async def test_chat_returns_sse_stream(client):
    async def mock_stream(*args, **kwargs):
        yield "Hello "
        yield "world!"

    with patch(
        "app.routers.chat.stream_chat_response",
        return_value=mock_stream(),
    ):
        response = await client.post(
            "/api/chat",
            json={
                "message": "What vitamins are in apples?",
                "detected_fruits": ["apple"],
                "history": [],
            },
        )

    assert response.status_code == 200
    assert "text/event-stream" in response.headers["content-type"]

    body = response.text
    assert "data: Hello " in body
    assert "data: world!" in body
    assert "data: [DONE]" in body


@pytest.mark.anyio
async def test_chat_with_empty_request(client):
    async def mock_stream(*args, **kwargs):
        yield "Response"

    with patch(
        "app.routers.chat.stream_chat_response",
        return_value=mock_stream(),
    ):
        response = await client.post(
            "/api/chat",
            json={
                "message": "Hello",
                "detected_fruits": [],
                "history": [],
            },
        )

    assert response.status_code == 200


@pytest.mark.anyio
async def test_chat_with_history(client):
    async def mock_stream(*args, **kwargs):
        yield "Based on our conversation..."

    with patch(
        "app.routers.chat.stream_chat_response",
        return_value=mock_stream(),
    ):
        response = await client.post(
            "/api/chat",
            json={
                "message": "Tell me more",
                "detected_fruits": ["banana"],
                "history": [
                    {"role": "user", "content": "What about bananas?"},
                    {"role": "assistant", "content": "Bananas are great!"},
                ],
            },
        )

    assert response.status_code == 200
