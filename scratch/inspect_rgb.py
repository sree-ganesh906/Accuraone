import cv2
import numpy as np

for logo in ['logo_white.png', 'white_logo.png', 'white_text_logo.png']:
    img = cv2.imread(logo, cv2.IMREAD_UNCHANGED)
    if img is not None and img.shape[2] == 4:
        alpha = img[:, :, 3]
        non_trans = img[alpha > 100]
        print(f"File: {logo}")
        # Print first 10 non-transparent pixel BGR values
        print("  Sample values:", [list(p[:3]) for p in non_trans[:10]])
        # Print min/max values of each channel
        print("  Min values:", np.min(non_trans[:, :3], axis=0))
        print("  Max values:", np.max(non_trans[:, :3], axis=0))
