# backend/app/services/ocr_engine.py
import os
import cv2
import numpy as np
import pytesseract

# --- Make Tesseract work on Windows even if not on PATH ---
def _maybe_set_tesseract_cmd():
    # already set or found on PATH?
    try:
        v = pytesseract.get_tesseract_version()
        if v:
            return
    except Exception:
        pass

    # Common Windows install paths
    CANDIDATES = [
        r"C:\Program Files\Tesseract-OCR\tesseract.exe",
        r"C:\Program Files (x86)\Tesseract-OCR\tesseract.exe",
        os.path.expandvars(r"%LOCALAPPDATA%\Programs\Tesseract-OCR\tesseract.exe"),
        os.path.expandvars(r"%PROGRAMFILES%\Tesseract-OCR\tesseract.exe"),
    ]
    for p in CANDIDATES:
        if p and os.path.isfile(p):
            pytesseract.pytesseract.tesseract_cmd = p
            return
    # If we get here, we didn't find it. We'll let calls raise a clear error.

_maybe_set_tesseract_cmd()
# ----------------------------------------------------------

# Relative ROIs (x, y, w, h) in 0..1 space. Tweak these as you iterate.
ROIS = {
    "challenge_banner": (0.05, 0.08, 0.42, 0.16),
    "location_title":   (0.43, 0.11, 0.22, 0.07),
    "trick_text":       (0.05, 0.74, 0.45, 0.16),
    "multiplier_ring":  (0.05, 0.82, 0.12, 0.14),
    "score_block":      (0.16, 0.83, 0.18, 0.13),
}

def _extract_roi(img_bgr: np.ndarray, roi):
    H, W = img_bgr.shape[:2]
    x, y, w, h = roi
    X, Y, Wc, Hc = int(x * W), int(y * H), int(w * W), int(h * H)
    X2, Y2 = min(W, X + Wc), min(H, Y + Hc)
    return img_bgr[Y:Y2, X:X2].copy()

def _prep_text(bgr: np.ndarray) -> np.ndarray:
    gray = cv2.cvtColor(bgr, cv2.COLOR_BGR2GRAY)
    gray = cv2.bilateralFilter(gray, 7, 55, 55)   # denoise but keep edges
    clahe = cv2.createCLAHE(clipLimit=2.0, tileGridSize=(8, 8)).apply(gray)
    _, th = cv2.threshold(clahe, 0, 255, cv2.THRESH_BINARY + cv2.THRESH_OTSU)
    th = cv2.medianBlur(th, 3)
    return th

def ocr_frame(image_bgr: np.ndarray) -> dict:
    """Run OCR over predefined HUD ROIs for a single BGR frame."""
    # Verify tesseract is callable; raise a helpful error if not
    try:
        _ = pytesseract.get_tesseract_version()
    except Exception as e:
        raise RuntimeError(
            "Tesseract executable not found. Install via winget "
            "(`winget install -e --id UB-Mannheim.TesseractOCR`) or set "
            "`pytesseract.pytesseract.tesseract_cmd` to the tesseract.exe path."
        ) from e

    results = {}
    cfg_text   = r'--psm 6 -l eng'
    cfg_title  = r'--psm 7 -l eng'
    cfg_digits = r'--psm 6 -l eng -c tessedit_char_whitelist=0123456789xX.+'

    for name, roi in ROIS.items():
        crop = _extract_roi(image_bgr, roi)
        binimg = _prep_text(crop)

        if name in ("score_block", "multiplier_ring"):
            cfg = cfg_digits
        elif name in ("location_title",):
            cfg = cfg_title
        else:
            cfg = cfg_text

        txt = pytesseract.image_to_string(binimg, config=cfg)
        clean = " ".join(txt.strip().split())
        results[name] = clean

    return results
