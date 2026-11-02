"""Reconstruct a shallow relief from the supplied logo's lighting, not its lettering.

Authoring only: Python + Pillow + NumPy + SciPy. The site consumes the RGBA data
file directly; no Python or extra JavaScript package is needed at runtime.
The uploaded bitmap and the canvas tile remain unchanged.
"""
from pathlib import Path
import struct

import numpy as np
from PIL import Image
from scipy.ndimage import (
    binary_closing, binary_dilation, binary_fill_holes, gaussian_filter,
)

root = Path(__file__).resolve().parents[1]
width, height = 768, 256
source = Image.open(root / 'public/logos/logo-plotno.png').convert('RGB')
rgb = np.asarray(source.resize((width, height), Image.Resampling.LANCZOS), dtype=float) / 255
luminance = rgb @ np.array([.2126, .7152, .0722])
smooth = gaussian_filter(luminance, 1.2)
shade = gaussian_filter(luminance, 2.1) - gaussian_filter(luminance, 46)

# The source is lit from the upper left. Integrate its directional shading,
# regularizing the unobserved perpendicular slope and very low frequencies.
ky, kx = np.meshgrid(
    np.fft.fftfreq(height) * 2 * np.pi,
    np.fft.fftfreq(width) * 2 * np.pi,
    indexing='ij',
)
along, across = (kx + ky) / np.sqrt(2), (kx - ky) / np.sqrt(2)
relief = np.fft.ifft2(
    -1j * along * np.fft.fft2(shade)
    / (along ** 2 + .08 * across ** 2 + .00003)
).real
relief = np.maximum(relief, 0)
relief = np.clip(relief / np.percentile(relief, 99.8), 0, 1)

# Confine re-lighting to the embossing and its contact shadows. The surrounding
# cloth retains the original photograph, including the existing feathered edge.
area = gaussian_filter(np.abs(shade), 2) > .018
area = binary_fill_holes(binary_closing(area, iterations=3))
area = binary_dilation(area, iterations=8)
coverage = gaussian_filter(area.astype(float), 4)
relief = gaussian_filter(relief * coverage, .65)

# RG: 16-bit surface height, B: photographed low-frequency light, A: coverage.
# Extra height precision prevents bands on shallow bevels. Header: magic + size.
packed_height = np.round(np.clip(relief, 0, 1) * 65535).astype(np.uint16)
data = np.stack([
    packed_height >> 8, packed_height & 255,
    np.round(np.clip(smooth, 0, 1) * 255),
    np.round(np.clip(coverage, 0, 1) * 255),
], axis=-1)
payload = data.astype(np.uint8).tobytes()
output = root / 'src/logo-relief.bin'
output.write_bytes(struct.pack('<4sHH', b'RLF1', width, height) + payload)
print(f'{output.name}: {width} × {height}, {len(payload) + 8:,} bytes')
