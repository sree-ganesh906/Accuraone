import cv2
import numpy as np

img = cv2.imread('ceo_cropped.jpg')
h, w, c = img.shape

# Define ROI
roi_x_min, roi_x_max = 676, 750
roi_y_min, roi_y_max = 920, 1000

# Let's see pixel values in a small subgrid of the watermark area
# to find out what color it actually is
crop = img[955:965, 710:720]
print("Watermark crop pixel values (BGR):")
for r in range(crop.shape[0]):
    row = [list(crop[r, c]) for c in range(crop.shape[1])]
    print(f"row {r}:", row)

# Let's calculate gray values in the ROI
mask_count = 0
for y in range(roi_y_min, roi_y_max):
    for x in range(roi_x_min, roi_x_max):
        pixel_val = img[y, x]
        gray_val = 0.299 * pixel_val[2] + 0.587 * pixel_val[1] + 0.114 * pixel_val[0]
        if gray_val > 90:
            mask_count += 1
print("Mask pixels > 90 in ROI:", mask_count)
