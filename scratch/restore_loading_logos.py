import shutil
import os

files_to_restore = [
    'loading_logo.png',
    'loading_logo_v2.png'
]

for f in files_to_restore:
    bak = f + '.bak'
    if os.path.exists(bak):
        shutil.copyfile(bak, f)
        print(f"Restored {f} from backup (black text).")
    else:
        print(f"Backup for {f} does not exist.")
