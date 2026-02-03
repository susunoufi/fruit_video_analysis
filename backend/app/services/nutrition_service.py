import json
from functools import lru_cache
from pathlib import Path


@lru_cache(maxsize=1)
def _load_nutrition_data() -> dict:
    data_path = Path(__file__).parent.parent / "data" / "nutrition_data.json"
    with open(data_path, "r", encoding="utf-8") as f:
        return json.load(f)


def get_fruit_nutrition(fruit_name: str) -> dict | None:
    data = _load_nutrition_data()
    normalized = fruit_name.lower().strip().replace(" ", "_")
    return data.get(normalized)


def get_bulk_nutrition(fruit_names: list[str]) -> dict:
    return {
        name: get_fruit_nutrition(name)
        for name in fruit_names
        if get_fruit_nutrition(name) is not None
    }


def get_available_fruits() -> list[str]:
    return list(_load_nutrition_data().keys())
