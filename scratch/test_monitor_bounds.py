from PIL import Image, ImageDraw

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
draw = ImageDraw.Draw(img)

# Exact monitor display area corners (excluding bezel):
# Let's check:
# Top-Left: (328, 438)
# Top-Right: (582, 442)
# Bottom-Right: (590, 592)
# Bottom-Left: (345, 588)

monitor_display = [(328, 438), (582, 442), (590, 592), (345, 588)]

# Scale it down for the logo (e.g. by 0.6 to give a nice border)
def get_center(quad):
    xs = [p[0] for p in quad]
    ys = [p[1] for p in quad]
    return (sum(xs)/4.0, sum(ys)/4.0)

cx, cy = get_center(monitor_display)

def scale_quad(quad, factor):
    new_quad = []
    for (x, y) in quad:
        nx = cx + (x - cx) * factor
        ny = cy + (y - cy) * factor
        new_quad.append((int(nx), int(ny)))
    return new_quad

logo_quad = scale_quad(monitor_display, 0.6)

draw.polygon(monitor_display, outline="green", width=2)
draw.polygon(logo_quad, outline="red", width=2)

img.save("scratch_output/test_monitor_bounds.png")
print(f"Logo Quad: {logo_quad}")
