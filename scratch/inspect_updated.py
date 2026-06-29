import cv2
import numpy as np

img = cv2.imread('saudi_aramco_logo.jpg')
print("Updated image shape:", img.shape)
for y in range(0, 50, 10):
    row_vals = []
    for x in range(0, 50, 10):
        row_vals.append(list(img[y, x]))
    print(f"y={y}:", row_vals)
