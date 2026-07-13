import difflib

local_path = r"c:\Users\bem\Desktop\accu\index.html"
backup_path = r"c:\Users\bem\Desktop\accu\AccuraOne _ High-End Business Consultancy.html"

with open(local_path, "r", encoding="utf-8") as f:
    local_lines = f.readlines()

with open(backup_path, "r", encoding="utf-8") as f:
    backup_lines = f.readlines()

diff = list(difflib.unified_diff(
    local_lines, 
    backup_lines, 
    fromfile="index.html", 
    tofile="AccuraOne_Consultancy.html",
    n=3
))

print("Diff lines count:", len(diff))
for line in diff[:100]: # Print first 100 lines of diff
    print(line, end="")
