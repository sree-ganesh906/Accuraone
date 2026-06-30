import cv2
import numpy as np

files = [
    'white_text_logo.png',
    'white_logo.png',
    'logo_white.png',
    'loading_logo_v2.png'
]

for f in files:
    img = cv2.imread(f, cv2.IMREAD_UNCHANGED)
    if img is not None and img.shape[2] == 4:
        alpha = img[:, :, 3]
        rgb = img[:, :, :3]
        non_trans = rgb[alpha > 50]
        black_count = np.sum(np.all(non_trans < 50, axis=1))
        white_count = np.sum(np.all(non_trans > 200, axis=1))
        print(f"File: {f}")
        print(f"  Black pixels: {black_count} | White pixels: {white_count}")
    else:
        print(f"File: {f} | Error reading")
