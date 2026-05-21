import os
from PIL import Image
from collections import Counter

d = 'c:/Users/bem/Desktop/accu/extracted_images'
files = os.listdir(d)
colors = []

for f in files:
    if f.endswith('jpeg'):
        img = Image.open(os.path.join(d, f)).convert('RGB')
        img = img.resize((50, 50))
        colors.extend(img.getdata())

common = Counter(colors).most_common(10)
print('Most common RGB colors:')
for c, count in common:
    print(f'RGB{c} - Hex: #{c[0]:02x}{c[1]:02x}{c[2]:02x} - Count: {count}')
