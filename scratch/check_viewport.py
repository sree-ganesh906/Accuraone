with open('styles.css', 'r', encoding='utf-8') as f:
    css_content = f.read()

# Let's find occurrences of width: ...px or min-width: ...px that could be causing fixed layouts
import re
fixed_widths = re.findall(r'(\.[a-zA-Z0-9_\-\s,\.\#\:]+\{[^\{]*width:\s*\d+px;[^\{]*\})', css_content)
print("--- Fixed width definitions in CSS ---")
for w in fixed_widths[:20]:
    print(w.strip())

# Let's search for Flex/Grid styles without wrap
flex_without_wrap = re.findall(r'(\.[a-zA-Z0-9_\-\s,\.\#\:]+\{[^\{]*display:\s*flex;[^\{]*\})', css_content)
print("\n--- Flexbox definitions ---")
for f_box in flex_without_wrap[:15]:
    # Check if flex-wrap is defined
    if 'flex-wrap' not in f_box:
        print("No wrap:", f_box.strip())
