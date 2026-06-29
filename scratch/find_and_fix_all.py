import os
import cv2
import numpy as np
import shutil

target_dirs = ['.', 'extracted_logos', 'extracted_logos_high', 'extracted_images']

# Let's define a function to remove checkerboard background from an image
def fix_image_background(filepath):
    img = cv2.imread(filepath, cv2.IMREAD_UNCHANGED)
    if img is None:
        return False
    
    # Backup
    backup_path = filepath + '.bak'
    if not os.path.exists(backup_path):
        shutil.copyfile(filepath, backup_path)
        
    h, w = img.shape[:2]
    
    # Check if there is an alpha channel
    has_alpha = False
    if img.shape[2] == 4:
        has_alpha = True
        # If it has alpha, some transparency checkerboards are baked into the RGB channels
        # behind transparent pixels, or the transparency itself is fine but the user sees checkerboard.
        # Let's inspect the RGB channels.
        rgb = img[:, :, :3]
        alpha = img[:, :, 3]
    else:
        rgb = img
        alpha = None
        
    # We want to find any pixel where:
    # 1. Channels R, G, B are close to each other (i.e. it's grayscale/white/gray)
    #    We can measure this by the difference between max and min channel value.
    # 2. The pixel is relatively bright (e.g., all channels > 180 or max channel > 180)
    # This matches white (255,255,255), light grays like (238,238,238), (204,204,204), (220,220,220), etc.
    
    max_val = np.max(rgb, axis=2)
    min_val = np.min(rgb, axis=2)
    diff = max_val - min_val
    
    # Mask for gray/white pixels (diff < 15 and max_val > 180)
    bg_mask = (diff < 15) & (max_val > 180)
    
    # Let's also include pixels close to white/gray in general
    # If the image has an alpha channel, we should also make sure any transparent pixels (alpha < 50)
    # have their RGB set to white, just in case the browser renders it on a dark/different background,
    # or if the browser doesn't handle transparency well. But wait, here the background of the card is white.
    
    # Let's count how many pixels match our background mask
    pct = np.sum(bg_mask) / (h * w) * 100
    
    if pct > 1.0: # If at least 1% of the image is this bright gray/white background
        # Let's set those pixels to pure white
        if has_alpha:
            # Set RGB to white for these pixels
            img[bg_mask, :3] = [255, 255, 255]
            # Optionally set alpha to 255 (fully opaque white) so it's fully white
            img[bg_mask, 3] = 255
            # Also for any transparent pixels, make their RGB white
            trans_mask = alpha < 200
            img[trans_mask, :3] = [255, 255, 255]
            img[trans_mask, 3] = 255
        else:
            img[bg_mask] = [255, 255, 255]
            
        cv2.imwrite(filepath, img)
        print(f"Fixed {filepath}: replaced {pct:.2f}% of pixels with white. Shape: {img.shape}")
        return True
    return False

# Scan and fix all images in the target directories
fixed_count = 0
for d in target_dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.endswith('.bak'):
            filepath = os.path.join(d, f)
            if fix_image_background(filepath):
                fixed_count += 1

print(f"Completed! Fixed background of {fixed_count} images.")
