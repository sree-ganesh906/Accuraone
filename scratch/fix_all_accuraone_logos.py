import cv2
import numpy as np
import shutil
import os

# Files to modify in-place
files_to_fix = [
    'white_text_logo.png',
    'white_text_logo_cropped.png',
    'loading_logo.png',
    'loading_logo_v2.png',
    'main_logo_v2.png'
]

# Function to convert black text in a logo to white
def make_text_white(src_path, dest_path):
    if not os.path.exists(src_path):
        print(f"Source file {src_path} does not exist.")
        return False
        
    img = cv2.imread(src_path, cv2.IMREAD_UNCHANGED)
    if img is None:
        print(f"Failed to read {src_path}")
        return False
        
    h, w, c = img.shape
    if c == 4:
        rgb = img[:, :, :3]
        alpha = img[:, :, 3]
        dist_to_black = np.linalg.norm(rgb - [0, 0, 0], axis=2)
        # Select non-transparent pixels close to black
        black_mask = (dist_to_black < 120) & (alpha > 30)
        
        # Change them to white
        fixed_img = img.copy()
        fixed_img[black_mask, :3] = [255, 255, 255]
        
        cv2.imwrite(dest_path, fixed_img)
        print(f"Processed {src_path} -> saved to {dest_path}. Transformed {np.sum(black_mask)} pixels.")
        return True
    else:
        print(f"Image {src_path} does not have 4 channels.")
        return False

# 1. Backup and update in-place files
for f in files_to_fix:
    backup_path = f + '.bak'
    if os.path.exists(f) and not os.path.exists(backup_path):
        shutil.copyfile(f, backup_path)
    make_text_white(f, f)

# 2. Update white_logo.png using white_text_logo.png (with text converted to white)
if os.path.exists('white_logo.png'):
    shutil.copyfile('white_logo.png', 'white_logo.png.bak')
make_text_white('white_text_logo.png', 'white_logo.png')

# 3. Update logo_white.png using logo.png (with text converted to white)
if os.path.exists('logo_white.png'):
    shutil.copyfile('logo_white.png', 'logo_white.png.bak')
make_text_white('logo.png', 'logo_white.png')

print("All AccuraOne logos processed successfully!")
