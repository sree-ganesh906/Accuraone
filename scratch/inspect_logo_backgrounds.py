import cv2
import numpy as np
import os

logos = [
    'logo_icon.png',
    'logo_icon_white.png',
    'white_logo.png',
    'logo.png',
    'logo_cropped.png',
    'logo_white.png',
    'white_text_logo.png',
    'white_text_logo_cropped.png',
    'loading_logo.png',
    'loading_logo_v2.png',
    'main_logo_v2.png'
]

for logo in logos:
    if not os.path.exists(logo):
        print(f"{logo} does not exist")
        continue
    img = cv2.imread(logo, cv2.IMREAD_UNCHANGED)
    h, w = img.shape[:2]
    channels = img.shape[2]
    print(f"\nLogo: {logo} | Size: {w}x{h} | Channels: {channels}")
    
    if channels == 4:
        # Check border pixels (outer 2 pixels)
        border_mask = np.ones((h, w), dtype=bool)
        border_mask[2:-2, 2:-2] = False
        
        border_pixels = img[border_mask]
        alphas = border_pixels[:, 3]
        rgbs = border_pixels[:, :3]
        
        # Count non-transparent pixels (alpha > 10)
        non_trans = np.sum(alphas > 10)
        print(f"  Border pixels: total={len(alphas)}, non-transparent (alpha>10)={non_trans}")
        if non_trans > 0:
            # Let's see what color these non-transparent border pixels are
            avg_color = np.mean(rgbs[alphas > 10], axis=0)
            print(f"  Avg BGR of non-transparent border: {avg_color}")
            # Check if they are white/light-colored
            is_white = np.all(avg_color > 200)
            print(f"  Is border white/bright? {is_white}")
    else:
        # No alpha channel (opaque image!)
        # Check if the border pixels are white/light
        border_mask = np.ones((h, w), dtype=bool)
        border_mask[2:-2, 2:-2] = False
        border_pixels = img[border_mask]
        avg_color = np.mean(border_pixels, axis=0)
        print(f"  Opaque border Avg BGR: {avg_color}")
        is_white = np.all(avg_color > 200)
        print(f"  Is border white/bright? {is_white}")
