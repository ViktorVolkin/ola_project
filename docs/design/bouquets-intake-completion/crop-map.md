# Bouquet photograph placements — reference geometry

Machine-readable [crop-map.json](crop-map.json) contains all 57 individually identified IMAGE placements, verified public SHA-1, intrinsic dimensions, viewport/image rectangles, mask where applicable, and calculated source bounds. Byte identity of all 12 public files and their native-fill exports was rechecked. Counts: cards 8/8/8; selector thumbnails 5/5/5; seasonal 4/4/4; hero/custom 2/2/2 (desktop/tablet/mobile). All 57 leaf IDs are distinct.

Coordinates are reference Figma pixels; image rectangles are local to the photo instance, and seasonal montage offsets are viewport-local. `visibleSourceBoundsPx` is [left, top, right, bottom] in original-source pixels. Formula and intersection are embedded in JSON. **Limitation:** native `get_node` and leaf `get_design_context` expose FILL/FIT but not an image transform. The calculated numbers use the normal centered FILL/FIT recipe; these are conditional, not proof of a serialized transform or of a rendered visual match. Do not introduce arbitrary offsets. Clip/mask intersection is rectangular bounding geometry; alpha edges and image content can further limit visible pixels.

| Kind | D viewport | T viewport | M viewport | Paint |
|---|---:|---:|---:|---|
| Card photo | 300×360 | 338×400 | 150×200 | FILL, image rect (0,0) equals viewport; card/grid ancestors identified in JSON |
| Selector photo | 64×72 | 64×72 | 48×56 | FILL, radius 4; thumbnail instance itself does not clip |
| Hero | 760×600 | 768×500 | 360×360 | FILL, image rect (0,0) equals photo |
| Custom | 816×400 | 704×380 | 320×300 | FILL, image rect (0,0) equals photo |
| Seasonal | 204×200, alpha mask (7,0,190,200) | 164×184, full mask | 152×180, full mask | Single 1800×1335 montage, FIT into 816×606 image rect; offset x D/T 0,-204,-408,-612; M -26,-230,-434,-638; y -203. Not four independent images. |

FIT has a subtle aspect-ratio inset; JSON computes it rather than rounding it away. Snapshots do not require fixed page widths or fixed text heights. Photo selection/rights and browser visual parity remain separate gates. Seasonal viewport and mask IDs, and editorial section/instance IDs, are recorded per placement; section-level ancestors not affecting the measured photo rectangle are not expanded.
