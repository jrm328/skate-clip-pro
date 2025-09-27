from fastapi import FastAPI

app = FastAPI(title="Skate Clip Pro API", version="0.1.0")

@app.get("/")
def read_root():
    return {"status": "ok", "message": "Backend API is running 🚀"}
