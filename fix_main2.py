import re
with open("backend/app/main.py", "r") as f:
    content = f.read()

content = content.replace('allow_origins=["*"],', 'allow_origin_regex=r".*",')

with open("backend/app/main.py", "w") as f:
    f.write(content)
print("Done")
