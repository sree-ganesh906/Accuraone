from PIL import Image, ImageDraw

# Open the background image
bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
draw = ImageDraw.Draw(img)

# Coordinates from LogoParticleEffect.js
screen_quad = [
    (255, 420), # tl
    (595, 435), # tr
    (594, 600), # br
    (255, 648)  # bl
]

logo_quad = [
    (349, 454), # tl
    (564, 460), # tr
    (573, 582), # br
    (382, 602)  # bl
]

# Draw screen quad in blue
draw.polygon(screen_quad, outline="blue", width=3)

# Draw logo quad in red
draw.polygon(logo_quad, outline="red", width=3)

# Save output
output_path = "scratch_output/test_quad.png"
import os
os.makedirs("scratch_output", exist_ok=True)
img.save(output_path)
print(f"Saved test image to {output_path}")
