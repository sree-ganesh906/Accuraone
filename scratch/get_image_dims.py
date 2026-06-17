import os
from PIL import Image

def get_dims(path):
    if os.path.exists(path):
        with Image.open(path) as img:
            print(f"{path}: {img.size}")
    else:
        print(f"{path} does not exist.")

get_dims("hero_glass_bg_new.png")
get_dims("hero_glass_bg_new_clean.png")
get_dims("hero_glass_bg_new_backup.png")
get_dims("hero_glass_bg_new_backup_real.png")
