import fitz  # PyMuPDF
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import JSONResponse
from fastapi import HTTPException
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain.text_splitter import CharacterTextSplitter
from langchain.schema import Document
import uvicorn
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware


app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Adjust this to your frontend's origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
# Initialize LangChain's HuggingFaceEmbeddings directly with the model name
embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")


# Function to extract text from a PDF
def extract_text_from_pdf(pdf_bytes):
    text = ""
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    for page in pdf_document:
        text += page.get_text()
    return text


# Function to process PDF and create a vector store
def process_pdf_and_create_vector_store(pdf_bytes):
    # Extract text
    pdf_text = extract_text_from_pdf(pdf_bytes)

    # Split text into smaller chunks for better retrieval
    text_splitter = CharacterTextSplitter(
        separator=".", chunk_size=300, chunk_overlap=0
    )
    texts = text_splitter.split_text(pdf_text)
    documents = [Document(page_content=t) for t in texts]

    # Create a FAISS vector store for efficient retrieval
    vector_store = FAISS.from_documents(documents, embeddings)

    return vector_store


# Create a model for the question request
class QuestionRequest(BaseModel):
    question: str


# Route for uploading the PDF
@app.post("/upload/")
async def upload_pdf(file: UploadFile = File(...)):
    # Store the uploaded file in memory
    app.state.pdf_bytes = await file.read()  # Store PDF bytes in app state
    app.state.vector_store = process_pdf_and_create_vector_store(
        app.state.pdf_bytes
    )  # Create vector store
    return JSONResponse(content={"message": "PDF uploaded and processed successfully."})


# Route for asking a question about the uploaded PDF
@app.post("/ask/")
async def ask_pdf_question(request: QuestionRequest):
    # Ensure PDF is uploaded and processed
    if not hasattr(app.state, "vector_store"):
        raise HTTPException(
            status_code=400, detail="PDF file not uploaded or processed."
        )

    # Get the retriever from the vector store
    retriever = app.state.vector_store.as_retriever()
    relevant_docs = retriever.invoke(request.question)

    # Return the first document as a mock answer
    answer = (
        relevant_docs[0].page_content if relevant_docs else "No relevant content found."
    )
    return JSONResponse(content={"answer": answer})


if __name__ == "__main__":
    # Start the FastAPI server
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
