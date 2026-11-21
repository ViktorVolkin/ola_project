# Continuation 2 — local build and browser evidence

Inherits prior checkpoints without replacing history. Not technically ready: no populated-CMS rendering/crop proof or cache-refresh test, no owner login/publication and no Supervisor review. Prior attempt `deleg_85712514`: 33 API calls, 425.3 s child / 425.47 s batch, cost unknown.

## Changes

- Lead authorized the single unrelated lint correction: `gallery-swiper-001/measure.mjs` removes only unused `expected` binding while preserving the same `JSON.parse(fs.readFileSync(...))` evaluation and its exceptions. Original bytes are `before/measure.mjs.txt`, sha256 `5ef489e75615b3e8bc71c5ad3900de88b7cfc536336e10ec0e26e38670497cee`; `measure-fix.diff` records change. Original lint failure remains in CONTINUATION.md.
- `studio/scripts/prepare-seed.mjs` locally produces a text-only `drafts.homePage` NDJSON and separate 14-photo manifest from current source/EN/RU/SR; no network, no upload, no credentials. It checks all listed files exist; image refs are intentionally absent until a manager uploads and attaches photos. `seed-final-dry-run.json` and `.ndjson` are generated local evidence, not uploaded. RU/SR remain translation drafts. `studio/README.md` describes owner CORS/login and review boundaries. Import command and an actual Sanity import still require owner-led implementation/verification; this is not yet a complete import workflow.
- Configured root `npm run lint` exit 0 after correction, and after adding the seed script. Root full Vitest: 11 files, 56 tests, exit 0 after current product edits. Earlier root configured `tsc --noEmit --incremental false` exit 0; generated typecheck on the isolated build was performed by Next.

## Real build/browser

A selective private Next fixture `.local-tools/ola-qa/sanity-home-fixture` (node_modules symlink to existing root; Studio deps excluded) had a fresh `next build --webpack` exit 0, 23 static pages. Size after browser run `181M` (`du -sh`; not exact bytes); BUILD_ID `HBRNjlNqWneLDTF57mG9k`. Source adapter sha256 `26e596176ba7685e7430825b4883248365261ed77b3ecab4c5f5384f5783d8ac` matches the copied fixture; package sha256 `6a61f1f51c602cd3cde12e48e853906dd8c60f83d45b8facd072d66e39908f2a` matches. Full source/dependency identity and served static hash witnesses are not yet established. The build and serving logs show CMS unavailable/incomplete fallback for EN/RU/SR; logs do not distinguish empty result from invalid result, so this alone is not proof of a live empty dataset.

`browser-fallback.mjs` against that build exercised EN/RU/SR × 360/768/1024/1440: 12 HTTP 200, zero document horizontal overflow, no broken decoded images, no browser page/console errors; data and screenshots are `fallback-results.json` and `fallback-*.png`. It did not assert all links/interactive behaviors, visually compare prior geometry, validate source API contents, or inspect populated CMS. `served-en.html.txt` SHA256 `ea68d9f7c3e192d05d52acdb8ea229baaf0b650a0bc5b9577f2fd5e2ec03b9e6`; `served-headers.txt` records headers. Actual full before/after crop comparison remains outstanding.

Static `studio/dist` served at `http://127.0.0.1:42180` displayed HTTP 200, “Connect this Studio to your project / Add CORS origin”, not login. Screenshot and result: `studio-login.png`, `studio-login.json`. Owner must authorize the actual chosen Studio origin in Sanity CORS before actual standard account login can be tested. No credentials entered, no deploy or remote mutation.

Processes were task-owned. Initial tracker kills left child processes alive; `/proc` cwd and parentage identified the fixture Next child and Studio http.server child, which were terminated. Both 42179 and 42180 passed actual bind after cleanup (`verify-ports.mjs`); port 3100/root .next were not used.

## Remaining

Perform genuine simulated complete published-document browser coverage and synthetic-image crop/hotspot pixel/geometry tests; verify or correct role aspect hints, i18n, routes and disabled enquiry state; real publication revalidation test/limits; fully usable authorized seed/import procedure; source/served static/dependency identity and retained raw build/check logs. Owner CORS/login/deploy/actual publish remains an external gate; no live publication is claimed. Sol Supervisor mandatory after deterministic technical work is green.
