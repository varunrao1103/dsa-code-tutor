from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage, AIMessage
from dotenv import load_dotenv
import os

from backend.schemas import UserRequest, LLMResponse

load_dotenv()

llm = ChatGroq(
    model="llama-3.3-70b-versatile",
    temperature=0,
    api_key=os.getenv("GROQ_API_KEY"),
)

structured_llm = llm.with_structured_output(LLMResponse, method="json_mode")

_SYSTEM_PROMPT = """You are an expert DSA (Data Structures & Algorithms) tutor helping users solve coding interview problems.

Guidelines:
- Help users understand DSA concepts through guided, Socratic teaching.
- Explain mistakes clearly and constructively.
- When asked for hints, give progressive guidance — do NOT jump straight to the full solution.
- When explicitly asked for a solution, provide clean, well-commented code.
- Always provide complexity analysis (time and space) when relevant.

Response fields:
- `response`: Always fill this with a conversational, helpful reply.
- `code_suggestion`: Provide code here when correcting, hinting with code, or giving a full solution.
- `explanation`: Use for step-by-step breakdowns of an approach or algorithm.
- `user_misunderstanding`: Flag any conceptual errors the user seems to have (keep it constructive).

Always respond in valid JSON using the required response fields."""


def generate_dsa_response(user_request: UserRequest) -> LLMResponse:
    messages = [SystemMessage(content=_SYSTEM_PROMPT)]

    # Reconstruct prior conversation turns as actual LangChain messages
    # so the LLM receives full conversational context, not a text dump.
    if user_request.llm_history:
        for entry in user_request.llm_history:
            role = entry.get("role", "")
            content = entry.get("content", "")
            if role == "user":
                messages.append(HumanMessage(content=content))
            elif role == "assistant":
                messages.append(AIMessage(content=content))

    # Current user turn
    messages.append(
        HumanMessage(
            content=(
                f"Problem:\n{user_request.question}\n\n"
                f"My current code:\n```\n{user_request.current_code}\n```\n\n"
                f"My question / request:\n{user_request.prompt or 'Please review my code and help me.'}"
            )
        )
    )

    return structured_llm.invoke(messages)
