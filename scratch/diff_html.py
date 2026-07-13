import difflib

local_path = r"c:\Users\bem\Desktop\accu\index.html"
fetched_path = r"C:\Users\bem\.gemini\antigravity-ide\brain\45c04bf0-be05-409c-a126-d4b60f4986b6\.system_generated\steps\33\content.md"

with open(local_path, "r", encoding="utf-8") as f:
    local_lines = f.readlines()

with open(fetched_path, "r", encoding="utf-8") as f:
    fetched_raw = f.readlines()

fetched_lines = fetched_raw[8:] # index 8 is line 9

diff = list(difflib.unified_diff(
    local_lines, 
    fetched_lines, 
    fromfile="local_index.html", 
    tofile="fetched_index.html",
    n=3
))

print("Diff lines count:", len(diff))
for line in diff[:100]: # Print first 100 lines of diff
    print(line, end="")
