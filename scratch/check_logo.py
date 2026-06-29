from PIL import Image
import numpy as np

img = Image.open('saudi_aramco_logo.jpg')
print("Format:", img.format)
print("Size:", img.size)
print("Mode:", img.mode)

# Let's inspect some pixel values at the corners (which are typically background)
arr = np.array(img)
corners = [
    arr[0, 0],
    arr[0, -1],
    arr[-1, 0],
    arr[-1, -1]
]
print("Corner pixels:", corners)
