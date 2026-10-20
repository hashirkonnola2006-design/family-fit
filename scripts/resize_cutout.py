from PIL import Image

png_path = "familyfit-frontend/public/images/cta-idli-cutout.png"
webp_path = "familyfit-frontend/public/images/cta-idli-cutout.webp"

img = Image.open(png_path)
orig_w, orig_h = img.size
target_w = 1400
target_h = int(orig_h * (target_w / orig_w))

print(f"Resizing from {orig_w}x{orig_h} to {target_w}x{target_h} using Lanczos...")
resized = img.resize((target_w, target_h), Image.Resampling.LANCZOS)

resized.save(png_path, "PNG", optimize=True)
print("Saved optimized 1400px PNG:", png_path)

resized.save(webp_path, "WEBP", quality=90, method=6)
print("Saved quality 90 WebP:", webp_path)
