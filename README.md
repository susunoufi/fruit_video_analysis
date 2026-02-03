# Fruit Detection & Nutrition Analyzer

Real-time fruit detection system using computer vision (YOLOv8) with nutritional analysis and AI-powered nutrition guidance (GPT-4).

## Architecture Overview

```mermaid
graph TB
    subgraph Frontend["Frontend (React 19 + Vite)"]
        UI[App Component]
        WC[WebcamFeed]
        DC[DetectionControls]
        DF[DetectedFruits]
        NP[NutritionPanel]
        CI[ChatInterface]
        HD[Header]
        FT[Footer]

        UI --> WC
        UI --> DC
        UI --> DF
        UI --> NP
        UI --> CI
        UI --> HD
        UI --> FT
    end

    subgraph Backend["Backend (FastAPI)"]
        MAIN[main.py]
        WS_R[detection router]
        NUT_R[nutrition router]
        CHAT_R[chat router]

        MAIN --> WS_R
        MAIN --> NUT_R
        MAIN --> CHAT_R

        YOLO[YOLOService]
        NUT_S[NutritionService]
        OAI[OpenAIService]

        WS_R --> YOLO
        NUT_R --> NUT_S
        CHAT_R --> OAI
    end

    subgraph Data["Data & Models"]
        YOLO_M[YOLOv8n Model]
        NUT_D[nutrition_data.json]
        GPT[GPT-4 API]
    end

    WC -- "WebSocket /ws/detect" --> WS_R
    NP -- "GET /api/nutrition/*" --> NUT_R
    CI -- "POST /api/chat (SSE)" --> CHAT_R

    YOLO --> YOLO_M
    NUT_S --> NUT_D
    OAI --> GPT
```

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant Webcam
    participant Frontend
    participant WebSocket
    participant YOLO as YOLOv8 Service
    participant NutritionAPI as Nutrition API
    participant ChatAPI as Chat API (GPT-4)

    User->>Webcam: Enable camera
    loop Every frame (1-30 FPS)
        Webcam->>Frontend: Capture frame
        Frontend->>WebSocket: Send base64 frame + confidence
        WebSocket->>YOLO: detect_fruits()
        YOLO-->>WebSocket: detections + annotated_frame
        WebSocket-->>Frontend: JSON response
        Frontend->>Frontend: Update UI (boxes, counts)
    end

    Frontend->>NutritionAPI: GET /api/nutrition/bulk?fruits=apple,banana
    NutritionAPI-->>Frontend: Nutrition data (calories, vitamins, macros)
    Frontend->>Frontend: Render NutritionPanel charts

    User->>Frontend: Ask nutrition question
    Frontend->>ChatAPI: POST /api/chat (message + detected_fruits + history)
    loop SSE Stream
        ChatAPI-->>Frontend: data: token
        Frontend->>Frontend: Append token to message
    end
```

## Project Structure

```mermaid
graph LR
    subgraph Root["fruit_video_analysis/"]
        README[README.md]
        GI[.gitignore]

        subgraph BE["backend/"]
            REQ[requirements.txt]
            ENV[.env]

            subgraph APP["app/"]
                MAIN_PY[main.py]
                CONFIG[config.py]

                subgraph MODELS["models/"]
                    SCHEMAS[schemas.py]
                end

                subgraph ROUTERS["routers/"]
                    DET_R[detection.py]
                    NUT_R2[nutrition.py]
                    CHAT_R2[chat.py]
                end

                subgraph SERVICES["services/"]
                    YOLO_S[yolo_service.py]
                    NUT_SV[nutrition_service.py]
                    OAI_S[openai_service.py]
                end

                subgraph DATA["data/"]
                    NUT_JSON[nutrition_data.json]
                end
            end

            subgraph TESTS["tests/"]
                T1[test_yolo_service.py]
                T2[test_nutrition_service.py]
                T3[test_nutrition_router.py]
                T4[test_chat_router.py]
            end
        end

        subgraph FE["frontend/"]
            PKG[package.json]
            VITE[vite.config.js]
            IDX[index.html]

            subgraph SRC["src/"]
                APP_JSX[App.jsx]
                MAIN_JSX[main.jsx]
                CSS[index.css]

                subgraph COMP["components/"]
                    C1[Header.jsx]
                    C2[WebcamFeed.jsx]
                    C3[DetectionControls.jsx]
                    C4[ChatInterface.jsx]
                    C5[DetectedFruits.jsx]
                    C6[NutritionPanel.jsx]
                    C7[Footer.jsx]
                end

                subgraph HOOKS["hooks/"]
                    H1[useWebcam.js]
                    H2[useChat.js]
                end

                subgraph SVCS["services/"]
                    S1[api.js]
                    S2[websocket.js]
                end
            end
        end
    end
