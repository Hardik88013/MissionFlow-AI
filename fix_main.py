with open("backend/app/main.py", "r") as f:
    content = f.read()

import_statement = """
from fastapi import Request, status
from fastapi.responses import JSONResponse
import traceback
"""

handler = """
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    print("GLOBAL ERROR:", exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": str(exc), "traceback": traceback.format_exc()}
    )
"""

if "global_exception_handler" not in content:
    content = content.replace("app = FastAPI(", import_statement + "\napp = FastAPI(")
    content = content.replace("app.include_router(routes_router)", "app.include_router(routes_router)\n" + handler)
    with open("backend/app/main.py", "w") as f:
        f.write(content)
print("Done")
