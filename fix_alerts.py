import os
import re

files = [
    "frontend/src/components/home/LiveMissionNetworkPreview.tsx",
    "frontend/src/components/home/ProductIntelligenceSection.tsx",
    "frontend/src/components/layout/Navbar.tsx",
    "frontend/src/components/layout/Footer.tsx"
]

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # The user says: "remove this name alert thing, it's useless. whatever functions Devraj built, show them."
    # Devraj built:
    # 1. Live Tracking -> /dashboard
    # 2. Route Optimization -> /dashboard/routes
    
    # We will replace all alerts with a simple navigation to /dashboard.
    # It's the best way to let users explore Devraj's features without hitting an alert block.
    
    # regex to match: onClick={(e) => { e.preventDefault(); alert("...Module in Development..."); }}
    # and onClick={() => alert("...")}
    # and onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); alert("..."); }}
    
    pattern = r'onClick=\{[^{}]*alert\([^)]+\)[^{}]*\}'
    
    def repl(m):
        match_str = m.group(0)
        if "setMobileMenuOpen(false)" in match_str:
            return 'onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.location.href = "/dashboard"; }}'
        return 'onClick={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}'
        
    content = re.sub(pattern, repl, content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done")
