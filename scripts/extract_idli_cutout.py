import os
from PIL import Image, ImageFilter
import numpy as np
from rembg import remove, new_session

input_path = "familyfit-frontend/public/images/cta-idli-hero.jpg"
output_png = "familyfit-frontend/public/images/cta-idli-cutout.png"
output_webp = "familyfit-frontend/public/images/cta-idli-cutout.webp"

print("Loading image:", input_path)
img = Image.open(input_path).convert("RGB")

print("Initializing rembg session with isnet-general-use...")
try:
    session = new_session("isnet-general-use")
    print("Session created with isnet-general-use")
except Exception as e:
    print("Fallback to u2net due to:", e)
    session = new_session("u2net")

print("Running rembg with alpha matting...")
result = remove(
    img,
    session=session,
    alpha_matting=True,
    alpha_matting_foreground_threshold=240,
    alpha_matting_background_threshold=15,
    alpha_matting_erode_size=1
)

# Clean up edges: check halo and trim transparent padding
# Convert to RGBA
result = result.convert("RGBA")
bbox = result.getbbox()
print("Original bbox:", bbox)

# Slightly erode alpha by 1px and feather 1px to remove any beige fringe
alpha = result.split()[3]
# Filter alpha: min filter for 1px erosion, then Gaussian blur 1px
eroded_alpha = alpha.filter(ImageFilter.MinFilter(3)) # 3x3 min filter = 1px erosion
feathered_alpha = eroded_alpha.filter(ImageFilter.GaussianBlur(0.8))

# Composite back
r, g, b, _ = result.split()
cleaned = Image.merge("RGBA", (r, g, b, feathered_alpha))

# Trim transparent bounding box
trimmed_bbox = cleaned.getbbox()
print("Trimmed bbox:", trimmed_bbox)
if trimmed_bbox:
    # Add a small 10px margin around bbox
    w, h = cleaned.size
    pad = 10
    crop_box = (
        max(0, trimmed_bbox[0] - pad),
        max(0, trimmed_bbox[1] - pad),
        min(w, trimmed_bbox[2] + pad),
        min(h, trimmed_bbox[3] + pad)
    )
    final_img = cleaned.crop(crop_box)
else:
    final_img = cleaned

print("Final trimmed size:", final_img.size)

# If final width is not ~1400px, we can upscale/resize if appropriate or keep sharp native resolution
# Let's save PNG
final_img.save(output_png, "PNG")
print("Saved PNG:", output_png)

# Convert to WebP quality 90 with alpha
final_img.save(output_webp, "WEBP", quality=90, method=6)
print("Saved WebP:", output_webp)

# Also create dark and light preview background checks to inspect fringes
dark_bg = Image.new("RGBA", final_img.size, (30, 45, 35, 255))
dark_composite = Image.alpha_composite(dark_bg, final_img)
dark_composite.save("familyfit-frontend/public/images/cutout_preview_dark.png")

light_bg = Image.new("RGBA", final_img.size, (248, 245, 233, 255))
light_composite = Image.alpha_composite(light_bg, final_img)
light_composite.save("familyfit-frontend/public/images/cutout_preview_light.png")

print("Generated preview checks on dark and light backgrounds!")
