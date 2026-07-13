with open("c:/Users/bem/Desktop/accu/styles.css", "r", encoding="utf-8") as f:
    lines = f.readlines()

for idx, line in enumerate(lines):
    if ".hero" in line or "#home" in line:
        print(f"Line {idx+1}: {line.strip()}")
