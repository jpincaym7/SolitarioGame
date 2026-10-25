from PIL import Image
import os
import numpy as np

src_path = r"C:\Users\coddy\.gemini\antigravity\brain\802088cd-4a68-4be4-9ef9-92debd9c1474\solitario_royal_logo_v2_1792943106946.jpg"
out_dir = r"c:\Users\coddy\Desktop\SOLITARE-GAME\public\assets\logo"
os.makedirs(out_dir, exist_ok=True)
out_png = os.path.join(out_dir, "solitario_real_logo.png")

# Open image and convert to RGBA
img = Image.open(src_path).convert("RGBA")
data = np.array(img, dtype=np.float32)

r = data[:, :, 0]
g = data[:, :, 1]
b = data[:, :, 2]

# Compute brightness/whiteness distance
# Pure white is 255, 255, 255
min_rgb = np.minimum(np.minimum(r, g), b)
max_diff = np.maximum(np.maximum(np.abs(r - g), np.abs(r - b)), np.abs(g - b))

# White background mask: high brightness, very low color difference
# Smooth alpha ramp between brightness 240 and 254 where color difference is small
is_white = (min_rgb > 245) & (max_diff < 15)
is_near_white = (min_rgb > 230) & (max_diff < 20)

alpha = np.ones_like(r) * 255.0

# Smooth transition for edges
for y in range(img.height):
    for x in range(img.width):
        min_val = min(r[y, x], g[y, x], b[y, x])
        diff = max(abs(r[y, x] - g[y, x]), abs(r[y, x] - b[y, x]), abs(g[y, x] - b[y, x]))
        if min_val >= 250 and diff < 12:
            alpha[y, x] = 0.0
        elif min_val > 232 and diff < 18:
            # Linear ramp from 0 to 255
            factor = (min_val - 232) / (250 - 232)
            alpha[y, x] = 255.0 * (1.0 - factor)
        else:
            alpha[y, x] = 255.0

data[:, :, 3] = alpha
result_img = Image.fromarray(data.astype(np.uint8), mode="RGBA")

# Crop tight bounding box
bbox = result_img.getbbox()
if bbox:
    cropped_img = result_img.crop(bbox)
else:
    cropped_img = result_img

cropped_img.save(out_png, "PNG")
print(f"Successfully processed and saved transparent PNG to {out_png}")
print(f"Original size: {img.size}, Cropped size: {cropped_img.size}")
