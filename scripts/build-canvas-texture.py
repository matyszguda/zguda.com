"""Export soft, prefiltered canvas grain at its native CSS size.

Authoring only (Pillow). Original material and logo files stay unchanged.
Lanczos removes subpixel weave before the browser sees it; wrapped smoothing
includes neighboring repeats so the tile boundary is filtered like its interior.
"""
from pathlib import Path
from PIL import Image, ImageFilter

root = Path(__file__).resolve().parents[1]
size = 128
source = Image.open(root / 'public/logos/canvas-uniform.webp').convert('RGB')
sample = source.resize((size, size), Image.Resampling.LANCZOS)
neighbors = Image.new('RGB', (size * 3, size * 3))
for y in range(3):
    for x in range(3):
        neighbors.paste(sample, (x * size, y * size))
soft = neighbors.filter(ImageFilter.GaussianBlur(1)).crop((size, size, size * 2, size * 2))
output = root / 'public/logos/canvas-soft.webp'
soft.save(output, format='WEBP', lossless=True, method=6)
assert Image.open(output).convert('RGB').tobytes() == soft.tobytes()
print(f'{output.name}: {size} × {size}, {output.stat().st_size:,} bytes')
