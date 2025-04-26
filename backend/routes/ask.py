from fastapi import APIRouter, HTTPException, Request
from fastapi.responses import JSONResponse
from models.question_request import QuestionRequest
from llm import  create_qa_chain


ask_pdf_question = APIRouter()

@ask_pdf_question.post("/")
async def ask_pdf_question_endpoint(request: Request, question: QuestionRequest):

    if not hasattr(request.app.state, "vector_store"):
        raise HTTPException(
            status_code=400, detail="PDF file not uploaded or processed."
        )

    if not hasattr(request.app.state, "qa_chain"):
        request.app.state.qa_chain = create_qa_chain(request.app.state.vector_store)
        
    result = request.app.state.qa_chain({"query": question.question})        
    answer = result.get("result", "No answer generated")
    if "source_documents" in result:
        sources = [doc.page_content[:100] + "..." for doc in result["source_documents"]]
        
        # Log successful response
    return JSONResponse(content={
        "answer": answer,
        "sources": sources
    })