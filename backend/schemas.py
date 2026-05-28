from typing import Optional, List

from pydantic import BaseModel, Field


class UserRequest(BaseModel):
    userId: str = Field(description="User ID")
    question: str = Field(description="DSA problem statement")
    current_code: str = Field(description="Current user code")
    prompt: Optional[str] = Field(default=None, description="User's chat message or custom instruction")
    previous_attempts: Optional[List[str]] = Field(default=None)
    llm_history: Optional[List[dict]] = Field(default=None)


class LLMResponse(BaseModel):
    response: str
    code_suggestion: Optional[str] = None
    user_misunderstanding: Optional[str] = None
    explanation: Optional[str] = None


class RunRequest(BaseModel):
    language: str
    code: str
