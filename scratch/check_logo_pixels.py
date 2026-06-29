import cv2
import numpy as np
import os

logos = [
    'logo.png',
    'logo_cropped.png',
    'logo_icon.png',
    'logo_icon_white.png',
    'logo_white.png',
    'white_logo.png',
    'white_text_logo.png',
    'white_text_logo_cropped.png',
    'loading_logo.png',
    'loading_logo_v2.png',
    'main_logo_v2.png'
]

for logo in logos:
    if os.path.exists(logo):
        img = cv2.imread(logo, cv2.IMREAD_UNCHANGED)
        h, w = img.shape[:2]
        channels = img.shape[2]
        print(f"File: {logo} | Shape: {img.shape}")
        
        # Check transparency/alpha channel
        if channels == 4:
            alpha = img[:, :, 3]
            # Find non-transparent pixels (alpha > 50)
            non_trans = img[alpha > 50]
            # Find how many dark pixels (R, G, B < 50) are there
            dark_pixels = np.sum(np.all(non_trans[:, :3] < 50, axis=1))
            # Find how many white pixels (R, G, B > 200) are there
            white_pixels = np.sum(np.all(non_trans[:, :3] > 200, axis=1))
            print(f"  Alpha channel: Yes | Non-transparent pixels: {len(non_trans)}")
            print(f"  Dark pixels (<50): {dark_pixels} | White pixels (>200): {white_pixels}")
        else:
            # Grayscale or RGB
            dark_pixels = np.sum(np.all(img < 50, axis=2))
            white_pixels = np.sum(np.all(img > 200, axis=2))
            print(f"  Alpha channel: No")
            print(f"  Dark pixels (<50): {dark_pixels} | White pixels (>200): {white_pixels}")
    else:
        print(f"File: {logo} | Does not exist")
