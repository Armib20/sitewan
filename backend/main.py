import os
import uvicorn
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api import router


app = FastAPI()

env = os.getenv("ENV", "development")
if env == "production":
    origins = ["https://irisxu.me/rubik"]
else:
    origins = ["http://127.0.0.1:5500"]


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

    if env == "production":
        uvicorn.run("main:app", host="0.0.0.0", port=port)
    else:
        uvicorn.run("main:app", host="127.0.0.1", port=port, reload=True)
