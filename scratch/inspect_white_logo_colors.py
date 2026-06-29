import cv2
import numpy as np

img = cv2.imread('white_logo.png', cv2.IMREAD_UNCHANGED)
h, w, c = img.shape
print(f"Shape: {img.shape}")

# Let's count the distribution of alpha channel values
alphas = img[:, :, 3]
unique_alphas, counts = np.unique(alphas, return_counts=True)
print("Unique alphas and counts:")
for a, count in zip(unique_alphas, counts):
    print(f"  Alpha {a}: {count} pixels")

# Let's inspect some pixels in the middle (where the logo should be)
middle = img[h//2 - 20:h//2 + 20, w//2 - 20:w//2 + 20]
# Print unique colors in BGR
pixels = middle[:, :, :3].reshape(-1, 3)
unique_colors, color_counts = np.unique(pixels, axis=0, return_counts=True)
print("\nUnique colors in the middle of white_logo.png:")
# Sort by count
sorted_idx = np.argsort(-color_counts)
for idx in sorted_idx[:10]:
    print(f"  Color {unique_colors[idx]}: {color_counts[idx]} pixels")
