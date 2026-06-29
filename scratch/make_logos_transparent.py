import cv2
import numpy as np
import shutil
import os

files_to_fix = ['white_logo.png', 'logo_white.png']

for filename in files_to_fix:
    if not os.path.exists(filename):
        print(f"{filename} does not exist")
        continue
        
    # Backup
    backup_name = filename + '.bak'
    if not os.path.exists(backup_name):
        shutil.copyfile(filename, backup_name)
        print(f"Backed up {filename} to {backup_name}")
        
    # Read image (with alpha channel if exists)
    img = cv2.imread(filename, cv2.IMREAD_UNCHANGED)
    h, w = img.shape[:2]
    
    # If the image doesn't have an alpha channel, add one
    if img.shape[2] == 3:
        # Create alpha channel of 255
        alpha = np.ones((h, w), dtype=np.uint8) * 255
        img = cv2.merge((img[:,:,0], img[:,:,1], img[:,:,2], alpha))
        
    # Find white pixels (R > 240, G > 240, B > 240)
    # img is BGR(A) format
    b, g, r, a = cv2.split(img)
    white_mask = (b > 240) & (g > 240) & (r > 240)
    
    # Set alpha to 0 for white pixels
    a[white_mask] = 0
    
    # Merge channels back
    fixed_img = cv2.merge((b, g, r, a))
    
    # Save the transparent image
    cv2.imwrite(filename, fixed_img)
    print(f"Made background of {filename} transparent! Masked {np.sum(white_mask)} pixels.")
