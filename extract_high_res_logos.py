"import cv2
import numpy as np
import os
import fitz
import io
from PIL import Image

# 1. Load the low-res grid and match logos to get low-res coordinates
grid_path = 'clients_grid_transparent.png'
grid = cv2.imread(grid_path, cv2.IMREAD_UNCHANGED)
if grid.shape[2] == 4:
    grid_gray = cv2.cvtColor(grid, cv2.COLOR_BGRA2GRAY)
else:
    grid_gray = cv2.cvtColor(grid, cv2.COLOR_BGR2GRAY)

logo_coords = {}
for i in range(1, 13):
    logo_path = os.path.join('extracted_logos', f'logo_{i}.png')
    logo = cv2.imread(logo_path, cv2.IMREAD_UNCHANGED)
    if len(logo.shape) == 3 and logo.shape[2] == 4:
        logo_gray = cv2.cvtColor(logo, cv2.COLOR_BGRA2GRAY)
    elif len(logo.shape) == 3 and logo.shape[2] == 3:
        logo_gray = cv2.cvtColor(logo, cv2.COLOR_BGR2GRAY)
    else:
        logo_gray = logo
        
    res = cv2.matchTemplate(grid_gray, logo_gray, cv2.TM_CCOEFF_NORMED)
    min_val, max_val, min_loc, max_loc = cv2.minMaxLoc(res)
    h, w = logo.shape[:2]
    # Coordinates format: (x, y, w, h)
    logo_coords[i] = (max_loc[0], max_loc[1], w, h)
    print(f"Low-res Logo {i}: coord={logo_coords[i]} with correlation={max_val:.4f}")

# 2. Extract high-res Page 7 image from PDF
doc = fitz.open("AccuraOne Profile new.pdf")
page = doc[6] # Page 7

# Option A: Extract raw image
image_list = page.get_images(full=True)
xref = image_list[0][0]
base_image = doc.extract_image(xref)
image_bytes = base_image["image"]
raw_img = Image.open(io.BytesIO(image_bytes))
raw_arr = np.array(raw_img)

# Option B: Render page at 300 DPI
zoom = 300 / 72
matrix = fitz.Matrix(zoom, zoom)
pix = page.get_pixmap(matrix=matrix)
rendered_img = Image.open(io.BytesIO(pix.tobytes("png")))
rendered_arr = np.array(rendered_img)

print(f"Raw image size: {raw_img.size}")
print(f"Rendered image size: {rendered_img.size}")

# Find which one matches grid aspect ratio and layout
# We compare downscaled versions with clients_grid.png
grid_ref = cv2.imread('clients_grid.png')
grid_re
<truncated 1818 bytes>