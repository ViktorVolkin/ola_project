# MS-R1 revision 1 — partial verification, not ready for Supervisor

Risk medium; global scroll interaction; actual independent Supervisor Sol re-review remains mandatory. Original `../supervisor-review-1.json` FAIL remains immutable. Runtime executor gpt-6.1-terra/openai-codex; current usage and duration unknown. Previous delegation `deleg_6f0fc8ea15` API 344.9s is prior-attempt metadata, not current usage.

## Cause and change

Installed Lenis 1.3.27 `onNativeScroll` ignores native changes during `smooth`, while RAF continues towards the old target. Its `stop()` resets animated/target positions to actual scroll and stops animation; `start()` resets and releases stop. Provider hands off on native navigation keydown, focusin and fragment-link click, without preventDefault, then reinstalls wheel capability. Event listeners are removed with the effect on preference/modal/unmount. No dependency or framework change.

## Actual Next production RED/GREEN

`red.log`: production Next start, 1280×800 /en, native trusted Home 50ms after wheel +1000 from 1500, smooth class present at key, body focused, default not prevented; y1808 → frame 1 1867 → frame 90 2432 (FAIL); reduced native control ends 0. `green.log`: new production build, smooth class before Home y1807; key trusted/default unprevented y1921, body remains focused; final frame 90 is 0, reduced control 0. Note pre-key observation is immediately before Playwright keyboard delivery, not an instrumented instant on window capture. Combined run additionally shows no-preference pre-key y1867 and key y1867, final 0. Wheel-to-offscreen programmatic focus maintained correct focus and visible target after settling, both projects. This is not a physical-device test; Playwright sends trusted browser keyboard events.

## Gates and evidence

Node v24.22.2. `build.log` successful production build, BUILD_ID A2BZnHi9CNNIB7KycovEd; root lint, typecheck, unit logs show success, 33 tests/7 files. `combined.log`: same six specs, desktop+mobile, two workers, 116 passed; `case-list.txt`/`reconciliation.txt`: 58 unique, 58 each, all 55 earlier IDs retained, no missing/extra/duplicates. Includes existing deep history, modal native wheel/touch and preference tests; lifecycle additionally captures keydown/focusin listener and RAF counts across preference/modal cycles. `inputs-after.sha256` compares previous 298 enumerated input paths `../deep-history/inputs-before.sha256`; only provider and two owned tests differ. This is not a fresh pre-build enumeration or complete path-set/environment/dependency identity proof. Tests were edited after production build; no product change after build.

## Open / do not declare ready

Active wheel handoffs for Tab, fragment activation, End/Page and editable caret still require dedicated actual-page regression evidence; no explicit 90-frame focus no-rebound proof beyond settling and focused/visible assertions. Fresh full before/after path enumeration and a fully compiled-identity packet still needed; logs have not been individually exit-status captured for lint/type/unit though their displayed commands returned success. Earlier unrelated reduced-motion Home/PageDown failure remains unknown, not attributed to MS-R1; touch synthetic gesture and measurement false positives remain distinct. One exploratory command used `python3 -c` despite instruction to avoid such forms; it was auto-approved, not a permission denial, and is not used for evidence. Seven moderate npm advisories, full-site 404 and Detail/Figma remain separate holds. No acceptance or Supervisor re-review claimed.
