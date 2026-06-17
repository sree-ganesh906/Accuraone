import cv2
import numpy as np

# Load the background image
bg_path = "hero_glass_bg_new.png"
img = cv2.imread(bg_path)
h, w, c = img.shape

# Let's save a series of crops to pinpoint the corners.
# Let's define the search ranges for the 4 corners of the screen bezel:
# 1. Top-Left: x in [100, 180], y in [260, 320]
# 2. Top-Right: x in [750, 830], y in [260, 320]
# 3. Bottom-Left: x in [220, 300], y in [700, 780]
# 4. Bottom-Right: x in [780, 860], y in [650, 730]

# Let's write a script that draws a 10px grid over these areas and prints/saves them.
def create_grid_crop(img, x_start, x_end, y_start, y_end, name):
    crop = img[y_start:y_end, x_start:x_end].copy()
    # Draw 10px grid on the crop
    ch, cw, _ = crop.shape
    for cx in range(0, cw, 10):
        cv2.line(crop, (cx, 0), (cx, ch), (128, 128, 128), 1)
        cv2.putText(crop, str(x_start + cx), (cx, 12), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 255, 255), 1)
    for cy in range(0, ch, 10):
        cv2.line(crop, (0, cy), (cw, cy), (128, 128, 128), 1)
        cv2.putText(crop, str(y_start + cy), (2, cy + 10), cv2.FONT_HERSHEY_SIMPLEX, 0.3, (0, 255, 255), 1)
    cv2.imwrite(f"scratch_output/grid_{name}.png", crop)

create_grid_crop(img, 100, 180, 260, 320, "tl")
create_grid_crop(img, 750, 830, 260, 320, "tr")
create_grid_crop(img, 220, 300, 700, 780, "bl")
create_grid_crop(img, 780, 860, 650, 730, "br")

print("Created grid crops for the 4 corners.")
