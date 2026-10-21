import os
import glob

files = glob.glob('frontend/src/**/*.tsx', recursive=True)

def replace_alerts(text):
    new_text = ""
    idx = 0
    while idx < len(text):
        found = text.find('onClick={', idx)
        if found == -1:
            new_text += text[idx:]
            break
        new_text += text[idx:found]
        
        brace_count = 0
        end_idx = found + 8
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

for file_path in files:
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    new_content = replace_alerts(content)
    
    if new_content != content:
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(new_content)

print("Done")
