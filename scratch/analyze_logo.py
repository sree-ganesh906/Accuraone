from PIL import Image
import numpy as np

img = Image.open("c:/Users/bem/Desktop/accu/hero_glass_bg_new.png")
arr = np.array(img)

# Find pixels with high purple color
# Purple has high R and B, low G
r = arr[:, :, 0].astype(float)
g = arr[:, :, 1].astype(float)
b = arr[:, :, 2].astype(float)

# Select pixels where red and blue are high, and green is relatively low
# Specifically, we want the bright purple logo
mask = (r > 100) & (b > 100) & (g < 120) & (abs(r - b) < 60)

coords = np.argwhere(mask)
if len(coords) > 0:
    min_y, min_x = coords.min(axis=0)[:2]
    max_y, max_x = coords.max(axis=0)[:2]
    center_y = (min_y + max_y) / 2
    center_x = (min_x + max_x) / 2
    print(f"Purple logo bounds: X={min_x}..{max_x}, Y={min_y}..{max_y}")
    print(f"Purple logo center: X={center_x}, Y={center_y}")
else:
    print("Purple logo not found with basic threshold, trying wider search...")
