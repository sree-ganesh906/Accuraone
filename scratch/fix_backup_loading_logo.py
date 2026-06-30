with open('AccuraOne _ High-End Business Consultancy.html', 'r', encoding='utf-8') as f:
    content = f.read()

# Replace version
content = content.replace('loading_logo_v2.png?v=3', 'loading_logo_v2.png?v=4')

with open('AccuraOne _ High-End Business Consultancy.html', 'w', encoding='utf-8') as f:
    f.write(content)

print("Updated AccuraOne _ High-End Business Consultancy.html successfully!")
