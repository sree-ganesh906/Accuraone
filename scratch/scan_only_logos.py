import os
import cv2
import numpy as np

target_dirs = ['extracted_logos', 'extracted_logos_high']

for d in target_dirs:
    if not os.path.exists(d):
        continue
    for f in os.listdir(d):
        if f.lower().endswith(('.png', '.jpg', '.jpeg')):
            path = os.path.join(d, f)
            try:
                img = cv2.imread(path)
                if img is None:
                    continue
                # Let's check distance to gray #eeeeee
                dist_to_check = np.linalg.norm(img - [238, 238, 238], axis=2)
                check_pixels = np.sum(dist_to_check < 2)
                pct = check_pixels / (img.shape[0] * img.shape[1]) * 100
                if pct > 5.0:
                    print(f"Found match: {path} has {pct:.2f}% checkerboard-gray pixels. Shape: {img.shape}")
            except Exception as e:
                print(f"Error reading {path}: {e}")
