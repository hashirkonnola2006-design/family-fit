import os
from PIL import Image

master_path = r'familyfit-frontend/public/images/hero-master-3200.png'
out_dir = r'familyfit-frontend/public/images'

master = Image.open(master_path).convert('RGB')
orig_w, orig_h = master.size
aspect = orig_h / orig_w
print(f"Master image size: {orig_w}x{orig_h}")

targets = [
    (2560, "hero-2560"),
    (1920, "hero-1920"),
    (1280, "hero-1280"),
    (800, "hero-800"),
]

for width, name in targets:
    height = int(width * aspect)
    # High-quality Lanczos resampling
    resized = master.resize((width, height), Image.Resampling.LANCZOS)
    
    # WebP with high quality (quality=88, method=6 for pristine green wall without banding)
    webp_path = os.path.join(out_dir, f"{name}.webp")
    resized.save(webp_path, "WEBP", quality=88, method=6)
    
    # JPEG fallback
    jpg_path = os.path.join(out_dir, f"{name}.jpg")
    resized.save(jpg_path, "JPEG", quality=90, optimize=True)
    
    size_webp_kb = os.path.getsize(webp_path) / 1024
    size_jpg_kb = os.path.getsize(jpg_path) / 1024
    print(f"Exported {name} ({width}x{height}) -> WebP: {size_webp_kb:.1f}KB, JPG: {size_jpg_kb:.1f}KB")

# Also update hero-desktop.webp and hero-desktop.png with the 2560px version for backward compatibility
hero_2560 = master.resize((2560, int(2560 * aspect)), Image.Resampling.LANCZOS)
hero_2560.save(os.path.join(out_dir, "hero-desktop.webp"), "WEBP", quality=88, method=6)
hero_2560.save(os.path.join(out_dir, "hero-desktop.png"), "PNG", optimize=True)

hero_1280 = master.resize((1280, int(1280 * aspect)), Image.Resampling.LANCZOS)
hero_1280.save(os.path.join(out_dir, "hero-desktop-1200.webp"), "WEBP", quality=88, method=6)
hero_1280.save(os.path.join(out_dir, "hero-desktop-1200.png"), "PNG", optimize=True)

print("All responsive hero assets exported successfully!")
