from PIL import Image

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
width, height = img.size

# Let's inspect pixel colors along the top-left to top-right line.
# Specifically, let's check a horizontal line at y = 300, 350, 400, 450, 500
# and print where the color changes significantly from the blue sky color.
# The blue sky has high blue component. The monitor screen is dark/grey.

def scan_line_y(y):
    transitions = []
    prev_color = img.getpixel((0, y))
    for x in range(1, width):
        color = img.getpixel((x, y))
        # check distance in RGB space
        dist = sum((c1 - c2) ** 2 for c1, c2 in zip(color, prev_color)) ** 0.5
        if dist > 30: # threshold for transition
            transitions.append((x, color))
        prev_color = color
    return transitions

print("Scan at y = 350:", scan_line_y(350)[:10])
print("Scan at y = 400:", scan_line_y(400)[:10])
print("Scan at y = 450:", scan_line_y(450)[:10])
print("Scan at y = 500:", scan_line_y(500)[:10])
