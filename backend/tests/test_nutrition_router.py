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
async def test_get_nutrition_apple(client):
    response = await client.get("/api/nutrition/apple")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert data["data"]["name"] == "Apple"
    assert data["data"]["calories"] == 95


@pytest.mark.anyio
async def test_get_nutrition_unknown_returns_404(client):
    response = await client.get("/api/nutrition/unknown_fruit")
    assert response.status_code == 404


@pytest.mark.anyio
async def test_get_bulk_nutrition(client):
    response = await client.get("/api/nutrition/bulk?fruits=apple,banana")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert "apple" in data["data"]
    assert "banana" in data["data"]


@pytest.mark.anyio
async def test_list_fruits(client):
    response = await client.get("/api/nutrition/list")
    assert response.status_code == 200
    data = response.json()
    assert data["success"] is True
    assert len(data["data"]) >= 30


@pytest.mark.anyio
async def test_health_check(client):
    response = await client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "healthy"}
