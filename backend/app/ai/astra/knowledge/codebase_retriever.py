from pathlib import Path
from typing import List, Dict
import re


KNOWLEDGE_FILE = (
    Path(__file__).resolve().parent /
    "missionflow_codebase.txt"
)


def _load_knowledge() -> str:
    if not KNOWLEDGE_FILE.exists():
        return ""

    return KNOWLEDGE_FILE.read_text(
        encoding="utf-8",
        errors="ignore"
    )


def _score_chunk(query: str, chunk: str) -> int:
    query_words = set(
        re.findall(r"[a-zA-Z0-9_]+", query.lower())
    )

    chunk_words = set(
        re.findall(r"[a-zA-Z0-9_]+", chunk.lower())
    )

    if not query_words or not chunk_words:
        return 0

    score = len(query_words.intersection(chunk_words))

    important_terms = [
        "eta",
        "route",
        "routing",
        "fleet",
        "vehicle",
        "delivery",
        "dashboard",
        "prediction",
        "optimization",
        "websocket",
        "fastapi",
        "react",
        "astra",
        "missionflow",
        "ml",
        "model",
        "api",
    ]

    query_lower = query.lower()
    chunk_lower = chunk.lower()

    for term in important_terms:
        if term in query_lower and term in chunk_lower:
            score += 3

    return score


def search_codebase(
    query: str,
    max_results: int = 5,
    chunk_size: int = 7000,
) -> List[Dict[str, str]]:

    knowledge = _load_knowledge()

    if not knowledge:
        return []

    sections = re.split(
        r"\n={20,}\n",
        knowledge
    )

    results = []

    for section in sections:
        section = section.strip()

        if not section:
            continue

        score = _score_chunk(query, section)

        if score <= 0:
            continue

        lines = section.splitlines()

        file_name = "MissionFlow source"

        for line in lines[:10]:
            if line.startswith("FILE:"):
                file_name = line.replace(
                    "FILE:",
                    ""
                ).strip()
                break

        if len(section) > chunk_size:
            section = section[:chunk_size]

        results.append(
            {
                "file": file_name,
                "score": str(score),
                "content": section,
            }
        )

    results.sort(
        key=lambda item: int(item["score"]),
        reverse=True,
    )

    return results[:max_results]


def get_codebase_context(
    query: str,
    max_results: int = 5,
) -> str:

    results = search_codebase(
        query,
        max_results=max_results,
    )

    if not results:
        return "No matching MissionFlow source context was found."

    output = []

    for index, result in enumerate(results, start=1):

        output.append(
            f"""
--- SOURCE {index} ---
FILE: {result["file"]}
RELEVANCE SCORE: {result["score"]}

{result["content"]}
"""
        )

    return "\n".join(output)
