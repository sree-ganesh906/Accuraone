import cv2
import numpy as np
import os

logos = ['logo_white.png', 'white_logo.png', 'white_text_logo.png']

for logo in logos:
    img = cv2.imread(logo, cv2.IMREAD_UNCHANGED)
    if img is not None and img.shape[2] == 4:
        alpha = img[:, :, 3]
        non_trans = img[alpha > 50]
        # Calculate mean color and unique colors
        rgb = non_trans[:, :3]
        # Let's count how many pixels are close to black, close to white, close to purple
        # Purple in logo is around (145, 75, 199) in BGR: [199, 75, 145] or similar
        # Let's check distance to black [0, 0, 0]
        dist_to_black = np.linalg.norm(rgb - [0, 0, 0], axis=1)
        black_count = np.sum(dist_to_black < 50)
        
        # Distance to white [255, 255, 255]
        dist_to_white = np.linalg.norm(rgb - [255, 255, 255], axis=1)
        white_count = np.sum(dist_to_white < 50)
        
        # Distance to purple [199, 75, 145]
        dist_to_purple = np.linalg.norm(rgb - [199, 75, 145], axis=1)
        purple_count = np.sum(dist_to_purple < 80)
        
        print(f"File: {logo}")
        print(f"  Total non-trans: {len(non_trans)}")
        print(f"  Black-ish pixels: {black_count}")
        print(f"  White-ish pixels: {white_count}")
        print(f"  Purple-ish pixels: {purple_count}")
