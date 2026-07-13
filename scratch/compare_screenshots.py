import os
from PIL import Image, ImageChops

def compare(path1, path2):
    if not os.path.exists(path1) or not os.path.exists(path2):
        print(f"One of the files {path1} or {path2} does not exist.")
        return
    img1 = Image.open(path1).convert("RGB")
    img2 = Image.open(path2).convert("RGB")
    
    # Save diff image
    if img1.size != img2.size:
        print(f"Sizes differ: {path1} is {img1.size}, {path2} is {img2.size}")
        # Resize img2 to match img1 for comparison
        img2 = img2.resize(img1.size)
        
    diff = ImageChops.difference(img1, img2)
    diff.save("scratch/mobile_diff.png")
    bbox = diff.getbbox()
    if bbox is None:
        print("Images are identical.")
    else:
        print(f"Images differ. Bounding box of differences: {bbox}")
        # Let's count different pixels
        # Get data
        d1 = img1.getdata()
        d2 = img2.getdata()
        diff_pixels = 0
        for p1, p2 in zip(d1, d2):
            if abs(p1[0]-p2[0]) > 10 or abs(p1[1]-p2[1]) > 10 or abs(p1[2]-p2[2]) > 10:
                diff_pixels += 1
        print(f"Number of different pixels (threshold > 10): {diff_pixels} ({diff_pixels/len(d1)*100:.2f}%)")

compare(r"C:\Users\bem\.gemini\antigravity-ide\brain\45c04bf0-be05-409c-a126-d4b60f4986b6\vercel_hero_mobile_1783831972472.png", 
        r"C:\Users\bem\.gemini\antigravity-ide\brain\45c04bf0-be05-409c-a126-d4b60f4986b6\local_hero_mobile_1783832071491.png")
