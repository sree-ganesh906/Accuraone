import cv2
import numpy as np

img = cv2.imread(r'C:\Users\bem\.gemini\antigravity-ide\brain\572b0bea-2cac-4018-aef0-4f2f14243813\media__1782754342724.jpg')
h, w, c = img.shape
print("Original uploaded image shape:", img.shape)

# Define ROI
roi_x_min, roi_x_max = 670, 760
roi_y_min, roi_y_max = 910, 1010

# Let's count how many pixels are bright in the original image in the ROI
mask_count = 0
for y in range(roi_y_min, roi_y_max):
    for x in range(roi_x_min, roi_x_max):
        pixel_val = img[y, x]
        gray_val = 0.299 * pixel_val[2] + 0.587 * pixel_val[1] + 0.114 * pixel_val[0]
        if gray_val > 90:
            mask_count += 1
print("Mask pixels > 90 in ROI in original image:", mask_count)

# Let's find the exact bounding box of bright pixels (gray_val > 80) in the bottom-right corner of the original image
bright_pixels = []
for y in range(h - 120, h):
    for x in range(w - 120, w):
        pixel_val = img[y, x]
        gray_val = 0.299 * pixel_val[2] + 0.587 * pixel_val[1] + 0.114 * pixel_val[0]
        if gray_val > 80 and y < h - 10 and x < w - 10: # avoid any border effects if any
            bright_pixels.append((x, y, gray_val))

if len(bright_pixels) > 0:
    xs = [p[0] for p in bright_pixels]
    ys = [p[1] for p in bright_pixels]
    print(f"Original bright pixels bounding box: X=[{min(xs)}, {max(xs)}], Y=[{min(ys)}, {max(ys)}]")
    print(f"Total bright pixels in corner: {len(bright_pixels)}")
