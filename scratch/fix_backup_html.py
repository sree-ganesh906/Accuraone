with open('AccuraOne _ High-End Business Consultancy.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace loading logo
content = content.replace('src="loading_logo_v2.png"', 'src="loading_logo_v2.png?v=3"')
# Replace white_text_logo.png?v=3 (which is used in header/footer/particle in this file)
content = content.replace('white_text_logo.png?v=3', 'white_text_logo.png?v=4')
# Replace logo_white.png in about us section
content = content.replace('src="logo_white.png"', 'src="logo_white.png?v=2"')

with open('AccuraOne _ High-End Business Consultancy.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AccuraOne _ High-End Business Consultancy.html successfully!")
