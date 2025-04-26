# llm.py
import os
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain.chains import RetrievalQA
from langchain.prompts import PromptTemplate
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()

def get_local_llm():
    """
    Create a Gemini Flash 2.0 LLM wrapper using LangChain.
    """
    print("Using Gemini Flash 2.0 from LangChain Google GenAI integration")

    google_api_key = os.getenv("GEMINI_API_KEY")
    if not google_api_key:
        raise ValueError("GEMINI_API_KEY not found in environment variables. Please set it in your .env file.")

    llm = ChatGoogleGenerativeAI(
        model="gemini-1.5-flash",
        temperature=0.7,
        max_output_tokens=2048,
        google_api_key=google_api_key
    )

    return llm

def create_qa_chain(vector_store):
    """
    Create a QA chain using the Gemini LLM and a vector store retriever.
    """
    llm = get_local_llm()

    template = """You are an expert technical writer. Given the following document excerpt, write a concise summary:
Context:
{context}
Question: {question}
Answer:"""

    PROMPT = PromptTemplate(
        template=template,
        input_variables=["context", "question"]
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=vector_store.as_retriever(search_kwargs={"k": 3}),
        return_source_documents=True,
        chain_type_kwargs={"prompt": PROMPT}
    )

    return qa_chain
