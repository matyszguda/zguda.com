# Logo assets

- cieplo.svg: user-provided pelne_czarne.svg, unchanged.
- steady.svg: https://steadydigital.pl/wp-content/uploads/2023/12/LOGO.svg
- zero-camps.png: https://images.squarespace-cdn.com/content/v1/623f889c51cf166afd56bd2f/9d85a5f1-aeb6-49c1-9251-5a1cd2b24636/zerocamps_logo_poziom1.png?format=1500w
- human.png: https://wehuman.io/wp-content/uploads/2024/11/human-logo-stopka-1.png
- kiss-digital.svg: original inline mobile logo from https://kissdigital.com/ (standalone SVG wrapper).

Official website assets match the inline images supplied in chat. Stored locally to avoid runtime dependence on third-party sites. Marks retain their original colors.

- zguda.com.png: previous user-supplied logo uploaded to GitHub in commit 31baa2e. Original PNG retained unchanged.
- logo-plotno.png: current user-supplied canvas logo uploaded to GitHub in commit eeb00a2. Original 2172 × 724 PNG retained unchanged and used in the header and footer. Its outer cloth margins fade into the page with a CSS mask; the lettering is left opaque and the bitmap is not clipped.
- canvas-tile.png: previous 320 × 320 sampled tile, retained as an unused asset. Its mirrored quadrants caused a visible grid at small sizes.
- canvas-uniform.webp: 1254 × 1254 source material prepared with image_gen using logo-plotno.png as the material reference. Retained as an authoring source; it is no longer rendered directly. Scaling its regular 6–8 px weave down to subpixel widths caused display-dependent moiré.
- canvas-soft.webp: current background, exported from canvas-uniform.webp with scripts/build-canvas-texture.py. Lanczos downsampling to 128 × 128 followed by a 1 px Gaussian across a 3 × 3 repeated image and cropping the center filters both the grain and the repeat boundaries. Lossless WebP, rendered at a constant 128 × 128 CSS px on all breakpoints. The original uploaded logo is unchanged; only the background material is prefiltered.
