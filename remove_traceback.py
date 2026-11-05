import os
with open("backend/app/main.py", "r") as f:
    content = f.read()

content = content.replace(', "traceback": traceback.format_exc()', '')
content = content.replace('content={"detail": str(exc)}', 'content={"detail": "Internal Server Error"}')

with open("backend/app/main.py", "w") as f:
    f.write(content)
