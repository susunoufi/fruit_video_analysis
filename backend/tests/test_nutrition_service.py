import pytest
from app.services.nutrition_service import (
    get_available_fruits,
    get_bulk_nutrition,
    get_fruit_nutrition,
)


class TestGetFruitNutrition:
    def test_valid_fruit_returns_data(self):
        result = get_fruit_nutrition("apple")
        assert result is not None
        assert result["name"] == "Apple"
        assert result["calories"] == 95

    def test_case_insensitive(self):
        result = get_fruit_nutrition("BANANA")
        assert result is not None
        assert result["name"] == "Banana"

    def test_whitespace_handling(self):
        result = get_fruit_nutrition("  orange  ")
        assert result is not None
        assert result["name"] == "Orange"

    def test_unknown_fruit_returns_none(self):
        result = get_fruit_nutrition("unicorn_fruit")
        assert result is None

    def test_empty_string_returns_none(self):
        result = get_fruit_nutrition("")
        assert result is None

    def test_nutrition_fields_present(self):
        result = get_fruit_nutrition("apple")
        required_fields = [
            "name", "serving_size", "calories", "protein_g",
            "carbs_g", "fat_g", "fiber_g", "sugar_g",
            "vitamin_c_mg", "potassium_mg",
        ]
        for field in required_fields:
            assert field in result, f"Missing field: {field}"


class TestGetBulkNutrition:
    def test_multiple_fruits(self):
        result = get_bulk_nutrition(["apple", "banana"])
        assert "apple" in result
        assert "banana" in result
        assert len(result) == 2

    def test_skips_unknown_fruits(self):
        result = get_bulk_nutrition(["apple", "unknown_fruit"])
        assert "apple" in result
        assert "unknown_fruit" not in result

    def test_empty_list(self):
        result = get_bulk_nutrition([])
        assert result == {}


class TestGetAvailableFruits:
    def test_returns_list(self):
        result = get_available_fruits()
        assert isinstance(result, list)
        assert len(result) >= 30

    def test_contains_common_fruits(self):
        result = get_available_fruits()
        assert "apple" in result
        assert "banana" in result
        assert "orange" in result
