keywords = ['screen', 'laptop', 'skyline', 'fader', 'desktop', 'hero', 'computer']
with open('styles.css', 'r', encoding='utf-8') as f:
    lines = f.readlines()

for kw in keywords:
    print(f"\n--- Matches for keyword: {kw} ---")
    match_count = 0
    for idx, line in enumerate(lines):
        if kw in line.lower():
            print(f"  Line {idx+1}: {line.strip()}")
            match_count += 1
            if match_count > 10:
                print("  Truncated further matches...")
                break
