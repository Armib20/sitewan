import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router


app = FastAPI()

# Use environment variable for frontend URL
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")

origins = [
    frontend_url,
    "http://127.0.0.1:5500",  # original frontend
    "http://localhost:5173",   # Vite dev server
    "http://127.0.0.1:5173",   # Vite dev server alternative
]


app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router)

if __name__ == "__main__":
    port = int(os.getenv("PORT", 8080))
    host = os.getenv("HOST", "127.0.0.1")
    
    uvicorn.run("main:app", host=host, port=port, reload=True)
