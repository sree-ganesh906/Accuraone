import cv2
import numpy as np
import shutil
import os

if os.path.exists('aramco_logo.jpg'):
    shutil.copyfile('aramco_logo.jpg', 'scratch/aramco_logo_orig.jpg')
    img = cv2.imread('aramco_logo.jpg')
    dist_to_white = np.linalg.norm(img - [255, 255, 255], axis=2)
    mask = dist_to_white < 60
    img[mask] = [255, 255, 255]
    cv2.imwrite('aramco_logo.jpg', img)
    print("Updated aramco_logo.jpg successfully!")
else:
    print("aramco_logo.jpg does not exist")
