from fastapi import APIRouter

hello = APIRouter()

@hello.get("/")
async def index():
    return "Hello World"