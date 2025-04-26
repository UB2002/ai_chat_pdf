from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from routes.upload import upload_pdf
from routes.ask import ask_pdf_question
from routes.hello import hello
from database import init_db

# FastAPI app initialization
app = FastAPI()

# CORS middleware configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def on_startup():
    await init_db()
# Include routes
app.include_router(hello, tags=["hello"])
app.include_router(upload_pdf, prefix="/upload", tags=["Upload"])
app.include_router(ask_pdf_question, prefix="/ask", tags=["Ask"])

# Main entry point
if __name__ == "__main__":
    uvicorn.run("server:app", host="localhost", port=8000, reload=True)