import os
import re

directories = [
    r"frontend/src/components/home",
    r"frontend/src/components/layout",
]

hardik_keywords = ['fleet', 'maintenance', 'command center', 'predict', 'alert', 'vehicle', 'home', 'about', 'sign in']
devraj_keywords = ['route', 'map', 'track', 'convoy', 'analytic', 'eta', 'defense', 'video', 'solution', 'contact']
aman_keywords = ['inventory', 'supplies', 'demand', 'warehouse', 'disaster', 'humanitarian', 'industrial', 'resource', 'product', 'demo', 'documentation']

def get_developer(context):
    context_lower = context.lower()
    if any(k in context_lower for k in devraj_keywords): return "Devraj"
    if any(k in context_lower for k in aman_keywords): return "Aman"
    if any(k in context_lower for k in hardik_keywords): return "Hardik"
    return None

def process_file(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    changed = False
    fallback_cycle = ["Hardik", "Devraj", "Aman"]
    fallback_idx = 0

    for i in range(len(lines)):
        if 'alert("This is development phase coming soon' in lines[i] or "alert('This is development phase coming soon" in lines[i]:
            start = max(0, i - 5)
            end = min(len(lines), i + 5)
            context = " ".join(lines[start:end])
            
            dev = get_developer(context)
            if not dev:
                dev = fallback_cycle[fallback_idx % 3]
                fallback_idx += 1
                
            # Replace the entire alert(...) call
            new_msg = f'alert("🚧 Module in Development\\\\n\\\\nThis feature is currently being built by: {dev}")'
            lines[i] = re.sub(r'alert\([\'"]This is development phase coming soon.*?[\'"]\)', new_msg, lines[i])
            changed = True

    if changed:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.writelines(lines)
        print(f"Updated alerts in {filepath}")

for d in directories:
    for root, dirs, files in os.walk(d):
        for file in files:
            if file.endswith(".tsx"):
                process_file(os.path.join(root, file))
