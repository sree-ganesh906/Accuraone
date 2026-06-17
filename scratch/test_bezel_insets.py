from PIL import Image, ImageDraw

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
draw = ImageDraw.Draw(img)

# Active screen area (inner display) candidates:
# We will draw the candidate display area in green, and candidate logo area in red.

# Let's try:
# Inner display area:
# Top-Left: (145, 305)
# Top-Right: (795, 290)
# Bottom-Right: (795, 685)
# Bottom-Left: (280, 745)

screen_inner = [(145, 305), (795, 290), (795, 685), (280, 745)]

# Logo placement quad (centered inside the inner display area with some margins):
# Let's scale down the screen quad towards the center.
# We can find the center of the quad, and interpolate each corner towards the center by a factor.
# For example, factor 0.6 means the logo will occupy 60% of the screen width/height, leaving a 20% margin.

def get_center(quad):
    xs = [p[0] for p in quad]
    ys = [p[1] for p in quad]
    return (sum(xs)/4.0, sum(ys)/4.0)

cx, cy = get_center(screen_inner)

def scale_quad(quad, factor):
    new_quad = []
    for (x, y) in quad:
        nx = cx + (x - cx) * factor
        ny = cy + (y - cy) * factor
        new_quad.append((int(nx), int(ny)))
    return new_quad

logo_quad = scale_quad(screen_inner, 0.6)

draw.polygon(screen_inner, outline="green", width=3)
draw.polygon(logo_quad, outline="red", width=3)

# Let's save and inspect
img.save("scratch_output/test_insets.png")
print("Saved test_insets.png")
print(f"Center is: {cx}, {cy}")
print(f"Logo Quad: {logo_quad}")
