# DSA Code Tutor

An AI-powered coding tutor for Data Structures & Algorithms. Paste a problem, write your solution, and get contextual hints or a full optimal solution — powered by Groq LLMs.

## Tech Stack

- **Frontend** — React 19, Vite, Tailwind CSS v4, Monaco Editor
- **Backend** — FastAPI, LangChain + LangGraph, Groq API
- **Code Execution** — Python 3 and Java run locally via subprocess

---

## Prerequisites

- Python 3.13+
- Node.js 18+
- Java (JDK) — required to run Java code submissions
- A [Groq API key](https://console.groq.com/)

---

## Setup

### 1. Clone the repo

```bash
git clone https://github.com/your-username/dsa-code-tutor.git
cd dsa-code-tutor
```

### 2. Create a `.env` file

Create a `.env` file in the project root:

```env
GROQ_API_KEY=your_groq_api_key_here
```

### 3. Set up the Python environment

```bash
python3 -m venv .venv
source .venv/bin/activate        # Windows: .venv\Scripts\activate
pip install -e .
```

### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

---

## Running the App

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend (FastAPI)

```bash
source .venv/bin/activate        # Windows: .venv\Scripts\activate
uvicorn backend.main:app --reload --port 8000
```

The API will be available at `http://localhost:8000`.

### Terminal 2 — Frontend (Vite dev server)

```bash
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.

> Vite proxies `/hints`, `/solution`, and `/run` to the backend automatically — no CORS issues.

---

## Project Structure

```
dsa-code-tutor/
├── backend/
│   ├── main.py        # FastAPI app — /hints, /solution, /run endpoints
│   ├── schemas.py     # Pydantic request/response models
│   └── tutor.py       # LangGraph agent logic
├── frontend/
│   └── src/
│       ├── App.jsx                  # Root layout (3-panel)
│       ├── api.js                   # Fetch wrappers for backend
│       ├── languages.js             # Supported languages config
│       └── components/
│           ├── CodeEditor.jsx       # Monaco editor wrapper
│           ├── HintsPanel.jsx       # Hints display
│           ├── LanguageSelector.jsx # Language pill toggle
│           ├── OutputPanel.jsx      # Terminal output display
│           ├── ProblemInput.jsx     # Problem statement textarea
│           └── SolutionPanel.jsx    # Solution + complexity display
├── util/                # Scratch/exploration scripts
├── pyproject.toml       # Python project & dependency config
└── .env                 # API keys (not committed)
```

---

## API Endpoints

| Method | Path | Description |
|--------|------|-------------|
| POST | `/hints` | Analyse user code and return hints |
| POST | `/solution` | Return optimal solution with explanation |
| POST | `/run` | Execute code (Python or Java) and return output |

---

## Supported Languages

| Language | Execution |
|----------|-----------|
| Python | `python3` subprocess |
| Java | `javac` + `java` subprocess |