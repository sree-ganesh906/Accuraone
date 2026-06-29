import cv2
import numpy as np

# Load the image
img = cv2.imread('saudi_aramco_logo.jpg')
h, w, c = img.shape
print("Image shape:", img.shape)

# Let's count pixels that are close to white. 
# We'll calculate distance to white (255, 255, 255)
dist_to_white = np.linalg.norm(img - [255, 255, 255], axis=2)
print("Max distance to white:", np.max(dist_to_white))
print("Min distance to white:", np.min(dist_to_white))

# Let's count how many pixels are within distance 50 of white
close_to_white = dist_to_white < 50
print("Pixels close to white (<50):", np.sum(close_to_white))
print("Total pixels:", h * w)
