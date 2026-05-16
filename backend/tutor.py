from typing import TypedDict, Optional, List
from pydantic import BaseModel

from langgraph.graph import StateGraph, END
from groq import Groq

from dotenv import load_dotenv
import os


load_dotenv()


client = Groq(
    api_key=os.getenv("GROQ_API_KEY")
)


# =====================================
# HELPERS
# =====================================

def _enforce_groq_strict_schema(schema: dict) -> dict:
    if isinstance(schema, dict):
        if schema.get("type") == "object" or "properties" in schema:
            schema["additionalProperties"] = False
            all_keys = list(schema.get("properties", {}).keys())
            if all_keys:
                schema["required"] = all_keys
        for value in schema.values():
            if isinstance(value, dict):
                _enforce_groq_strict_schema(value)
            elif isinstance(value, list):
                for item in value:
                    if isinstance(item, dict):
                        _enforce_groq_strict_schema(item)
    return schema


def pydantic_to_groq_schema(model: type[BaseModel]) -> dict:
    schema = model.model_json_schema()
    _enforce_groq_strict_schema(schema)
    return {
        "type": "json_schema",
        "json_schema": {
            "name": model.__name__,
            "strict": True,
            "schema": schema
        }
    }


# =====================================
# STRUCTURED OUTPUT SCHEMAS
# =====================================

class FeedbackSchema(BaseModel):
    appreciation: Optional[str] = None
    time_complexity: Optional[str] = None
    hints: List[str]

    model_config = {"extra": "forbid"}


class SolutionSchema(BaseModel):
    explanation: str
    code: str
    time_complexity: str
    space_complexity: str

    model_config = {"extra": "forbid"}


# =====================================
# STATE
# =====================================

class TutorState(TypedDict):
    question: str
    user_code: Optional[str]
    prompt: Optional[str]
    raw_response: Optional[str]
    feedback_output: Optional[dict]
    solution_output: Optional[dict]


# =====================================
# PROMPT NODES
# =====================================

def build_feedback_prompt(state: TutorState):
    prompt = f"""
You are an AI tutor specializing in coding interviews and competitive programming.

Your job is to analyze the user's question and code.

Evaluation Rules:

1. Understand the problem and user code.

2. If correct and optimal:
- Appreciate the solution
- Give time complexity
- Do NOT provide hints

3. If incorrect or suboptimal:
Provide exactly 3 levels of hints:
- Level 1 Hint: General guidance
- Level 2 Hint: More specific direction
- Level 3 Hint: Nearly complete approach

DO NOT provide full code solution.

Problem:
{state["question"]}

User Code:
```python
{state["user_code"]}
```
"""
    return {"prompt": prompt}


def build_solution_prompt(state: TutorState):
    prompt = f"""
You are an AI coding tutor.

The user has already seen all hints and now wants the optimal solution.

Problem:
{state["question"]}
"""
    return {"prompt": prompt}


# =====================================
# LLM NODES
# =====================================

def call_feedback_llm(state: TutorState):
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": state["prompt"]}],
        temperature=0.2,
        response_format=pydantic_to_groq_schema(FeedbackSchema)
    )
    content = response.choices[0].message.content
    validated = FeedbackSchema.model_validate_json(content)
    return {
        "raw_response": content,
        "feedback_output": validated.model_dump()
    }


def call_solution_llm(state: TutorState):
    response = client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[{"role": "user", "content": state["prompt"]}],
        temperature=0.2,
        response_format=pydantic_to_groq_schema(SolutionSchema)
    )
    content = response.choices[0].message.content
    validated = SolutionSchema.model_validate_json(content)
    return {
        "raw_response": content,
        "solution_output": validated.model_dump()
    }


# =====================================
# FEEDBACK GRAPH
# =====================================

feedback_builder = StateGraph(TutorState)
feedback_builder.add_node("build_feedback_prompt", build_feedback_prompt)
feedback_builder.add_node("call_feedback_llm", call_feedback_llm)
feedback_builder.set_entry_point("build_feedback_prompt")
feedback_builder.add_edge("build_feedback_prompt", "call_feedback_llm")
feedback_builder.add_edge("call_feedback_llm", END)
feedback_graph = feedback_builder.compile()


# =====================================
# SOLUTION GRAPH
# =====================================

solution_builder = StateGraph(TutorState)
solution_builder.add_node("build_solution_prompt", build_solution_prompt)
solution_builder.add_node("call_solution_llm", call_solution_llm)
solution_builder.set_entry_point("build_solution_prompt")
solution_builder.add_edge("build_solution_prompt", "call_solution_llm")
solution_builder.add_edge("call_solution_llm", END)
solution_graph = solution_builder.compile()


# =====================================
# PUBLIC FUNCTIONS
# =====================================

def get_full_feedback_with_hints(question: str, user_code: str) -> dict:
    result = feedback_graph.invoke({
        "question": question,
        "user_code": user_code
    })
    return result["feedback_output"]


def get_optimal_solution(question: str) -> dict:
    result = solution_graph.invoke({
        "question": question,
        "user_code": ""
    })
    return result["solution_output"]
