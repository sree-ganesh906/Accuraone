from PIL import Image

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
width, height = img.size

# We want to find the quadrilateral of the black screen.
# The screen is very dark (almost black: R, G, B all < 20).
# Let's find all pixels with R < 20, G < 20, B < 20.
# Since there might be other dark pixels, we restrict the search to the monitor area:
# x in [200, 650], y in [350, 700]

dark_pixels = []
for y in range(100, 800):
    for x in range(100, 900):
        r, g, b = img.getpixel((x, y))
        if r < 20 and g < 20 and b < 20:
            dark_pixels.append((x, y))

# Now, let's find the corners of this cluster of dark pixels:
# 1. Top-Left: minimizes x + y
# 2. Top-Right: maximizes x - y
# 3. Bottom-Left: minimizes x - y
# 4. Bottom-Right: maximizes x + y

if dark_pixels:
    tl = min(dark_pixels, key=lambda p: p[0] + p[1])
    tr = max(dark_pixels, key=lambda p: p[0] - p[1])
    bl = min(dark_pixels, key=lambda p: p[0] - p[1])
    br = max(dark_pixels, key=lambda p: p[0] + p[1])
    
    print(f"Top-Left corner of dark screen: {tl}")
    print(f"Top-Right corner of dark screen: {tr}")
    print(f"Bottom-Left corner of dark screen: {bl}")
    print(f"Bottom-Right corner of dark screen: {br}")
else:
    print("No dark pixels found in the search area.")
