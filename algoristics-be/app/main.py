from fastapi import FastAPI
from starlette.middleware.cors import CORSMiddleware
from app.routers import api, summarize

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(api.router, prefix="", tags=["API"])
app.include_router(summarize.router, prefix="", tags=["Summarization"])

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
