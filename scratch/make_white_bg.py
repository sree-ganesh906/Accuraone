import cv2
import numpy as np
import shutil

# Backup original image
shutil.copyfile('saudi_aramco_logo.jpg', 'scratch/saudi_aramco_logo_orig.jpg')

# Load the image
img = cv2.imread('saudi_aramco_logo.jpg')

# Let's convert to RGB/BGR distance to white
# Pure white is [255, 255, 255]
# Let's find all pixels where distance to white is less than 60
dist_to_white = np.linalg.norm(img - [255, 255, 255], axis=2)

# Create mask of near-white pixels
mask = dist_to_white < 60

# Set these pixels to pure white
img[mask] = [255, 255, 255]

# Save the updated image
cv2.imwrite('saudi_aramco_logo.jpg', img)
print("Updated saudi_aramco_logo.jpg successfully!")
