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

    # The actual string might contain emoji 🚧 and newlines \n
    # We want to replace the whole onClick attribute
    # Find onClick={() => alert(...)} or onClick={(e) => { ... alert(...); }}
    
    # We can just look for `alert("` or `alert('` or ``alert(` ``
    # But let's be simpler: any `onClick={...}` that contains `alert(` and `Module in Development`
    
    # Let's do a more robust replacement using a while loop to find onClick=... up to the matching closing brace.
    def replace_alerts(text):
        new_text = ""
        idx = 0
        while idx < len(text):
            found = text.find('onClick={', idx)
            if found == -1:
                new_text += text[idx:]
                break
            new_text += text[idx:found]
            
            # Find the matching closing brace
            brace_count = 0
            end_idx = found + 8 # index of '{'
            for i in range(end_idx, len(text)):
                if text[i] == '{':
                    brace_count += 1
                elif text[i] == '}':
                    brace_count -= 1
                    if brace_count == 0:
                        end_idx = i
                        break
            
            onclick_content = text[found:end_idx+1]
            if "alert(" in onclick_content and "Module in Development" in onclick_content:
                if "setMobileMenuOpen" in onclick_content:
                    new_text += 'onClick={(e) => { e.preventDefault(); setMobileMenuOpen(false); window.location.href = "/dashboard"; }}'
                else:
                    new_text += 'onClick={(e) => { e.preventDefault(); window.location.href = "/dashboard"; }}'
            else:
                new_text += onclick_content
                
            idx = end_idx + 1
            
        return new_text

    new_content = replace_alerts(content)
    
    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(new_content)

print("Done")
