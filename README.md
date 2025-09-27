# Skate Clip Pro 🎥🛹

*AI-powered highlight generator for EA **Skate** gameplay, optimized for **YouTube Shorts**.*

[![CI](https://img.shields.io/badge/CI-GitHub%20Actions-blue)](#)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

---

## ✨ What it does (MVP)
- **Upload** Skate gameplay recordings (MP4).
- **OCR-driven detection** of HUD elements: score, multiplier, trick names, challenge/fail text.
- **Rules + ML-ready** highlight logic (high score bursts, big multipliers, bails/fails).
- **Auto-capture** around moments (pre + post), with **9:16** center-locked crop.
- **Multi-region layout option** (e.g., gameplay bottom + score HUD top).
- **Fixed overlay template** + custom **watermark/logo**.
- **Simple timeline trim** editor (extend/trim clip window).
- **Client-side processing** with FFmpeg.wasm → Shorts-ready MP4 (1080×1920).
- **YouTube OAuth** sign-in.
- **Storage quotas** per user.

---

## 🧱 Tech Stack
- **Frontend**: React (Vite) + TailwindCSS + Web Workers + **@ffmpeg/ffmpeg**
- **Backend**: FastAPI (Python) + OpenCV + Tesseract (initial OCR service)
- **ML**: Custom OCR/model fine-tuned for Skate HUD (PyTorch/TensorFlow → ONNX.js later)
- **Auth/Storage**: Firebase (Auth, Firestore, Storage) + Google/YouTube OAuth

---

## 🗂 Monorepo Layout
```
skate-clip-pro/
├─ frontend/               # SPA editor (React + Tailwind + FFmpeg.wasm)
├─ backend/                # FastAPI service (OCR/analysis endpoints)
├─ ml/                     # Training data, notebooks, models
├─ docs/                   # Architecture, roadmap, charter
└─ .github/workflows/      # CI
```

---

## 🚀 Quickstart

> Requires: Node 18+, Python 3.10+, Git

### 1) Clone
```bash
git clone https://github.com/<YOUR_USERNAME>/skate-clip-pro.git
cd skate-clip-pro
```

### 2) Frontend
```bash
cd frontend
# If not already initialized, run Vite scaffolding (safe to run in-place)
npm create vite@latest . -- --template react-ts
npm install
npm install @ffmpeg/ffmpeg @ffmpeg/util
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
npm run dev
```
Tailwind config, base CSS, and a basic `Timeline` component are already included in `frontend/`.

### 3) Backend
```bash
cd backend
python -m venv venv
# Windows: venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate
pip install -r requirements.txt
uvicorn app.main:app --reload
```
Open: `http://127.0.0.1:8000/` → should return a simple JSON “API is running”.

---

## 🔐 Environment & Config

Create `frontend/.env` (used later when we wire Firebase/YouTube):
```bash
VITE_FIREBASE_API_KEY=yourKey
VITE_FIREBASE_AUTH_DOMAIN=...
VITE_FIREBASE_PROJECT_ID=...
VITE_FIREBASE_STORAGE_BUCKET=...
VITE_FIREBASE_APP_ID=...
VITE_YOUTUBE_CLIENT_ID=...
```

Create `backend/.env` (optional for now):
```bash
OCR_PROVIDER=tesseract
# Future: model paths, thresholds, etc.
```

> **Line endings (Windows):** This repo uses a `.gitattributes` to keep LF in git history.  
If you see CRLF/LF warnings, set:  
`git config --global core.autocrlf input` (recommended) or `true` for Windows style.

---

## 🧪 Development Workflow

**Common scripts**
```bash
# frontend
npm run dev        # start Vite dev server
npm run build      # build production bundle

# backend
uvicorn app.main:app --reload  # start FastAPI
```

**Branching**
- `main` = stable  
- feature branches: `feat/<name>` (e.g., `feat/ocr-endpoint`)  
- commits follow conventional style when possible (e.g., `feat: add OCR frame sampler`)

---

## 🏗 Architecture (MVP)

**Flow**
1. User uploads video in frontend.  
2. Frontend samples frames → send to backend OCR endpoint.  
3. Backend returns HUD detections + timestamps.  
4. Frontend computes highlight windows → trims with FFmpeg.wasm in the browser.  
5. Overlays + layout applied → exports 1080×1920 MP4.  
6. (Later) Save metadata to Firestore; enforce quotas; YouTube OAuth login.  

See `docs/architecture.md` for a deeper dive.

---

## 🗺 Roadmap (high-level)

- **v0.1 (MVP)**  
  - Upload → OCR rules → highlights → trim → 9:16 → overlay → export.  
- **v1.0**  
  - Multi-region layout, watermark upload, storage quotas, YouTube OAuth login.  
- **v1.5**  
  - Bail/fail categorization, overlay style polish.  
- **v2.0**  
  - ML “wow-moment” model, YouTube Shorts direct upload, clip library dashboard.  

---

## 🤝 Contributing

PRs welcome! Please:  
- Keep PRs focused and small.  
- Add notes in `docs/` if you change architecture decisions.  
- Avoid committing large media; prefer sample snippets or link to datasets.  

---

## 📝 License
[MIT](LICENSE)
