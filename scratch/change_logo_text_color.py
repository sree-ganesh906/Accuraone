import cv2
import numpy as np

# Load white_text_logo.png
img = cv2.imread('white_text_logo.png', cv2.IMREAD_UNCHANGED)
h, w, c = img.shape
print(f"Shape: {img.shape}")

# Find black-ish pixels
# If the image has 4 channels
if c == 4:
    rgb = img[:, :, :3]
    alpha = img[:, :, 3]
    
    # Distance to black [0, 0, 0]
    dist_to_black = np.linalg.norm(rgb - [0, 0, 0], axis=2)
    
    # Mask of non-transparent black-ish pixels
    black_mask = (dist_to_black < 120) & (alpha > 30)
    
    print(f"Total non-transparent pixels: {np.sum(alpha > 30)}")
    print(f"Detected black text pixels: {np.sum(black_mask)}")
    
    # Create copy and change detected pixels to white
    img_fixed = img.copy()
    img_fixed[black_mask, :3] = [255, 255, 255]
    
    # Let's save the result to test it
    cv2.imwrite('scratch/white_text_logo_test.png', img_fixed)
    print("Saved scratch/white_text_logo_test.png")
else:
    print("Image does not have 4 channels")
