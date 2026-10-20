from PIL import Image
import numpy as np

png_path = "familyfit-frontend/public/images/cta-idli-cutout.png"
webp_path = "familyfit-frontend/public/images/cta-idli-cutout.webp"

img = Image.open(png_path).convert("RGBA")
arr = np.array(img)

# Feather the leftmost 20 pixels on the x-axis so any straight vertical edge fades smoothly
width = arr.shape[1]
feather_w = 20

for x in range(feather_w):
    factor = (x / feather_w) ** 1.5
    arr[:, x, 3] = (arr[:, x, 3].astype(float) * factor).astype(np.uint8)

feathered_img = Image.fromarray(arr)
feathered_img.save(png_path, "PNG", optimize=True)
feathered_img.save(webp_path, "WEBP", quality=90, method=6)

print("Softened straight left wrist boundary in PNG and WebP successfully!")
