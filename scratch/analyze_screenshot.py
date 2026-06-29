import cv2
import numpy as np

# Load screenshot
path = r'C:\Users\bem\.gemini\antigravity-ide\brain\572b0bea-2cac-4018-aef0-4f2f14243813\aramco_vendor_card_1782752717229.png'
img = cv2.imread(path)
if img is None:
    print("Could not load screenshot!")
else:
    h, w, c = img.shape
    print("Screenshot shape:", img.shape)
    
    # Let's count different colors in the screenshot
    # We want to see if there is #eeeeee (which is [238, 238, 238] in BGR) in the screenshot
    dist_to_check = np.linalg.norm(img - [238, 238, 238], axis=2)
    check_pixels = np.sum(dist_to_check < 2)
    print(f"Number of checkerboard-gray pixels in screenshot: {check_pixels} ({check_pixels/(h*w)*100:.2f}%)")
