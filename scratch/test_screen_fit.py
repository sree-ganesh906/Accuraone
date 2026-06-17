from PIL import Image, ImageDraw

bg_path = "hero_glass_bg_new.png"
img = Image.open(bg_path).convert("RGB")
draw = ImageDraw.Draw(img)

# Candidate bezel corners:
# tl = (130, 290)
# tr = (810, 280) ? wait, let's look at the top edge of the monitor in the image.
# Does the top edge go from (130, 290) to (810, 280)? No, wait.
# Let's test a few lines to see where the top-right corner is.
# Let's test:
# Option A: tl=(130, 290), tr=(810, 190), br=(810, 700), bl=(270, 760)
# Option B: tl=(130, 290), tr=(810, 280), br=(810, 700), bl=(270, 760)
# Option C: tl=(130, 290), tr=(810, 320), br=(810, 700), bl=(270, 760)

bezel_A = [(130, 290), (810, 190), (810, 700), (270, 760)]
bezel_B = [(130, 290), (810, 280), (810, 700), (270, 760)]
bezel_C = [(130, 290), (810, 320), (810, 700), (270, 760)]

draw.polygon(bezel_A, outline="red", width=2)
draw.polygon(bezel_B, outline="green", width=2)
draw.polygon(bezel_C, outline="blue", width=2)

img.save("scratch_output/test_fit.png")
print("Saved test_fit.png")
