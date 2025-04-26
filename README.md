# AI Chat PDF

This project allows you to chat with your PDF documents using a React frontend and a Python FastAPI backend powered by LangChain and Google Gemini.

## Getting Started

### Prerequisites

- Node.js and npm (or yarn)
- Python 3.8+
- pip
- Git
- A Google Gemini API Key (set as `GEMINI_API_KEY` environment variable in a `.env` file inside the `backend/` directory)

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/UB2002/ai_chat_pdf.git
   cd ai_chat_pdf
   ```

2. **Setup Frontend:**
   ```bash
   npm install
   ```

3. **Setup Backend:**
   ```bash
   cd backend

   # Create and activate a virtual environment (recommended)
   python -m venv venv

   # On Windows
   .\venv\Scripts\activate

   # On macOS/Linux
   source venv/bin/activate

   # Install dependencies
   pip install -r requirements.txt

   # Create a .env file in the backend directory and add your API key:
   # GEMINI_API_KEY=YOUR_API_KEY_HERE
   ```

### Running the Application

1. **Start the Backend Server:**
   ```bash
   uvicorn server:app --host 0.0.0.0 --port 8000
   ```

2. **Start the Frontend Development Server:**
   Open a new terminal, navigate to the project's root directory, and run:
   ```bash
   npm start
   ```

   The application will open in your default browser at `http://localhost:3000`.

## Project Structure

### Backend (`backend/`)

- **server.py**: Initializes the FastAPI application, sets up middleware, and includes API routes.
- **database.py**: Configures the database connection (SQLite) with SQLAlchemy.
- **llm.py**: Manages integration with Google Gemini LLM through LangChain.
- **routes/upload.py**: Handles `/upload` endpoint to process and vectorize PDF documents.
- **routes/ask.py**: Handles `/ask` endpoint to receive user questions and generate answers.
- **models/**: Contains data models for documents and request structures.
- **embeddings/embeddings.py**: Manages creation of text embeddings for document chunks.
- **utils.py**: Contains helper functions for PDF processing and vector store creation.
- **requirements.txt**: Python dependencies list.
- **.env**: Environment variables file (you create this).

### Frontend (`src/`)

- **App.js**: Root React component.
- **index.js**: React app entry point.
- **components/NavBar.js**: Displays navigation bar with logo and file upload.
- **components/Chat.js**: Manages chat interactions and communication with backend.
- **assets/**: Holds static resources like images (e.g., logo).
- **index.css** / **App.css**: CSS files for global and specific styling (mostly styled with Material-UI).

## How It Works

1. User uploads a PDF using the React frontend (NavBar component).
2. The file is sent to FastAPI backend's `/upload` endpoint.
3. Backend processes the PDF: extracts text, chunks it, generates embeddings, and stores them in a vector database.
4. User types a question in the chat interface (Chat component).
5. Frontend sends the question to the `/ask` endpoint.
6. Backend retrieves relevant content using the vector store and generates an answer via Gemini LLM.
7. The answer is returned to the frontend and displayed in the chat.

---
