import urllib.request

url = "http://localhost:8080/"
try:
    response = urllib.request.urlopen(url)
    html = response.read().decode('utf-8')
    lines = html.split('\n')
    for idx, line in enumerate(lines):
        if "hero-line" in line:
            print(f"Line {idx+1}: {line.strip()}")
except Exception as e:
    print("Error:", e)
