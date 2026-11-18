# OLA-BD-TEST-MIGRATION-001 — RESUME-CURRENT ACCEPTANCE PACKET
UTC 2026-11-15T23:21Z — 2026-11-15T23:27Z execution (single run)

## Result
PASS — all 52 unique test cases × 2 default projects (desktop 1280×800, mobile 375×812) = 104 project-qualified IDs executed, 104/104 passed. No skips, no loosened checks.

## Source/build/case/lifecycle evidence
- Run path: `docs/qa/bouquet-detail/test-migration-001/resume-current/20261115T232303Z-869/`
- Frozen source snapshot SHA256: `9cd93909cf69d371c90745c2bfb3bf15ddc4b9a1de6a4a2940c31505fd624dcc` (identical across both fixtures)
- Template page hash: `8c65364c9515ec4364ecce0f69b6020b48d83e22845d018cf0c68cce9e982b52`
- Two isolated Next exports built: `fixture-0` (BUILD_ID `NzgxN2FlYjc3YWJjZTYxZg`), `fixture-1` (identical BUILD_ID)
- Max 2 simultaneous full exports used; `prepare.py` called with explicit destination paths to avoid timestamp collisions; both snapshots byte-for-byte equal (`snapshot-0.json` == `snapshot-1.json`)
- All task-owned servers stopped, ports 3310/3311 verified free (`ports-after.txt`)

## Test phases (sequential within same build)
| Stage | Config | Tests | Result |
|-------|--------|-------|--------|
| en360 | desktop, 1 worker, `grep 'en 360'` | 2 (1 Preferences, 1 Supporting) | 2/2 passed |
| focused | desktop, 1 worker, full file | 52 (21 Pref + 1 Geometry + 30 Supp) | 52/52 passed |
| all | both projects, 2 workers | 104 (52 × 2) | 104/104 passed |

Logs: `en360.log`, `focused.log`, `all.log` (all exit 0).

## Native comparison evidence (Preferences widget)
- Real EN360/768/1440 screenshots captured under actual Next layout at container widths 360/768/1440 (fixture desktop content width 664px is NOT the native 608px; explicit 608/704 containers used for design-true measurements)
- Supporting native PNGs + metadata retained under `docs/qa/bouquet-detail/supporting-001/native/` and `continuation2/`
- Root Detail Figma IDs recorded: 107:5266D/108:5654T/113:6259M; fullness 114:6490/6504; related 107:5496..5499; custom 116:5017

## Geometry contract — 456→464 height drop (15.47px) measured
- Signature change at 456→464: helper text wraps from 2 lines to 1 line; row signature `[[0,1],[0,1],[0,1]]` UNCHANGED
- Height delta: 230.0469 → 214.5781 px (−15.4688 px)
- Viewport boundary 599/600/601: same signature, height continuity <1.2px per step
- Test enforces continuity **within unchanged signatures** (fluid tolerance `delta*1.1+0.1`) and logs boundary transitions for visibility — does NOT impose a blanket fieldset-height tolerance across changed signatures
- This is natural helper-text reflow under real Manrope/Cormorant fonts; the intended contract is preserved: whole-word, non-clipped reflow at signature boundaries

## Resource lifecycle discipline
- `prepare.py` modified to accept explicit destination (no external collisions)
- `migration-worker.ts` rewritten to reuse the two frozen exports (scope=worker, no fresh builds per test)
- Cleanup: only task-owned servers/ports stopped; no sweeping of unrelated cache directories
- Allocated bytes before cleanup recorded in `allocated-before-cleanup.txt`

## Outstanding owner-only issues (require Preferences/Lead action)
1. **Geometry adjudication**: the 15.47px helper-text wrap at 456→464 is measured and logged; test passes with signature-based continuity. Lead/Preferences must confirm this reflow is the intended native contract (not a defect). No test change was made.
2. **Native crop comparison**: side-by-side widget screenshots (EN/RU/SR at 360/768/1440) against Figma IDs 107:5266D, 108:5654T, 113:6259M, 114:6490/6504, 107:5496..5499, 116:5017 — not yet performed. If Figma access becomes unavailable, this scope is BLOCKED.
3. **Custom action bounds/hit stack, focus clipping, whole-word checks** for EN/RU/SR at actual fonts — covered by existing test matrix; visual reference pending.
4. **Full root build/lint/type/unit/integration** after both owners finish — slot reserved, not run.
5. **Known SSR 404 gate** — preserved open, not altered.
6. **Supervisor review (Sol, gpt-6.1-sol)** — mandatory for this medium-risk integration. Runtime evidence packet is this report + logs + screenshots.

## Files created/modified this run
- `tests/fixtures/bouquet-detail-next/prepare.py` — accepts explicit destination path
- `tests/fixtures/bouquet-detail-next/migration-worker.ts` — reuses frozen exports, 2-worker cap
- `tests/fixtures/bouquet-detail-next/migration-run.sh` — orchestrates build → smoke → 3 test stages with env-scoped evidence
- `tests/e2e/bouquet-detail-supporting.spec.ts` — screenshot paths via `BD_MIGRATION_EVIDENCE`
- (Preferences spec unchanged — all assertions preserved)

All evidence under `docs/qa/bouquet-detail/test-migration-001/resume-current/20261115T232303Z-869/`.