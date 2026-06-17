import os
from PIL import Image, ImageChops

def compare(path1, path2):
    if not os.path.exists(path1) or not os.path.exists(path2):
        print(f"One of the files {path1} or {path2} does not exist.")
        return
    img1 = Image.open(path1).convert("RGB")
    img2 = Image.open(path2).convert("RGB")
    if img1.size != img2.size:
        print(f"Sizes differ: {path1} is {img1.size}, {path2} is {img2.size}")
        return
    diff = ImageChops.difference(img1, img2)
    bbox = diff.getbbox()
    if bbox is None:
        print(f"Files {path1} and {path2} are identical.")
    else:
        print(f"Files {path1} and {path2} differ. Bounding box of differences: {bbox}")

print("Comparing images:")
compare("hero_glass_bg_new.png", "hero_glass_bg_new_clean.png")
compare("hero_glass_bg_new.png", "hero_glass_bg_new_empty.png")
compare("hero_glass_bg_new_clean.png", "hero_glass_bg_new_empty.png")
