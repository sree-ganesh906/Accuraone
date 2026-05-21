import os
from PIL import Image

def crop_border(image_path, output_path):
    img = Image.open(image_path).convert("RGB")
    pixels = img.load()
    width, height = img.size
    
    border_color = pixels[0, 0]
    def is_border(color):
        return sum(abs(c1 - c2) for c1, c2 in zip(color[:3], border_color[:3])) < 30

    top = 0
    for y in range(height):
        if not is_border(pixels[width//2, y]): top = y; break
    bottom = height - 1
    for y in range(height-1, -1, -1):
        if not is_border(pixels[width//2, y]): bottom = y; break
    left = 0
    for x in range(width):
        if not is_border(pixels[x, height//2]): left = x; break
    right = width - 1
    for x in range(width-1, -1, -1):
        if not is_border(pixels[x, height//2]): right = x; break

    margin = 2
    left += margin
    top += margin
    right -= margin
    bottom -= margin

    cropped_img = img.crop((left, top, right, bottom))
    cropped_img.save(output_path)

if __name__ == '__main__':
    in_file = r"c:\Users\bem\.gemini\antigravity\brain\e16a1687-5310-4438-90b4-5b42a34e2d9b\media__1776973589841.png"
    out_file = r"c:\Users\bem\Desktop\accu\ceo_cropped.jpg"
    crop_border(in_file, out_file)
