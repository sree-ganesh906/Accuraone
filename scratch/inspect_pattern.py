import cv2
import numpy as np

# Load original
img = cv2.imread('scratch/saudi_aramco_logo_orig.jpg')
h, w, c = img.shape
print("Original shape:", img.shape)

# Let's inspect a region, say top-left 50x50, to see the pixel values
for y in range(0, 50, 10):
    row_vals = []
    for x in range(0, 50, 10):
        row_vals.append(list(img[y, x]))
    print(f"y={y}:", row_vals)
