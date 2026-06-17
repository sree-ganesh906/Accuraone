from PIL import Image, ImageDraw, ImageFont

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
draw = ImageDraw.Draw(img)

# Draw grid lines every 50 pixels and label them
for x in range(0, 1024, 50):
    draw.line([(x, 0), (x, 1024)], fill="gray", width=1)
    if x % 100 == 0:
        draw.text((x + 2, 5), str(x), fill="yellow")

for y in range(0, 1024, 50):
    draw.line([(0, y), (1024, y)], fill="gray", width=1)
    if y % 100 == 0:
        draw.text((5, y + 2), str(y), fill="yellow")

# Also draw small crosshairs and coordinates near the monitor screen area (approx x: 100-700, y: 200-700)
for x in range(100, 750, 100):
    for y in range(200, 750, 100):
        # Draw coordinate text at key points
        draw.text((x + 2, y + 2), f"{x},{y}", fill="cyan")

# Save output
output_path = "scratch_output/grid_quad.png"
img.save(output_path)
print(f"Saved grid image to {output_path}")
