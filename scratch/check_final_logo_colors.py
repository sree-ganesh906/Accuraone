import cv2
import numpy as np

for logo in ['white_logo.png', 'logo_white.png', 'loading_logo_v2.png']:
    img = cv2.imread(logo, cv2.IMREAD_UNCHANGED)
    if img is not None and img.shape[2] == 4:
        alpha = img[:, :, 3]
        rgb = img[:, :, :3]
        
        # Calculate how many black pixels (<50) and white pixels (>200) there are
        non_trans = rgb[alpha > 50]
        black_count = np.sum(np.all(non_trans < 50, axis=1))
        white_count = np.sum(np.all(non_trans > 200, axis=1))
        
        print(f"File: {logo}")
        print(f"  Total non-transparent: {len(non_trans)}")
        print(f"  Black pixels: {black_count}")
        print(f"  White pixels: {white_count}")
    else:
        print(f"File: {logo} | Failed to read or wrong channels")
