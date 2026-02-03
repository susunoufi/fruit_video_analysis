import asyncio
import time

from fastapi import APIRouter, WebSocket, WebSocketDisconnect

from app.services.yolo_service import YOLOService

router = APIRouter()


@router.websocket("/detect")
async def websocket_detect(websocket: WebSocket):
    await websocket.accept()
    yolo = YOLOService.get_instance()

    try:
        while True:
            data = await websocket.receive_json()
            frame_base64 = data.get("frame")
            confidence = data.get("confidence", 0.5)

            if not frame_base64:
                continue

            start = time.perf_counter()
            result = await asyncio.to_thread(
                yolo.detect_fruits, frame_base64, confidence
            )
            elapsed_ms = (time.perf_counter() - start) * 1000

            await websocket.send_json(
                {
                    "detections": result["detections"],
                    "annotated_frame": result["annotated_frame"],
                    "processing_time_ms": round(elapsed_ms, 1),
                }
            )
    except WebSocketDisconnect:
        pass
    except Exception:
        await websocket.close()
