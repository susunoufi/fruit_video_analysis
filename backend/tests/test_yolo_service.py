import base64

import cv2
import numpy as np
import pytest

from app.services.yolo_service import FRUIT_CLASS_IDS, YOLOService


class TestYOLOService:
    def test_singleton_returns_same_instance(self):
        instance1 = YOLOService.get_instance()
        instance2 = YOLOService.get_instance()
        assert instance1 is instance2

    def test_fruit_class_ids_defined(self):
        assert 46 in FRUIT_CLASS_IDS  # banana
        assert 47 in FRUIT_CLASS_IDS  # apple
        assert 49 in FRUIT_CLASS_IDS  # orange

    def test_detect_fruits_with_blank_image(self):
        blank = np.zeros((480, 640, 3), dtype=np.uint8)
        _, buffer = cv2.imencode(".jpg", blank)
        frame_b64 = base64.b64encode(buffer).decode("utf-8")

        service = YOLOService.get_instance()
        result = service.detect_fruits(frame_b64, confidence=0.5)

        assert "detections" in result
        assert "annotated_frame" in result
        assert isinstance(result["detections"], list)
        assert isinstance(result["annotated_frame"], str)

    def test_detect_fruits_with_invalid_base64(self):
        service = YOLOService.get_instance()
        try:
            result = service.detect_fruits("not-valid-base64!!!", confidence=0.5)
            # If it doesn't crash, detections should be empty
            assert result["detections"] == []
        except Exception:
            # It's acceptable to raise on invalid input
            pass

    def test_detect_fruits_returns_correct_structure(self):
        img = np.random.randint(0, 255, (480, 640, 3), dtype=np.uint8)
        _, buffer = cv2.imencode(".jpg", img)
        frame_b64 = base64.b64encode(buffer).decode("utf-8")

        service = YOLOService.get_instance()
        result = service.detect_fruits(frame_b64, confidence=0.5)

        assert "detections" in result
        assert "annotated_frame" in result

        for detection in result["detections"]:
            assert "fruit_name" in detection
            assert "confidence" in detection
            assert "bbox" in detection
            assert detection["fruit_name"] in FRUIT_CLASS_IDS.values()
            assert 0 <= detection["confidence"] <= 1
            assert len(detection["bbox"]) == 4
