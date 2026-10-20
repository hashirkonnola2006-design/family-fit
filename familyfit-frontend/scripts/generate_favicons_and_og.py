from PIL import Image, ImageDraw, ImageFont
import os, re

# 1. Generate public/favicon.svg
with open('src/assets/brand/logo-mark-white.svg', 'r') as f:
    mark_svg = f.read()

# Extract inner paths
paths_match = re.search(r'<svg[^>]*>(.*?)</svg>', mark_svg, re.DOTALL)
inner_paths = paths_match.group(1) if paths_match else ''

favicon_svg = f'''<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <rect width="512" height="512" rx="115" fill="#1F5D3A"/>
  <g transform="translate(68, 68) scale(0.59)">
    {inner_paths}
  </g>
</svg>'''

with open('public/favicon.svg', 'w') as f:
    f.write(favicon_svg)
print('Saved public/favicon.svg')

# 2. Render raster icons: apple-touch-icon.png, icon-192.png, icon-512.png, icon-512-maskable.png, favicon.ico
# Let's draw the app icon using PIL high-res
def create_app_icon(size, corner_radius, safe_pad_ratio=0.15):
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Rounded rectangle background
    draw.rounded_rectangle([0, 0, size, size], radius=corner_radius, fill=(31, 93, 58, 255))
    
    # We can overlay the mark from public/brand/mark_tight.png or draw white mark
    # In tight_mark, we have the white mark from crop_variants or mask
    # Let's load the white mark from white_logo_card or bw_mark
    bw_forest = Image.open('public/brand/bw_mark_forest_tight.png').convert('L')
    bw_leaf = Image.open('public/brand/bw_mark_leaf_tight.png').convert('L')
    
    # Combine both to get mark mask (0=mark, 255=bg)
    mark_w, mark_h = bw_forest.size
    mark_mask = Image.new('L', (mark_w, mark_h), 255)
    
    # Pixels where either is black (0) become 255 in alpha mask
    px_f = bw_forest.load()
    px_l = bw_leaf.load()
    px_m = mark_mask.load()
    
    for y in range(mark_h):
        for x in range(mark_w):
            if px_f[x, y] < 128 or px_l[x, y] < 128:
                px_m[x, y] = 255 # foreground
            else:
                px_m[x, y] = 0   # background
                
    # Scale mark to fit inside icon with safe padding
    target_mark_h = int(size * (1.0 - 2 * safe_pad_ratio))
    target_mark_w = int(mark_w * (target_mark_h / mark_h))
    
    scaled_mask = mark_mask.resize((target_mark_w, target_mark_h), Image.Resampling.LANCZOS)
    
    # Create white mark image
    white_mark = Image.new('RGBA', (target_mark_w, target_mark_h), (255, 255, 255, 255))
    
    # Paste onto img centered using mask
    offset_x = (size - target_mark_w) // 2
    offset_y = (size - target_mark_h) // 2
    img.paste(white_mark, (offset_x, offset_y), scaled_mask)
    
    return img

# Generate icons
icon_512 = create_app_icon(512, 115, safe_pad_ratio=0.18)
icon_512.save('public/icon-512.png', 'PNG')

# Maskable icon (full bleed background, larger padding ~25% for Android circular crop)
icon_512_maskable = create_app_icon(512, 0, safe_pad_ratio=0.25)
icon_512_maskable.save('public/icon-512-maskable.png', 'PNG')

icon_192 = create_app_icon(192, 44, safe_pad_ratio=0.18)
icon_192.save('public/icon-192.png', 'PNG')

apple_icon = create_app_icon(180, 40, safe_pad_ratio=0.18)
apple_icon.save('public/apple-touch-icon.png', 'PNG')

# 32px favicon.ico
fav_32 = create_app_icon(32, 7, safe_pad_ratio=0.14)
fav_32.save('public/favicon.ico', format='ICO')
fav_32.save('public/favicon-32x32.png', 'PNG')

print('Generated all icon files!')

# 3. Generate public/og-image.png (1200x630, cream background, logo centered, subtitle in Plus Jakarta Sans)
og = Image.new('RGB', (1200, 630), (248, 246, 239)) # #F8F6EF
draw_og = ImageDraw.Draw(og)

# Load the logo crop from public/brand/top_left_logo.png
logo_crop = Image.open('public/brand/top_left_logo.png').convert('RGBA')
# Make cream background transparent
logo_arr = logo_crop.load()
for y in range(logo_crop.height):
    for x in range(logo_crop.width):
        r, g, b, a = logo_arr[x, y]
        if r > 230 and g > 230 and b > 220:
            logo_arr[x, y] = (r, g, b, 0)

# Scale logo to width ~560px
target_logo_w = 560
target_logo_h = int(logo_crop.height * (target_logo_w / logo_crop.width))
scaled_logo = logo_crop.resize((target_logo_w, target_logo_h), Image.Resampling.LANCZOS)

# Center logo
logo_x = (1200 - target_logo_w) // 2
logo_y = 150
og.paste(scaled_logo, (logo_x, logo_y), scaled_logo)

# Subtitle text: "Good food. Stronger families."
try:
    font_sub = ImageFont.truetype('public/brand/PlusJakartaSans.ttf', 38)
except:
    font_sub = ImageFont.load_default()

text_sub = "Good food. Stronger families."
bbox = draw_og.textbbox((0, 0), text_sub, font=font_sub)
text_w = bbox[2] - bbox[0]
text_x = (1200 - text_w) // 2
text_y = logo_y + target_logo_h + 50

draw_og.text((text_x, text_y), text_sub, fill=(31, 93, 58), font=font_sub) # Forest Green #1F5D3A

og.save('public/og-image.png', 'PNG')
print('Generated public/og-image.png (1200x630)!')
