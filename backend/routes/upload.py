from fastapi import APIRouter, UploadFile, File, Request, BackgroundTasks
from fastapi.responses import JSONResponse
from utils import process_pdf_and_create_vector_store
from database import AsyncSessionLocal
from models.document import Document
from sqlalchemy.future import select
from datetime import datetime

upload_pdf = APIRouter()

def process_pdf_task(request: Request, pdf_bytes: bytes):
    """
    Background task to process the PDF and create the vector store.
    """
    vector_store = process_pdf_and_create_vector_store(pdf_bytes)
    request.app.state.vector_store = vector_store


@upload_pdf.post("/")
async def upload_pdf_endpoint(request: Request, background_tasks: BackgroundTasks, file: UploadFile = File(...)):
    pdf_bytes = await file.read()
    request.app.state.pdf_bytes = pdf_bytes

    # Store document info in DB
    async with AsyncSessionLocal() as session:
        doc = Document(filename=file.filename, upload_date=datetime.utcnow())
        session.add(doc)
        await session.commit()

    # Add the processing task to the background
    background_tasks.add_task(process_pdf_task, request, pdf_bytes)

    return JSONResponse(content={"message": "PDF uploaded successfully. Processing in the background."})