# Bouquet copy and style — reference states

Native OLA session `id-mwg48w7s-pk38p8wa`; D/T/M hero, custom, compact selector and seasonal section reads, plus three persisted card subtrees. Pixel sizes are reference measurements, not fixed localized heights. D/T/M mean desktop/tablet/mobile. Reuse shared Header/Footer; they are not part of this intake. Palette: ivory #FAF7F2, ink #241E1B, secondary #655C56, burgundy #641323, primary-button text #FFF9F3. Color values rounded from native floats.

## English copy

| Section | Exact text |
|---|---|
| Hero | `Home / Bouquets`; `Bouquets`; `Flowers for every moment.`; `Explore bouquet styles, colours and floral moods. Choose an inspiration or tell us about something personal.`; action `Explore bouquets`; script `More than just\nflowers`. |
| Selectors | `All bouquets`; `Soft & Romantic`; `Bright & Joyful`; `Natural & Airy`; `Statement`. |
| Inspiration | `BOUQUET INSPIRATION`. Cards, in order: `Soft Romance`, `Natural & Airy`, `Peachy Mood`, `Wild Beauty`, `Sunset`, `Lavender Haze`, `Garden Style`, `Natural Beauty`; each action `Enquire`. |
| Custom | `LET OLA CREATE.`; `Not sure\nwhat to choose?`; `Tell us the occasion, mood and budget. We can discuss a bouquet direction that feels personal to you.`; action `Request a custom bouquet`. |
| Seasonal | `SEASONAL INSPIRATION`; `What’s in season.`; `Seasonal flowers can inspire different colours and textures. Ask us which flowers and styles are available for your date.`; `Spring`, `Summer`, `Autumn`, `Winter`. |

`\n` denotes the explicit native heading/script reference break, not permission to insert breaks into paragraphs. Paragraphs are semantic continuous flow; no fixed line counts, spacer heights, or per-line TEXT fragments. EN/RU/SR must grow naturally; translated text remains subject to semantic review.

## Type and controls

| Element | D | T | M | Color / other |
|---|---|---|---|---|
| Hero breadcrumb | Manrope 400 13/18 | same | same | secondary; zero tracking |
| Hero title | Cormorant Garamond 500 80/78 | 56/58 | 38/40, −2% tracking | ink |
| Hero subtitle | Cormorant Garamond 500 24/30 | 22/28 | 22/28 | ink |
| Hero script | Great Vibes 400 36/40 | 36/40 | 32/36 | burgundy |
| Eyebrows custom/seasonal | Manrope 500 12/18 | same | same | secondary, 1.2px tracking |
| Custom/seasonal heading | Cormorant Garamond 500 52/54 | 52/54 | 32/34, −1% tracking | ink |
| Body | Manrope 400 16/25 | same | same | secondary; PRETTY |
| Selector | Manrope 400 14/20 | same | same | ink; All is 500 burgundy |
| Card title | Cormorant Garamond 500 22/26 | 22/26 | 18/22 | ink; PRETTY |
| Enquire / primary CTA | Manrope 500 14/20 | same | same | zero tracking; Enquire ink, primary ivory |
| Seasonal caption | Manrope 400 14/21 | same | same | centered |

Primary CTA: burgundy background, 48px high, 24px inline padding, 12px gap, 24px radius, 16px arrow. D/T Enquire reference: transparent, inside 1px #D9CCC4 stroke, radius 24, 48px height, inline padding 24, gap 12, 16px arrow. Mobile reference Enquire: transparent unbordered compact 48px action box, gap 8, 16px arrow. Disabled preview has no native enabled interaction or hover; localized pending reason must remain visibly readable.

## Layout / surfaces

| Section | Desktop | Tablet | Mobile |
|---|---|---|---|
| Hero | 1440×600; photo 760×600 at (680,0), copy 480 wide at (80,104), 16 gap; script in 220×100 frame at (680,32). | vertical; top 40, bottom 32, gap 24, copy width 704 and gap 16; photo 768×500. | copy panel padding 20, gap 16; CTA/script gap 20; full-bleed 360×360 photo. |
| Selector | five across; white, radius 4; selected All 2px burgundy, others 1px muted #D6CCC4 approximately. | All 704×96 then 2×2 340×96, horizontal gap 24, row gap 16; padding 12, image gap 12. | All 320×84 then 2×2 152×84, gaps 16; padding 12, image gap 8. |
| Grid | 4×2, 24px gaps; card 302×476, photo 300×360, caption width 300. | 2×4, gaps 24; card 340×520, photo 338×400, caption width 338. | 2×4, gaps 16; card 152×352, photo 150×200, caption 150×150 snapshot. |
| Caption | vertical padding 16, gap 8, HUG; label 268 wide. | same; label 306 wide. | padding 12, SPACE_BETWEEN in native fixed 150px plane; do not hard-fix caption height when localized reason or wrapping requires growth. |
| Custom | section padding 64px 80px, band gap 32, copy 432 wide, photo 816×400. | padding 40px 32px, gap 24, copy 704 wide, photo 704×380. | padding 32px 20px 24px, gap 24, copy 320 wide, photo 320×300. |
| Seasonal | padding 64px 80px; band gap 32, copy 432 wide, montage 816 wide, 4 columns gap 0. | padding 40px 32px; copy-to-grid gap 16, 4 columns gap 16. | padding 32px 20px; copy-to-grid gap 16, 2×2 gap 16. |

Card surfaces ivory #FAF7F2, inside 1px #D9CCC4 stroke, radius 4; copy vertical. Seasonal tiles have 8px photo-to-caption gap. D hero 420×600 overlay at x560 and D custom 160×400 overlay at x432 in band: left-to-right linear ivory (RGB approximately 250,247,242), stops 0/.96, .40/.90, .61/.63, .82/.08, 1/0. No equivalent overlay was present in compact hero/custom reads. Desktop/T hero/custom copy stacks and seasonal copy use gap 16. Snapshots are not fixed responsive breakpoints.

Details and per-card native ids/properties: `native-desktop-inspiration.json`, `native-tablet-grid.json`, `native-mobile-grid.json`; [crop map](crop-map.json); pre-existing [editorial type/copy](../bouquets-editorial-copy.json). No browser or visual acceptance is asserted.
