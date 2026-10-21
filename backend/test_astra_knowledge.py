import sys
from pathlib import Path

PROJECT_ROOT = Path(__file__).resolve().parent.parent

if str(PROJECT_ROOT) not in sys.path:
    sys.path.insert(0, str(PROJECT_ROOT))

from backend.app.ai.astra.knowledge.codebase_retriever import (
    get_codebase_context
)

print(
    get_codebase_context(
        "ETA prediction and fleet tracking",
        max_results=3,
    )
)
