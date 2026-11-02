# Logo assets

- cieplo.svg: user-provided pelne_czarne.svg, unchanged.
- steady.svg: https://steadydigital.pl/wp-content/uploads/2023/12/LOGO.svg
- zero-camps.png: https://images.squarespace-cdn.com/content/v1/623f889c51cf166afd56bd2f/9d85a5f1-aeb6-49c1-9251-5a1cd2b24636/zerocamps_logo_poziom1.png?format=1500w
- human.png: https://wehuman.io/wp-content/uploads/2024/11/human-logo-stopka-1.png
- kiss-digital.svg: original inline mobile logo from https://kissdigital.com/ (standalone SVG wrapper).

Official website assets match the inline images supplied in chat. Stored locally to avoid runtime dependence on third-party sites. Marks retain their original colors.

- zguda.com.png: previous user-supplied logo uploaded to GitHub in commit 31baa2e. Original PNG retained unchanged.
- logo-plotno.png: current user-supplied canvas logo uploaded to GitHub in commit eeb00a2. Original 2172 × 724 PNG retained unchanged and used in the header and footer. Its outer cloth margins fade into the page with a CSS mask; the lettering is left opaque and the bitmap is not clipped.
- canvas-tile.png: 320 × 320 seamless tile sampled from the blank upper-left cloth of logo-plotno.png. The source crop is (16, 16)–(176, 176), in pixels. Four copies form the tile: original top-left, horizontal reflection top-right, vertical reflection bottom-left and both reflections bottom-right. Opposite edge rows and columns match exactly. Displayed at the logo's source-pixel scale: tile width = logo's visible width × 320 / 2052. A shared responsive width keeps the weave density consistent with both header and footer marks (220 px desktop, 140 px mobile); no generated replacement texture.
- src/logo-relief.bin: numerical relief data reconstructed from logo-plotno.png by scripts/build-logo-relief.py. The uploaded image and tile remain unchanged. Directional integration of smoothed luminance approximates the raised surface; the file stores 16-bit height, original low-frequency lighting and a coverage mask in a 768 × 256 RGBA grid, prefixed by an RLF1 size header. Used only for pointer-controlled lighting; the original bitmap remains the static and accessibility fallback. No replacement lettering or generated brand artwork is used.
