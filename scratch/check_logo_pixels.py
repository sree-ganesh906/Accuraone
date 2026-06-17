import os
from PIL import Image

logo_path = "white_text_logo.png"
if os.path.exists(logo_path):
    img = Image.open(logo_path).convert("RGBA")
    print(f"Logo size: {img.size}")
    
    # Check if there are any non-transparent pixels that are black (or close to black)
    black_pixels = 0
    total_non_transparent = 0
    for y in range(img.height):
        for x in range(img.width):
            r, g, b, a = img.getpixel((x, y))
            if a > 10:
                total_non_transparent += 1
                if r < 10 and g < 10 and b < 10:
                    black_pixels += 1
                    
    print(f"Total non-transparent pixels: {total_non_transparent}")
    print(f"Total black (or dark) pixels: {black_pixels}")
else:
    print(f"{logo_path} does not exist.")
