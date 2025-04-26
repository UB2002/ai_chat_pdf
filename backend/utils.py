import fitz
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.schema import Document
from langchain_community.vectorstores import FAISS
from embeddings.embeddings import embeddings

def extract_text_from_pdf(pdf_bytes):
    """
    Extract text from a PDF file.
    """
    text = []
    pdf_document = fitz.open(stream=pdf_bytes, filetype="pdf")
    for page_num, page in enumerate(pdf_document):
        page_text = page.get_text()
        if page_text.strip():
            text.append(f"Page {page_num+1}:\n{page_text}\n\n")
    return "".join(text)

def process_pdf_and_create_vector_store(pdf_bytes):
    """
    Process a PDF file and create a FAISS vector store.
    """
    # Extract text from the PDF
    pdf_text = extract_text_from_pdf(pdf_bytes)

    # Split text into smaller chunks
    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
        length_function=len,
        separators=["\n\n", "\n", " ", ""]
    )
    texts = text_splitter.split_text(pdf_text)
    documents = [Document(page_content=t) for t in texts]

    # Create a FAISS vector store
    vector_store = FAISS.from_documents(documents, embeddings)

    return vector_store