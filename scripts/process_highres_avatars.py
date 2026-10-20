import os
from PIL import Image
import rembg

files = [
    ("grandfather", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_grandfather_hi_res_1792515215600.jpg"),
    ("grandmother", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_grandmother_hi_res_1792515263450.jpg"),
    ("father", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_father_hi_res_1792515297632.jpg"),
    ("mother", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_mother_hi_res_1792515331002.jpg"),
    ("son", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_son_hi_res_1792515367407.jpg"),
    ("daughter", r"C:\Users\Lenovo\.gemini\antigravity-ide\brain\c01ee75b-5106-4a81-af71-a3fdf19d8381\avatar_daughter_hi_res_1792515407962.jpg"),
]

out_dir = r"c:\Users\Lenovo\Documents\family fit\familyfit-frontend\public\images\avatars-3d"
session = rembg.new_session()

for name, filepath in files:
    img = Image.open(filepath).convert("RGBA")
    print(f"Processing {name} (original size: {img.size})...")
    
    # Background removal with alpha matting
    nobg = rembg.remove(img, session=session, alpha_matting=True, alpha_matting_foreground_threshold=240, alpha_matting_background_threshold=10)
    
    # Check bbox to crop any excess empty space and remove bottom shadow
    bbox = nobg.getbbox()
    if bbox:
        # Tightly crop transparent padding around the character
        cropped = nobg.crop(bbox)
    else:
        cropped = nobg
        
    print(f"{name} cropped bbox size: {cropped.size}")
    
    # Save as full-res PNG
    png_path = os.path.join(out_dir, f"{name}.png")
    cropped.save(png_path, "PNG", optimize=True)
    
    # Also save as full-res WebP for ultimate speed and sharp display
    webp_path = os.path.join(out_dir, f"{name}.webp")
    cropped.save(webp_path, "WEBP", quality=95, method=6)
    
    # Also save @2x and @1x if desired
    w, h = cropped.size
    # 2x:
    cropped_2x = cropped.resize((w // 2, h // 2), Image.Resampling.LANCZOS)
    cropped_2x.save(os.path.join(out_dir, f"{name}@2x.webp"), "WEBP", quality=92)
    # 1x:
    cropped_1x = cropped.resize((w // 3, h // 3), Image.Resampling.LANCZOS)
    cropped_1x.save(os.path.join(out_dir, f"{name}@1x.webp"), "WEBP", quality=92)
    
    print(f"Successfully exported {name} in PNG and WebP (@1x, @2x, @3x).")

print("All characters processed successfully!")
