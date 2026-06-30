import shutil
import os

files_to_restore = [
    'white_text_logo.png',
    'white_text_logo_cropped.png'
]

for f in files_to_restore:
    bak = f + '.bak'
    if os.path.exists(bak):
        shutil.copyfile(bak, f)
        print(f"Restored {f} from backup (black text).")
    else:
        print(f"Backup for {f} does not exist.")
