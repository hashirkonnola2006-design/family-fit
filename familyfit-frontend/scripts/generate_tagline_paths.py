from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
import json

font = TTFont('public/brand/PlusJakartaSans.ttf')
glyphSet = font.getGlyphSet()
cmap = font.getBestCmap()

text = "Healthy Families  •  Happier Lives"
scale = 0.028 # scale font units to SVG viewBox units
paths = []
x_cursor = 0

for char in text:
    if char == " ":
        x_cursor += 320 * scale
        continue
    code = ord(char)
    if code in cmap:
        glyph_name = cmap[code]
        glyph = glyphSet[glyph_name]
        pen = SVGPathPen(glyphSet)
        glyph.draw(pen)
        d = pen.getCommands()
        width = glyph.width * scale
        if d:
            paths.append({
                "char": char,
                "d": d,
                "x": x_cursor,
                "scale": scale
            })
        x_cursor += width

with open('public/brand/tagline_vector.json', 'w') as f:
    json.dump({
        "total_width": x_cursor,
        "glyphs": paths
    }, f, indent=2)

print(f"Generated tagline vector paths: {len(paths)} glyphs, total_width = {x_cursor:.1f}")
