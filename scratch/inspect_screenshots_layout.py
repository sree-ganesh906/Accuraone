import cv2
import numpy as np

def analyze_layout(path, name):
    img = cv2.imread(path)
    if img is None:
        print(f"Error loading {path}")
        return
    
    # Convert to grayscale
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    
    # Calculate horizontal profile (sum along columns)
    # Brightest elements on the dark background are the text and logo
    # Let's threshold it to find the main content region
    _, thresh = cv2.threshold(gray, 50, 255, cv2.THRESH_BINARY)
    
    col_sums = np.sum(thresh, axis=0)
    w = len(col_sums)
    
    # Find bounding box of content
    non_zero = np.where(col_sums > 0)[0]
    if len(non_zero) > 0:
        min_x = non_zero[0]
        max_x = non_zero[-1]
        center = np.sum(col_sums * np.arange(w)) / np.sum(col_sums)
        print(f"{name}: Width={w}, Content X range={min_x}..{max_x}, Horizontal center of mass={center:.2f} (ideal={w/2})")
    else:
        print(f"{name}: Empty screenshot")

print("Analyzing screenshot layout center of mass:")
analyze_layout(r"C:\Users\bem\.gemini\antigravity-ide\brain\45c04bf0-be05-409c-a126-d4b60f4986b6\vercel_hero_mobile_1783831972472.png", "Vercel")
analyze_layout(r"C:\Users\bem\.gemini\antigravity-ide\brain\45c04bf0-be05-409c-a126-d4b60f4986b6\local_hero_mobile_1783832071491.png", "Localhost")