```

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| **Frontend** | React 19 | UI framework |
| **Build** | Vite 7 | Dev server & bundler |
| **Styling** | Tailwind CSS 4 | Utility-first CSS |
| **Charts** | Recharts | Nutrition data visualization |
| **Backend** | FastAPI | Async Python API server |
| **Detection** | YOLOv8n (Ultralytics) | Real-time object detection |
| **Vision** | OpenCV | Image processing |
| **AI Chat** | OpenAI GPT-4 | Nutrition guidance |
| **Realtime** | WebSocket | Frame streaming |
| **Streaming** | SSE | Chat token streaming |
| **Validation** | Pydantic | Request/response schemas |
| **Testing** | pytest + pytest-asyncio | Backend tests |

## Features

- **Real-time fruit detection** via webcam with YOLOv8 (apple, banana, orange)
- **Adjustable confidence threshold** (0.1 - 1.0) and **FPS control** (1 - 30)
- **Annotated video feed** with colored bounding boxes per fruit type
- **Nutrition database** with 40+ fruits including macros and micronutrients
- **Interactive charts** showing calorie breakdown and vitamin percentages
- **AI nutritionist chat** with GPT-4 streaming responses aware of detected fruits
- **Auto-reconnecting WebSocket** with exponential backoff
- **Dark mode UI** with responsive design

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check |
| `WS` | `/ws/detect` | Real-time fruit detection |
| `GET` | `/api/nutrition/list` | List all available fruits |
| `GET` | `/api/nutrition/{name}` | Get nutrition for a fruit |
| `GET` | `/api/nutrition/bulk?fruits=...` | Batch nutrition lookup |
| `POST` | `/api/chat` | AI nutritionist chat (SSE stream) |

## Getting Started

### Prerequisites

- Python 3.10+
- Node.js 18+
- OpenAI API key

### Backend Setup

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Create a `.env` file:

```env
OPENAI_API_KEY=your-api-key-here
YOLO_MODEL=yolov8n.pt
YOLO_CONFIDENCE_THRESHOLD=0.5
CORS_ORIGINS=http://localhost:5173
```

Start the backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

### Running Tests

```bash
cd backend
pytest tests/ -v
```

## Detected Fruit Classes

| Class ID | Fruit | Box Color |
|----------|-------|-----------|
| 46 | Banana | Cyan |
| 47 | Apple | Green |
| 49 | Orange | Orange |

## Component Diagram

```mermaid
graph TD
    APP[App.jsx] --> |state orchestration| HOOKS

    subgraph HOOKS["Custom Hooks"]
        UW[useWebcam] --> |WebSocket mgmt| WS_SVC[websocket.js]
        UC[useChat] --> |REST + SSE| API_SVC[api.js]
    end

    APP --> HEADER[Header]
    APP --> WEBCAM[WebcamFeed]
    APP --> CONTROLS[DetectionControls]
    APP --> FRUITS[DetectedFruits]
    APP --> NUTRITION[NutritionPanel]
    APP --> CHAT[ChatInterface]
    APP --> FOOTER[Footer]

    WEBCAM --> |webcamRef| UW
    CONTROLS --> |confidence, fps| UW
    CHAT --> |messages, send| UC
    NUTRITION --> |detectedFruits| API_SVC

    WS_SVC --> |ws://localhost:8000/ws/detect| BE_WS[Backend WebSocket]
    API_SVC --> |http://localhost:8000/api/*| BE_REST[Backend REST]
```

## Backend Services

```mermaid
classDiagram
    class YOLOService {
        -model: YOLO
        -FRUIT_CLASSES: dict
        -FRUIT_COLORS: dict
        +detect_fruits(frame_b64, confidence) FrameResponse
        +warmup()
    }

    class NutritionService {
        +get_fruit_nutrition(name) NutritionInfo
        +get_bulk_nutrition(fruits) dict
        +get_available_fruits() list
        -_load_nutrition_data() dict
    }

    class OpenAIService {
        -client: AsyncOpenAI
        -SYSTEM_PROMPT: str
        +stream_chat(message, fruits, history) AsyncGenerator
    }

    class DetectionRouter {
        +websocket_detect(ws)
    }

    class NutritionRouter {
        +list_fruits()
        +get_nutrition(name)
        +get_bulk_nutrition(fruits)
    }

    class ChatRouter {
        +chat(request)
    }

    DetectionRouter --> YOLOService
    NutritionRouter --> NutritionService
    ChatRouter --> OpenAIService
```

## License

This project is for educational and demonstration purposes.
