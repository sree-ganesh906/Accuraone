import os
import cv2
import numpy as np

target_dirs = ['extracted_logos', 'extracted_logos_high']

for d in target_dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if f.lower().endswith(('.png', '.jpg', '.jpeg')) and not f.endswith('.bak'):
            filepath = os.path.join(d, f)
            img = cv2.imread(filepath, cv2.IMREAD_UNCHANGED)
            if img is None:
                continue
            
            # Check if image has alpha
            h, w = img.shape[:2]
            if img.shape[2] == 4:
                rgb = img[:, :, :3]
                alpha = img[:, :, 3]
                max_val = np.max(rgb, axis=2)
                min_val = np.min(rgb, axis=2)
                diff = max_val - min_val
                
                # Mask for bright gray/white pixels (diff < 15 and max_val > 180)
                bg_mask = (diff < 15) & (max_val > 180)
                
                img[bg_mask, :3] = [255, 255, 255]
                img[bg_mask, 3] = 255
                
                # Also make transparent pixels white
                trans_mask = alpha < 200
                img[trans_mask, :3] = [255, 255, 255]
                img[trans_mask, 3] = 255
            else:
                max_val = np.max(img, axis=2)
                min_val = np.min(img, axis=2)
                diff = max_val - min_val
                bg_mask = (diff < 15) & (max_val > 180)
                img[bg_mask] = [255, 255, 255]
                
            cv2.imwrite(filepath, img)
            print(f"Fixed {filepath}")
