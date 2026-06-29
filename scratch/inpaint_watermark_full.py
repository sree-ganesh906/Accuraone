import cv2
import numpy as np
import shutil

# Start fresh by copying the original uploaded image
orig_path = r'C:\Users\bem\.gemini\antigravity-ide\brain\572b0bea-2cac-4018-aef0-4f2f14243813\media__1782754342724.jpg'
dest_path = 'ceo_cropped.jpg'
shutil.copyfile(orig_path, dest_path)
print("Copied original image to ceo_cropped.jpg")

# Load the image
img = cv2.imread(dest_path)
h, w, c = img.shape

# Create a mask of the same size (grayscale)
mask = np.zeros((h, w), dtype=np.uint8)

# Define the wider ROI for the watermark
roi_x_min, roi_x_max = 650, 760
roi_y_min, roi_y_max = 900, 1020

# Inside this region, find pixels that are brighter than 80
for y in range(roi_y_min, roi_y_max):
    for x in range(roi_x_min, roi_x_max):
        if y < h and x < w:
            pixel_val = img[y, x]
            # Check if the gray value is bright
            gray_val = 0.299 * pixel_val[2] + 0.587 * pixel_val[1] + 0.114 * pixel_val[0]
            if gray_val > 80:
                mask[y, x] = 255

# Dilate the mask slightly to cover the boundaries of the watermark
kernel = np.ones((7, 7), dtype=np.uint8)
mask = cv2.dilate(mask, kernel, iterations=1)

# Apply inpainting
# We'll use INPAINT_TELEA
result = cv2.inpaint(img, mask, inpaintRadius=9, flags=cv2.INPAINT_TELEA)

# Save the resulting image
cv2.imwrite(dest_path, result)
print("Inpainted watermark and saved ceo_cropped.jpg successfully!")
