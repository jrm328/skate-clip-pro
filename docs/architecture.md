# Architecture (MVP)

## Overview
- **Frontend** (React + Tailwind + FFmpeg.wasm): upload, detect highlights, timeline trim, overlay, export.
- **Backend** (FastAPI): OCR+analysis endpoints. Future: ML “wow-moment” model hosting.
- **Storage/Auth**: Firebase (Firestore for metadata, Storage for clips), Google/YouTube OAuth.

## Data Flow
1. User uploads video → client pre-process (optional keyframes).
2. Client sends sampled frames to backend OCR endpoint.
3. Backend returns detected HUD metadata (scores, multipliers, trick names, fails) + timestamps.
4. Client computes highlight windows → trims with FFmpeg.wasm.
5. Client applies overlays/layout → exports 1080×1920 MP4.
