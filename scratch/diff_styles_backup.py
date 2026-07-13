import difflib

local_path = r"c:\Users\bem\Desktop\accu\styles.css"
fetched_path = r"c:\Users\bem\Desktop\accu\AccuraOne _ High-End Business Consultancy_files\styles.css"

with open(local_path, "r", encoding="utf-8") as f:
    local_lines = f.readlines()

with open(fetched_path, "r", encoding="utf-8") as f:
    fetched_lines = f.readlines()

diff = list(difflib.unified_diff(
    local_lines, 
    fetched_lines, 
    fromfile="local_styles.css", 
    tofile="backup_styles.css",
    n=3
))

print("Diff lines count:", len(diff))
for line in diff[:150]: # Print first 150 lines of diff
    print(line, end="")
