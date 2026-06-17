import cv2
import numpy as np

# Load the background image
bg_path = "hero_glass_bg_new.png"
img = cv2.imread(bg_path)

# Let's define the candidate corners we can see visually from grid_quad.png:
# Top-Left corner of monitor screen: (130, 290)
# Top-Right corner of monitor screen: (810, 300) - wait, let's look at where the bezel is.
# Let's crop several regions of interest (ROI) to find the exact pixel coordinates of the bezel corners.

h, w, c = img.shape
print(f"Image dimensions: {w}x{h}")

# Let's find the corners by saving cropped versions of the corners:
# 1. Top-Left corner area (around 100-200, 250-350)
tl_crop = img[260:320, 110:170]
cv2.imwrite("scratch_output/crop_tl.png", tl_crop)

# 2. Top-Right corner area (around 780-840, 270-330)
# Wait, let's look at where the top-right of the monitor is in grid_quad.png.
# Looking at grid_quad.png, the top-right corner of the monitor is around x=810, y=700? No, that's the bottom-right of the monitor screen!
# Wait, where is the top-right corner of the monitor?
# Let's look at grid_quad.png again:
# The top edge goes from (130, 290) to the right. It seems to end around x=810, y=300? No, the monitor in grid_quad.png has:
# - Top-Left: around x=130, y=290
# - Bottom-Left: around x=270, y=760 (wait, is it 270, 760? Let's check: the bottom-left corner of the monitor is at x=270, y=760)
# - Bottom-Right: around x=810, y=700
# - Top-Right: around x=700, y=300? Wait, the monitor is tilted, so:
# Let's check where the top-right corner is. Is it around x=810, y=300?
# Let's write a script to crop a few areas and save them to find it!
# Let's crop:
# - Top-Right area: 780-840, 270-350
# - Bottom-Left area: 240-300, 730-790
# - Bottom-Right area: 780-840, 670-730

tr_crop = img[270:350, 780:840]
cv2.imwrite("scratch_output/crop_tr.png", tr_crop)

bl_crop = img[730:790, 240:300]
cv2.imwrite("scratch_output/crop_bl.png", bl_crop)

br_crop = img[670:730, 780:840]
cv2.imwrite("scratch_output/crop_br.png", br_crop)

print("Saved crop images.")
