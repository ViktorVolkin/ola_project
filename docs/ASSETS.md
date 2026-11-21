# OLA — supplied development assets

## Runtime package

`public/assets/` contains all 82 supplied working assets: 73 JPG photographs/mock images, 8 SVG icons and 1 PNG decoration. They are project files, not dependencies on the ignored `ola_dev_design/` directory. Public URLs start with `/assets/` and do not have a locale prefix.

`docs/assets-manifest.json` retains the source package paths (relative to `public/`), byte sizes, SHA-256 and raster dimensions. `npm test` verifies file integrity. Reference renders are not included in the public runtime package.

## Status and usage

- The images are owner-approved development mocks approximating real imagery. Most are expected to be replaced; some may remain. They are valid implementation inputs, not proof of final photography approval or rights.
- Do not silently replace supplied assets with stock images, generated alternatives or gradients. Final production selection and rights must be confirmed before publication.
- Baked text in a photograph is not editable UI, a translation source or a verified business promise.
- Use responsive crops and explicit dimensions. Store image paths, alt text and any focal point with the owning content record when that record is introduced; preserve its semantic ID across image replacements.
- On replacement, update the manifest size/hash/dimensions and the affected content mapping. Use a new filename/versioned URL when required for cache invalidation. Review crops and wrapping after the change.
- `assets/icons/` is the supplied SVG set; circular/blush backgrounds belong to CSS, not new raster icon cards.
- `assets/decorative/story_botanical_transparent.png` is the supplied botanical decoration.
- Great Vibes lettering is editable text; the old raster lettering package is intentionally absent.

## References and fonts

Optional local references remain under the ignored `ola_dev_design/references/`. They are QA/fallback inputs, not frontend assets and not a build dependency. Figma remains the authoritative visual reference; it was not opened during foundation setup.

Fonts use `next/font/google` in `src/styles/fonts.ts`: Manrope and Cormorant Garamond are variable fonts, Cormorant retains normal/italic, and Great Vibes uses400. All three request Latin, Latin Extended and Cyrillic subsets. Next downloads font assets at build time and self-hosts them; visitors do not contact Google. No manually vendored font files or pinned upstream copies remain. Migration/glyph evidence is recorded under `docs/qa/fonts/`.
