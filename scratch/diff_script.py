import difflib

local_path = r"c:\Users\bem\Desktop\accu\script.js"
fetched_path = r"c:\Users\bem\Desktop\accu\scratch\script_vercel.js"

with open(local_path, "r", encoding="utf-8") as f:
    local_lines = f.readlines()

with open(fetched_path, "r", encoding="utf-8") as f:
    fetched_lines = f.readlines()

diff = list(difflib.unified_diff(
    local_lines, 
    fetched_lines, 
    fromfile="local_script.js", 
    tofile="fetched_script.js",
    n=3
))

print("Diff lines count:", len(diff))
for line in diff[:100]: # Print first 100 lines of diff
    print(line, end="")
