import cv2
import numpy as np

# Load background image
bg_path = "hero_glass_bg_new.png"
img = cv2.imread(bg_path)
gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

# Apply bilateral filter to preserve edges while removing noise (stars)
blurred = cv2.bilateralFilter(gray, 9, 75, 75)

# Canny edge detection
edged = cv2.Canny(blurred, 30, 150)
cv2.imwrite("scratch_output/edges.png", edged)

# Find contours
contours, _ = cv2.findContours(edged.copy(), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
contours = sorted(contours, key=cv2.contourArea, reverse=True)

print(f"Total contours found: {len(contours)}")

# Loop over contours to find a quadrilateral
screen_contour = None
for c in contours[:15]:
    peri = cv2.arcLength(c, True)
    approx = cv2.approxPolyDP(c, 0.02 * peri, True)
    
    # If the contour has 4 vertices, we assume we found the screen
    if len(approx) == 4:
        area = cv2.contourArea(c)
        if area > 10000: # Make sure it's a large area
            screen_contour = approx
            print(f"Found candidate quad with area: {area}")
            break

if screen_contour is not None:
    # Print the corners
    pts = screen_contour.reshape(4, 2)
    # Sort points: tl, tr, br, bl
    # Sum of coords (x+y) is min for tl, max for br
    # Diff of coords (x-y) is min for bl, max for tr
    pts_sorted = np.zeros((4, 2), dtype="float32")
    s = pts.sum(axis=1)
    pts_sorted[0] = pts[np.argmin(s)] # tl
    pts_sorted[2] = pts[np.argmax(s)] # br
    diff = np.diff(pts, axis=1).flatten()
    pts_sorted[1] = pts[np.argmin(diff)] # tr -> wait, diff is y - x. if y is small, x is large (tr), diff is min.
    pts_sorted[3] = pts[np.argmax(diff)] # bl -> if y is large, x is small (bl), diff is max.
    
    print(f"Detected screen corners:")
    print(f"Top-Left: {pts_sorted[0]}")
    print(f"Top-Right: {pts_sorted[1]}")
    print(f"Bottom-Right: {pts_sorted[2]}")
    print(f"Bottom-Left: {pts_sorted[3]}")
    
    # Draw outline on img and save
    cv2.drawContours(img, [screen_contour], -1, (0, 255, 0), 3)
    cv2.imwrite("scratch_output/detected_screen.png", img)
else:
    print("Could not find a 4-point contour.")
