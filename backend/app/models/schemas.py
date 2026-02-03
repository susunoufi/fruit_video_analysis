from pydantic import BaseModel


class DetectionResult(BaseModel):
    fruit_name: str
    confidence: float
    bbox: list[float]


class FrameResponse(BaseModel):
    detections: list[DetectionResult]
    annotated_frame: str
    processing_time_ms: float


class NutritionInfo(BaseModel):
    name: str
    serving_size: str
    calories: float
    protein_g: float
    carbs_g: float
    fat_g: float
    fiber_g: float
    sugar_g: float
    vitamin_c_mg: float
    vitamin_a_mcg: float
    vitamin_k_mcg: float
    vitamin_b6_mg: float
    potassium_mg: float
    magnesium_mg: float
    iron_mg: float


class ChatMessage(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    message: str
    detected_fruits: list[str] = []
    history: list[ChatMessage] = []
