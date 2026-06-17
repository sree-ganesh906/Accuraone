import os
from PIL import Image

img = Image.open("white_text_logo.png").convert("RGBA")
black_coords = []
for y in range(img.height):
    for x in range(img.width):
        r, g, b, a = img.getpixel((x, y))
        if a > 10 and r < 10 and g < 10 and b < 10:
            black_coords.append((x, y))

if black_coords:
    min_x = min(x for x, y in black_coords)
    max_x = max(x for x, y in black_coords)
    min_y = min(y for x, y in black_coords)
    max_y = max(y for x, y in black_coords)
    print(f"Bounding box of black pixels in logo: ({min_x}, {min_y}, {max_x}, {max_y})")
    
    # Save a crop of this area
    img.crop((min_x - 10, min_y - 10, max_x + 10, max_y + 10)).save("scratch/logo_black_crop.png")
    print("Saved scratch/logo_black_crop.png")
else:
    print("No black pixels found.")
