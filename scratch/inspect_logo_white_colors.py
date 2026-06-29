import cv2
import numpy as np

img = cv2.imread('logo_white.png', cv2.IMREAD_UNCHANGED)
pixels = img[:, :, :3].reshape(-1, 3)
unique_colors, color_counts = np.unique(pixels, axis=0, return_counts=True)
print("Unique colors in the entire logo_white.png:")
sorted_idx = np.argsort(-color_counts)
for idx in sorted_idx[:15]:
    print(f"  Color {unique_colors[idx]}: {color_counts[idx]} pixels")
