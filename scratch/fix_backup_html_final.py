with open('AccuraOne _ High-End Business Consultancy.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace versions
content = content.replace('white_text_logo.png?v=4', 'white_text_logo.png?v=5')
content = content.replace('white_logo.png?v=4', 'white_logo.png?v=5')

with open('AccuraOne _ High-End Business Consultancy.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AccuraOne _ High-End Business Consultancy.html successfully!")
