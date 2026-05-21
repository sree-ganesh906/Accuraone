from collections import Counter
import os
from PIL import Image

d = 'c:/Users/bem/Desktop/accu/extracted_images'
files = os.listdir(d)
colors = []

for f in files:
    if f.endswith('jpeg'):
        img = Image.open(os.path.join(d, f)).convert('RGB')
        img = img.resize((50, 50))
        colors.extend(img.getdata())

common = Counter(colors).most_common(200)
print('Accent colors:')
for c, count in common:
    r, g, b = c
    # filter out white/grey/black
    if abs(r - g) < 20 and abs(g - b) < 20:
        continue
    # filter out the main purple #6402b1 or similar
    if 50 < r < 120 and g < 40 and 130 < b <= 255:
        continue
    # filter out very dark colors
    if r < 40 and g < 40 and b < 40:
        continue
    print(f'RGB{c} - Hex: #{r:02x}{g:02x}{b:02x} - Count: {count}')
