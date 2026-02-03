from fastapi import APIRouter, HTTPException, Query

from app.services.nutrition_service import (
    get_available_fruits,
    get_bulk_nutrition,
    get_fruit_nutrition,
)

router = APIRouter()


@router.get("/list")
async def list_fruits():
    return {"success": True, "data": get_available_fruits()}


@router.get("/bulk")
async def get_bulk(
    fruits: str = Query(..., description="Comma-separated fruit names"),
):
    fruit_list = [f.strip() for f in fruits.split(",") if f.strip()]
    results = get_bulk_nutrition(fruit_list)
    return {"success": True, "data": results}


@router.get("/{fruit_name}")
async def get_nutrition(fruit_name: str):
    result = get_fruit_nutrition(fruit_name)
    if not result:
        raise HTTPException(404, f"Nutrition data not found for '{fruit_name}'")
    return {"success": True, "data": result}
