from PIL import Image

# Current CEO photo
img_curr = Image.open('ceo_cropped.jpg')
print("Current image format:", img_curr.format)
print("Current image size:", img_curr.size)
print("Current image mode:", img_curr.mode)

# New CEO photo
new_path = r'C:\Users\bem\.gemini\antigravity-ide\brain\572b0bea-2cac-4018-aef0-4f2f14243813\media__1782754342724.jpg'
img_new = Image.open(new_path)
print("New image format:", img_new.format)
print("New image size:", img_new.size)
print("New image mode:", img_new.mode)
