import cv2
import numpy as np

# Load the image
img = cv2.imread('ceo_cropped.jpg')
h, w, c = img.shape

# Create a mask of the same size (grayscale)
mask = np.zeros((h, w), dtype=np.uint8)

# Define the region of interest for the watermark
# X=[676, 750], Y=[920, 1000]
roi_x_min, roi_x_max = 676, 750
roi_y_min, roi_y_max = 920, 1000

# Inside this region, find pixels that are brighter than 90 (to capture the watermark gradient)
for y in range(roi_y_min, roi_y_max):
    for x in range(roi_x_min, roi_x_max):
        pixel_val = img[y, x]
        # Check if the gray value is bright
        gray_val = 0.299 * pixel_val[2] + 0.587 * pixel_val[1] + 0.114 * pixel_val[0]
        if gray_val > 90:
            mask[y, x] = 255

# Dilate the mask slightly to cover the boundaries of the watermark
kernel = np.ones((5, 5), dtype=np.uint8)
mask = cv2.dilate(mask, kernel, iterations=1)

# Apply inpainting
# We'll use INPAINT_TELEA which is excellent for general texture/pattern restoration
result = cv2.inpaint(img, mask, inpaintRadius=7, flags=cv2.INPAINT_TELEA)

# Save the resulting image
cv2.imwrite('ceo_cropped.jpg', result)
print("Inpainted watermark and saved ceo_cropped.jpg successfully!")
