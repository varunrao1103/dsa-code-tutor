import google.generativeai as genai
import os
from dotenv import load_dotenv

load_dotenv()
api_key = os.getenv("gemini_api_key")
genai.configure(api_key=api_key)

def extract_hints(response_text):
    hints = []
    for level in range(1, 4):
        marker = f"**Level {level} Hint**:"
        if marker in response_text:
            start = response_text.index(marker) + len(marker)
            end = response_text.find("**Level", start)
            hint = response_text[start:end].strip() if end != -1 else response_text[start:].strip()
            hints.append(hint)
    return hints

def get_full_feedback_with_hints(question, user_code):
    prompt = f"""
    You are an AI tutor specializing in coding interviews and competitive programming. 
    Your job is to analyze the user's **question and code** to provide feedback.

    ### Evaluation Steps:
    1. Understand the problem and user code.
    2. If correct and optimal:
       - Appreciate.
       - Give time complexity.
       - Do NOT include hints.
    3. If incorrect or suboptimal:
       - Provide 3 levels of hints but don't provide direct code:
         - **Level 1 Hint**: General guidance.
         - **Level 2 Hint**: Specific direction.
         - **Level 3 Hint**: Nearly correct approach.
    Note - optimal solution means, the solution which is accepted by leetcode for that particular solution.

    ### Problem Statement:
    {question}

    ### User Code:
    ```python
    {user_code}
    ```

    ### Final Response Format:
    Only include:
    - Appreciation (if valid)
    - Then: **Level 1 Hint**: ..., **Level 2 Hint**: ..., etc. (if needed)
    - DO NOT include full solution.
    """

    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    response = model.generate_content(prompt)
    return response.text

def get_optimal_solution(question):
    prompt = f"""
    You are an AI coding tutor. The user has seen all hints but now requests the **optimal solution**.

    ### Problem Statement:
    {question}

    ### Task:
    - Provide the most efficient solution in Python.
    - Explain the logic in a concise and clear way.
    - Include time and space complexity.
    - Do not use markdown (no triple backticks or headers).
    """

    model = genai.GenerativeModel("gemini-1.5-pro-latest")
    response = model.generate_content(prompt)
    return response.text
