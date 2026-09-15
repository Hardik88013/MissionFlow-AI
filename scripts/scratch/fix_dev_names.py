import os
import re

directories = [
    r"d:\MissionFlowAi\frontend\src\components\home",
    r"d:\MissionFlowAi\frontend\src\components\layout",
]

hardik_keywords = ["fleet", "vehicle", "alert", "maintenance", "health", "command center", "defense", "disaster"]
devraj_keywords = ["route", "analytic", "live map", "map", "convoy", "eta", "optimiz", "track", "network"]
aman_keywords = ["supplies", "inventory", "warehouse", "demand", "forecast", "data", "logistics"]

def determine_developer(tag_text):
    text_lower = tag_text.lower()
    for kw in devraj_keywords:
        if kw in text_lower: return "Devraj"
    for kw in aman_keywords:
        if kw in text_lower: return "Aman"
    for kw in hardik_keywords:
        if kw in text_lower: return "Hardik"
    # Default fallback
    if "demo" in text_lower or "signin" in text_lower or "sign in" in text_lower or "platform" in text_lower or "video" in text_lower:
        return "Hardik (Integration)"
    return "Hardik"

def replace_alert(match):
    tag = match.group(0)
    # The current string in the tag is 'This is development phase coming soon - Developer: Hardik'
    # We want to replace Hardik with the proper developer.
    # We can extract the visible text of the tag using regex
    text_match = re.search(r'>([^<]+)<', tag)
    if text_match:
        tag_text = text_match.group(1).strip()
    else:
        tag_text = tag

    dev_name = determine_developer(tag_text)
    
    new_tag = re.sub(r'Developer: Hardik(\s*\(Integration\))?', f'Developer: {dev_name}', tag)
    return new_tag

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern for <button ... > ... </button> or <a ... > ... </a> or <Button ... > ... </Button>
    pattern = re.compile(r'<(button|Button|a)\b[^>]*>.*?</\1>', re.IGNORECASE | re.DOTALL)
    
    new_content = pattern.sub(replace_alert, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated developer names in {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".tsx"):
                process_file(os.path.join(root, file))
