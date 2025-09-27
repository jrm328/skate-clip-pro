from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .routes import ocr

app = FastAPI(title="Skate Clip Pro API", version="0.1.0")

# --- CORS for local dev (allow everything) ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],          # for dev; later restrict to http://localhost:5173
    allow_credentials=True,
    allow_methods=["*"],          # allows OPTIONS, GET, POST, etc.
    allow_headers=["*"],
)
# ---------------------------------------------

app.include_router(ocr.router)

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend API is running 🚀"}
