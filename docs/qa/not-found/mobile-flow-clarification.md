# Mobile body flow — ambiguity resolved, no runtime edit

Source: direct Lead Designer response based on his previously personally verified native readback, not a new plugin read or runtime acceptance.

At M360, wrapper160:6131 is320×75 at support-local(0,0), vertical gap0, centered cross-axis. Figma uses three separate25px-high TEXT nodes:

| Node | Wrapper-local x/y | Size | Characters |
|---|---|---|---|
|160:6133|66.5/0|187×25|We couldn’t find the page|
|160:6135|60.5/25|199×25|you’re looking for. Let’s find|
|160:6136|51/50|218×25|you something lovely instead.|

Those widths are natural widths of separate line nodes, **not** an approved max-width218 for one paragraph. Characters contain no explicit newline; the Figma split created the three lines.

The existing developer note requires one semantic paragraph,320px available width and Manrope Regular16/25, with natural wrapping/localized growth. Designer explicitly permits the actual two-line50px English paragraph and content298 rather than323; actions may rise25px with it. Preserve support gap20 and inter-button gap12, top/artwork positions and all other constraints. Do not add min-height75, blank lines, forced breaks or a narrower artificial text box.

Disposition: the captured Mobile height delta is a documented, permitted browser-flow difference, **not a confirmed defect**. Existing source already implements this rule, so no CSS/JS/translation edit or new build is necessary for this clarification. Original reference/capture JSON retains the measured Figma snapshot and raw delta unchanged.

This does not approve the whole page, translations, motion, runtime QA or release. The independent SSR/no-JS framework blocker remains open.
