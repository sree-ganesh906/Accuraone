import shutil
import os

new_path = r'C:\Users\bem\.gemini\antigravity-ide\brain\572b0bea-2cac-4018-aef0-4f2f14243813\media__1782754342724.jpg'
dest_path = 'ceo_cropped.jpg'
backup_path = 'ceo_cropped_bak.jpg'

if os.path.exists(dest_path):
    shutil.copyfile(dest_path, backup_path)
    print("Backed up old CEO photo to ceo_cropped_bak.jpg")

shutil.copyfile(new_path, dest_path)
print("Updated ceo_cropped.jpg successfully!")
