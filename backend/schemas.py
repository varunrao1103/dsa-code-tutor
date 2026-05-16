from typing import Optional

from pydantic import BaseModel


class HintsRequest(BaseModel):
    question: str
    user_code: str


class SolutionRequest(BaseModel):
    question: str


class RunRequest(BaseModel):
    language: str
    code: str
