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
        # Count different pixels
        d1 = img1.getdata()
        d2 = img2.getdata()
        diff_pixels = 0
        for p1, p2 in zip(d1, d2):
            if abs(p1[0]-p2[0]) > 5 or abs(p1[1]-p2[1]) > 5 or abs(p1[2]-p2[2]) > 5:
                diff_pixels += 1
        print(f"Number of different pixels (threshold > 5): {diff_pixels} ({diff_pixels/len(d1)*100:.2f}%)")

compare("hero_glass_bg_new.png", "scratch/hero_glass_bg_new_vercel.png")
