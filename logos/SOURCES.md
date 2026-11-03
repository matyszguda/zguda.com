# Logo assets

- cieplo.svg: user-provided pelne_czarne.svg, unchanged.
- steady.svg: https://steadydigital.pl/wp-content/uploads/2023/12/LOGO.svg
- zero-camps.png: https://images.squarespace-cdn.com/content/v1/623f889c51cf166afd56bd2f/9d85a5f1-aeb6-49c1-9251-5a1cd2b24636/zerocamps_logo_poziom1.png?format=1500w
- human.png: https://wehuman.io/wp-content/uploads/2024/11/human-logo-stopka-1.png
- kiss-digital.svg: original inline mobile logo from https://kissdigital.com/ (standalone SVG wrapper).

Official website assets match the inline images supplied in chat. Stored locally to avoid runtime dependence on third-party sites. Marks retain their original colors.

- ../logo_zguda.png: current user-supplied smooth-background logo, uploaded in commit 9015721. Original 1672 × 941 PNG retained unchanged and used in every header and footer. Visible layout uses source rectangle (100,300)–(1572,666); the full bitmap's blank margins are feathered with CSS (X 6–94%, Y 30–72%) while the lettering and shadows remain opaque. Solid page color #EFE8E4 matches the surrounding material; monochrome modes use matching gray backgrounds.
- zguda.com.png: previous user-supplied flat logo, uploaded to GitHub in commit 31baa2e. Original 1983 × 793 PNG retained unchanged as an unused asset.
- logo-plotno.png: previous canvas logo uploaded to GitHub in commit eeb00a2. Original 2172 × 724 PNG retained unchanged as an unused asset. The cloth embedded in the bitmap could not blend consistently with the background across displays, so the site uses the flat mark.
- canvas-tile.png: previous 320 × 320 sampled tile, retained as an unused asset. Its mirrored quadrants caused a visible grid at small sizes.
- canvas-uniform.webp: 1254 × 1254 source material prepared with image_gen using logo-plotno.png as the material reference. Retained as an authoring source; it is no longer rendered directly. Scaling its regular 6–8 px weave down to subpixel widths caused display-dependent moiré.
- canvas-soft.webp: unused previous background, exported from canvas-uniform.webp with scripts/build-canvas-texture.py. Retained as an archive; the site now uses a solid white background without texture images.
