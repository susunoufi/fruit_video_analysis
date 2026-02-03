import base64

import cv2
import numpy as np
from ultralytics import YOLO

from app.config import get_settings

FRUIT_CLASS_IDS = {46: "banana", 47: "apple", 49: "orange"}

FRUIT_COLORS = {
    "apple": (106, 244, 37),
    "banana": (0, 255, 255),
    "orange": (0, 165, 255),
}

DEFAULT_COLOR = (37, 244, 106)


class YOLOService:
    _instance = None
    _model = None

    @classmethod
    def get_instance(cls):
        if cls._instance is None:
            cls._instance = cls()
        return cls._instance

    def __init__(self):
        if YOLOService._model is None:
            settings = get_settings()
            YOLOService._model = YOLO(settings.yolo_model)

    def warmup(self):
        dummy = np.zeros((480, 640, 3), dtype=np.uint8)
        YOLOService._model.predict(
            source=dummy,
            conf=0.5,
            classes=list(FRUIT_CLASS_IDS.keys()),
            verbose=False,
        )

    def detect_fruits(
        self, frame_base64: str, confidence: float = 0.5
    ) -> dict:
        img_bytes = base64.b64decode(frame_base64)
        nparr = np.frombuffer(img_bytes, np.uint8)
        frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)

        if frame is None:
            return {"detections": [], "annotated_frame": frame_base64}

        results = YOLOService._model.predict(
            source=frame,
            conf=confidence,
            classes=list(FRUIT_CLASS_IDS.keys()),
            verbose=False,
        )

        detections = []
        annotated = frame.copy()

        for result in results:
            boxes = result.boxes
            if boxes is None:
                continue
            for box in boxes:
                cls_id = int(box.cls[0])
                conf = float(box.conf[0])
                x1, y1, x2, y2 = [float(v) for v in box.xyxy[0]]

                fruit_name = FRUIT_CLASS_IDS.get(cls_id, "unknown")
                if fruit_name == "unknown":
                    continue

                detections.append(
                    {
                        "fruit_name": fruit_name,
                        "confidence": round(conf, 2),
                        "bbox": [round(x1), round(y1), round(x2), round(y2)],
                    }
                )

                color = FRUIT_COLORS.get(fruit_name, DEFAULT_COLOR)
                cv2.rectangle(
                    annotated,
                    (int(x1), int(y1)),
                    (int(x2), int(y2)),
                    color,
                    2,
                )

                label = f"{fruit_name.capitalize()} {conf:.2f}"
                label_size, _ = cv2.getTextSize(
                    label, cv2.FONT_HERSHEY_SIMPLEX, 0.6, 2
                )
                cv2.rectangle(
                    annotated,
                    (int(x1), int(y1) - label_size[1] - 10),
                    (int(x1) + label_size[0] + 4, int(y1)),
                    color,
                    -1,
                )
                cv2.putText(
                    annotated,
                    label,
                    (int(x1) + 2, int(y1) - 5),
                    cv2.FONT_HERSHEY_SIMPLEX,
                    0.6,
                    (0, 0, 0),
                    2,
                )

        _, buffer = cv2.imencode(
            ".jpg", annotated, [cv2.IMWRITE_JPEG_QUALITY, 70]
        )
        annotated_base64 = base64.b64encode(buffer).decode("utf-8")

        return {
            "detections": detections,
            "annotated_frame": annotated_base64,
        }
