import os
import re

directories = [
    r"d:\MissionFlowAi\frontend\src\components\home",
    r"d:\MissionFlowAi\frontend\src\components\layout",
]

# regex to find <button or <Button or <a without onClick
# It's tricky to do reliably with regex across multiple lines.
# But most of these tags in this codebase are written cleanly.

def add_alert_to_tag(match):
    tag = match.group(0)
    # If it already has onClick, skip
    if "onClick" in tag:
        return tag
    
    # We inject onClick right after the tag name
    if tag.startswith("<button"):
        return tag.replace("<button", "<button onClick={(e) => { e.preventDefault(); alert('This is development phase coming soon - Developer: Hardik'); }}", 1)
    elif tag.startswith("<Button"):
        return tag.replace("<Button", "<Button onClick={(e) => { e.preventDefault(); alert('This is development phase coming soon - Developer: Hardik'); }}", 1)
    elif tag.startswith("<a"):
        # We only want to add it to anchor tags that have href="#" or href="#something" (same page link) or no href
        if 'href="/"' in tag or 'href="/' in tag and not 'href="/#' in tag:
            return tag # probably a real link
        return tag.replace("<a", "<a onClick={(e) => { e.preventDefault(); alert('This is development phase coming soon - Developer: Hardik'); }}", 1)
    
    return tag

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Pattern for <button ... >
    # This might match the opening tag until the >
    pattern = re.compile(r'<(button|Button|a)\b[^>]*>', re.IGNORECASE | re.DOTALL)
    
    new_content = pattern.sub(add_alert_to_tag, content)
    
    if new_content != content:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(new_content)
        print(f"Updated {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".tsx"):
                process_file(os.path.join(root, file))
