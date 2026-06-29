import os
import re

html_files = [f for f in os.listdir('.') if f.endswith('.html')]
logo_extensions = ['.png', '.jpg', '.jpeg', '.gif', '.svg']

for html in html_files:
    print(f"\n--- Usages in {html} ---")
    with open(html, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Find all image src values or background-image styles containing "logo"
    srcs = re.findall(r'src=["\']([^"\']*)["\']', content)
    for src in srcs:
        if 'logo' in src.lower():
            print(f"  Image src: {src}")
            
    # Find inline styles with background-image
    bg_images = re.findall(r'background-image:\s*url\(["\']?([^"\')]*)\)?', content)
    for bg in bg_images:
        if 'logo' in bg.lower():
            print(f"  Bg image: {bg}")

    # Find JavaScript references to logo files
    js_refs = re.findall(r'["\']([^"\']*\.png[^"\']*)["\']', content)
    for ref in js_refs:
        if 'logo' in ref.lower():
            print(f"  JS ref: {ref}")
