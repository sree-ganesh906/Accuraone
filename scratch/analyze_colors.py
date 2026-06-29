import cv2
import numpy as np

img = cv2.imread('scratch/saudi_aramco_logo_orig.jpg')
# Let's count occurrences of unique RGB values or distances to white
h, w, c = img.shape
pixels = img.reshape(-1, 3)

# Let's sort colors by their brightness (or distance to black/white)
# L1 distance to white
dists = np.sum(255 - pixels, axis=1)

# Let's print the distribution of dists
hist, bin_edges = np.histogram(dists, bins=10)
for i in range(10):
    print(f"Distance to white in range [{bin_edges[i]:.1f}, {bin_edges[i+1]:.1f}]: {hist[i]} pixels")
