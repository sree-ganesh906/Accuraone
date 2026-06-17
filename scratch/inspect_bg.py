import os
from PIL import Image

bg_path = "hero_glass_bg_new.png"
if os.path.exists(bg_path):
    with Image.open(bg_path) as img:
        print(f"Dimensions of {bg_path}: {img.size}")
else:
    print(f"{bg_path} does not exist.")
