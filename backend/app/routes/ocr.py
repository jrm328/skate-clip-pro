from fastapi import APIRouter
from pydantic import BaseModel
import base64, numpy as np, cv2
from ..services.ocr_engine import ocr_frame

router = APIRouter(prefix="/ocr", tags=["ocr"])

class FrameReq(BaseModel):
    image_b64: str

@router.post("/frame")
def analyze_frame(req: FrameReq):
    raw = req.image_b64.split(",")[-1]
    data = base64.b64decode(raw)
    img_array = np.frombuffer(data, np.uint8)
    bgr = cv2.imdecode(img_array, cv2.IMREAD_COLOR)
    return {"ok": True, "results": ocr_frame(bgr)}
