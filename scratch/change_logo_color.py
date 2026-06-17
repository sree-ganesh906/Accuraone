import os
from PIL import Image

logo_path = "white_text_logo.png"
if os.path.exists(logo_path):
    img = Image.open(logo_path).convert("RGBA")
    width, height = img.size
    
    # We loop through all pixels and change white/near-white pixels to black.
    # We can identify white pixels as having R, G, B all high (e.g., > 200) and alpha > 10.
    changed_count = 0
    for y in range(height):
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a > 10:
                # If it's a white pixel
                if r > 200 and g > 200 and b > 200:
                    # Change to black (0, 0, 0) preserving alpha
                    img.putpixel((x, y), (0, 0, 0, a))
                    changed_count += 1
                    
    print(f"Changed {changed_count} pixels from white to black.")
    # Save the modified image
    img.save(logo_path)
    print(f"Saved modified logo to {logo_path}")
else:
    print(f"{logo_path} does not exist.")
