import os
import shutil
import subprocess
import tempfile

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from backend.schemas import HintsRequest, RunRequest, SolutionRequest
from backend.tutor import get_full_feedback_with_hints, get_optimal_solution

LEETCODE_GRAPHQL = "https://leetcode.com/graphql"
_LEETCODE_HEADERS = {
    "Content-Type": "application/json",
    "Referer": "https://leetcode.com",
}


app = FastAPI(title="DSA Code Tutor API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["GET", "POST"],
    allow_headers=["Content-Type", "Authorization"],
)



@app.get("/leetcode/problems")
def leetcode_problems(
    tag: str = Query(default="array"),
    skip: int = Query(default=0, ge=0),
    limit: int = Query(default=50, ge=1, le=100),
):
    """Proxy to LeetCode GraphQL — returns paginated problem list for a given tag."""
    body = {
        "query": (
            "query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {"
            "  problemsetQuestionList: questionList(categorySlug: $categorySlug, limit: $limit, skip: $skip, filters: $filters) {"
            "    totalNum"
            "    data { questionId title titleSlug difficulty }"
            "  }"
            "}"
        ),
        "variables": {
            "categorySlug": "",
            "skip": skip,
            "limit": limit,
            "filters": {"tags": [tag]} if tag else {},
        },
    }
    try:
        with httpx.Client(timeout=10) as client:
            resp = client.post(LEETCODE_GRAPHQL, json=body, headers=_LEETCODE_HEADERS)
        resp.raise_for_status()
        data = resp.json()
        return data.get("data", {}).get("problemsetQuestionList", {})
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="LeetCode API error")
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.get("/leetcode/problem/{title_slug}")
def leetcode_problem(title_slug: str):
    """Proxy to LeetCode GraphQL — returns HTML content and example test cases for a problem."""
    body = {
        "query": (
            "query questionContent($titleSlug: String!) {"
            "  question(titleSlug: $titleSlug) {"
            "    title"
            "    difficulty"
            "    content"
            "    exampleTestcases"
            "  }"
            "}"
        ),
        "variables": {"titleSlug": title_slug},
    }
    try:
        with httpx.Client(timeout=10) as client:
            resp = client.post(LEETCODE_GRAPHQL, json=body, headers=_LEETCODE_HEADERS)
        resp.raise_for_status()
        data = resp.json()
        question = data.get("data", {}).get("question")
        if not question:
            raise HTTPException(status_code=404, detail="Problem not found")
        return question
    except HTTPException:
        raise
    except httpx.HTTPStatusError as e:
        raise HTTPException(status_code=e.response.status_code, detail="LeetCode API error")
    except Exception as e:
        raise HTTPException(status_code=502, detail=str(e))


@app.post("/hints")
def hints(request: HintsRequest):
    """
    Analyse user code against the problem and return structured feedback.

    Response shape (FeedbackSchema):
        {
            "appreciation": str | null,
            "time_complexity": str | null,
            "hints": [str, ...]
        }
    """
    try:
        result = get_full_feedback_with_hints(request.question, request.user_code)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


@app.post("/solution")
def solution(request: SolutionRequest):
    """
    Return the optimal solution for the given problem.

    Response shape (SolutionSchema):
        {
            "explanation": str,
            "code": str,
            "time_complexity": str,
            "space_complexity": str
        }
    """
    try:
        result = get_optimal_solution(request.question)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    return result


_SUPPORTED_LANGUAGES = {'python', 'java'}


@app.post("/run")
def run_code(request: RunRequest):
    language = request.language.lower()
    if language not in _SUPPORTED_LANGUAGES:
        raise HTTPException(
            status_code=400,
            detail=f"Language '{language}' is not supported. Supported: python, java",
        )
    if language == 'python':
        return _run_python(request.code)
    return _run_java(request.code)


def _run_python(code: str) -> dict:
    with tempfile.NamedTemporaryFile(suffix='.py', mode='w', delete=False) as f:
        f.write(code)
        tmpfile = f.name
    try:
        result = subprocess.run(
            ['python3', tmpfile],
            capture_output=True,
            text=True,
            timeout=10,
        )
        return {'stdout': result.stdout, 'stderr': result.stderr, 'exit_code': result.returncode}
    except subprocess.TimeoutExpired:
        return {'stdout': '', 'stderr': 'Execution timed out (10s)', 'exit_code': -1}
    finally:
        os.unlink(tmpfile)


def _run_java(code: str) -> dict:
    tmpdir = tempfile.mkdtemp()
    src_file = os.path.join(tmpdir, 'Main.java')
    try:
        with open(src_file, 'w') as f:
            f.write(code)

        # Compile
        try:
            compile_result = subprocess.run(
                ['javac', 'Main.java'],
                capture_output=True,
                text=True,
                timeout=10,
                cwd=tmpdir,
            )
        except subprocess.TimeoutExpired:
            return {'stdout': '', 'stderr': 'Compilation timed out (10s)', 'exit_code': -1}

        if compile_result.returncode != 0:
            return {'stdout': '', 'stderr': compile_result.stderr, 'exit_code': compile_result.returncode}

        # Run
        try:
            run_result = subprocess.run(
                ['java', '-cp', tmpdir, 'Main'],
                capture_output=True,
                text=True,
                timeout=10,
            )
            return {'stdout': run_result.stdout, 'stderr': run_result.stderr, 'exit_code': run_result.returncode}
        except subprocess.TimeoutExpired:
            return {'stdout': '', 'stderr': 'Execution timed out (10s)', 'exit_code': -1}
    finally:
        shutil.rmtree(tmpdir, ignore_errors=True)
