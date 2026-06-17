import os
from PIL import Image

def analyze():
    img1 = Image.open("hero_glass_bg_new.png").convert("RGB")
    img2 = Image.open("hero_glass_bg_new_clean.png").convert("RGB")
    
    print(f"img1 size: {img1.size}")
    print(f"img2 size: {img2.size}")
    
    # Let's inspect the diff bounding box area: (0, 600, 561, 1024)
    # Note: image height is 724 pixels (aspect ratio 1024/724). Bounding box lower y = 724 max.
    # The bounding box of difference was (0, 600, 561, 1024), but let's restrict to image dimensions:
    # x: 0 to 561, y: 600 to 724
    
    # Let's see some pixel values in this area to see if one has solid black (0,0,0) and the other has background texture
    black_pixels_img1 = 0
    black_pixels_img2 = 0
    
    for y in range(600, min(img1.height, 724)):
        for x in range(0, min(img1.width, 561)):
            p1 = img1.getpixel((x, y))
            p2 = img2.getpixel((x, y))
            if p1 == (0, 0, 0):
                black_pixels_img1 += 1
            if p2 == (0, 0, 0):
                black_pixels_img2 += 1
                
    print(f"Solid black pixels in img1 (hero_glass_bg_new.png) in diff region: {black_pixels_img1}")
    print(f"Solid black pixels in img2 (hero_glass_bg_new_clean.png) in diff region: {black_pixels_img2}")

analyze()
