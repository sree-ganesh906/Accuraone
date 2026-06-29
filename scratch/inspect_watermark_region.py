import cv2
import numpy as np

img = cv2.imread('ceo_cropped.jpg')
h, w, c = img.shape
print(f"Image dimensions: {w}x{h}")

# Let's inspect the bottom right area (e.g. last 100 pixels in X and last 100 pixels in Y)
# We can find pixels that are significantly brighter than their local neighbors
# or check where the watermark is.
# Let's print out the brightest pixels in the bottom right 100x100 corner
corner = img[h-100:h, w-100:w]
gray = cv2.cvtColor(corner, cv2.COLOR_BGR2GRAY)

# Find coordinates where gray is relatively bright (e.g. > 100)
# since the jacket is very dark (usually gray < 50)
bright_pixels = np.argwhere(gray > 100)
print("Number of bright pixels (>100) in the 100x100 corner:", len(bright_pixels))
if len(bright_pixels) > 0:
    min_y = np.min(bright_pixels[:, 0]) + (h - 100)
    max_y = np.max(bright_pixels[:, 0]) + (h - 100)
    min_x = np.min(bright_pixels[:, 1]) + (w - 100)
    max_x = np.max(bright_pixels[:, 1]) + (w - 100)
    print(f"Bounding box of bright pixels: X=[{min_x}, {max_x}], Y=[{min_y}, {max_y}]")
