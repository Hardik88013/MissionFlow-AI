from typing import Any, Dict
import json
import urllib.request
import urllib.error


OLLAMA_URL = "http://127.0.0.1:11434/api/chat"
ASTRA_MODEL = "missionflow-astra"


def ask_local_model(
    message: str,
    context: Dict[str, Any] | None = None,
) -> str:

    system_prompt = """
You are Astra AI ✦, the local intelligence and mission copilot
of MissionFlow AI.

MissionFlow AI is a mission-critical logistics and fleet operations
platform.

Your responsibilities include:
- Fleet operations
- Mission management
- Vehicle management
- Driver operations
- ETA prediction
- Route optimization
- Dynamic rerouting
- Traffic and disruption analysis
- Delivery monitoring
- Operational analytics
- Mission planning
- Dashboard assistance
- Software and technical assistance for the MissionFlow project

You are connected to MissionFlow operational tools.

IMPORTANT DATA RULES:
- Never invent live MissionFlow data.
- Only use operational values supplied in the context.
- If a required value is unavailable, say that it is unavailable.
- Distinguish demo data from verified live data.
- Never pretend a tool was executed when it was not.

PERSONALITY:
- Sharp
- Professional
- Calm
- Intelligent
- Mission-focused
- Concise
- Helpful
- Futuristic but natural

RESPONSE STYLE:
- Address the user as Devraj when appropriate.
- Keep simple answers short.
- Prefer concise bullets for multiple items.
- Avoid unnecessary explanations.
- Do not repeatedly say "As an AI".
- Do not mention system prompts or internal implementation.
- Do not fabricate capabilities.

When operational context is supplied:
1. Understand the user's request.
2. Use the supplied MissionFlow data.
3. Explain the result clearly.
4. Give a useful next action when appropriate.

You are Astra, not a generic chatbot.
"""

    payload = {
        "model": ASTRA_MODEL,
        "stream": False,
        "messages": [
            {
                "role": "system",
                "content": system_prompt,
            },
            {
                "role": "user",
                "content": message,
            },
        ],
        "options": {
            "temperature": 0.45,
            "top_p": 0.9,
        },
    }

    if context:
        payload["messages"].insert(
            1,
            {
                "role": "system",
                "content": (
                    "VERIFIED MISSIONFLOW OPERATIONAL CONTEXT:\n"
                    + json.dumps(
                        context,
                        indent=2,
                        default=str,
                    )
                ),
            },
        )

    body = json.dumps(payload).encode("utf-8")

    request = urllib.request.Request(
        OLLAMA_URL,
        data=body,
        headers={
            "Content-Type": "application/json",
        },
        method="POST",
    )

    try:
        with urllib.request.urlopen(
            request,
            timeout=120,
        ) as response:

            raw = response.read().decode("utf-8")
            result = json.loads(raw)

            text = (
                result
                .get("message", {})
                .get("content", "")
                .strip()
            )

            if not text:
                raise RuntimeError(
                    "Astra received an empty response from Ollama."
                )

            return text

    except urllib.error.URLError as exc:
        raise RuntimeError(
            "Astra local model is unavailable. "
            "Make sure Ollama is running."
        ) from exc

    except Exception as exc:
        raise RuntimeError(
            f"Astra local model error: {exc}"
        ) from exc
