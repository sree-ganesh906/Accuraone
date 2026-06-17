from PIL import Image, ImageChops

img1 = Image.open("hero_glass_bg_new.png").convert("RGB")
img2 = Image.open("hero_glass_bg_new_clean.png").convert("RGB")

diff = ImageChops.difference(img1, img2)
bbox = diff.getbbox()
print(f"Bounding box of diff: {bbox}")

if bbox:
    # Save the cropped area of both images where they differ
    img1.crop(bbox).save("scratch/img1_diff.png")
    img2.crop(bbox).save("scratch/img2_diff.png")
    diff.crop(bbox).save("scratch/diff_crop.png")
    print("Saved diff images in scratch folder.")
