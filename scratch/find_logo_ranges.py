import os
from PIL import Image

logo_path = "white_text_logo.png"
if os.path.exists(logo_path):
    img = Image.open(logo_path).convert("RGBA")
    width, height = img.size
    
    # Let's count non-transparent pixels per row
    row_counts = []
    for y in range(height):
        count = 0
        for x in range(width):
            r, g, b, a = img.getpixel((x, y))
            if a > 10:
                count += 1
        row_counts.append((y, count))
        
    # Print rows with non-zero counts to see the vertical structure
    active_ranges = []
    in_range = False
    start_y = 0
    for y, count in row_counts:
        if count > 0 and not in_range:
            start_y = y
            in_range = True
        elif count == 0 and in_range:
            active_ranges.append((start_y, y - 1))
            in_range = False
    if in_range:
        active_ranges.append((start_y, height - 1))
        
    print("Active vertical ranges in the logo:")
    for idx, (start, end) in enumerate(active_ranges):
        print(f"Range {idx+1}: y={start} to y={end} (height={end-start+1})")
else:
    print("Logo file does not exist.")
