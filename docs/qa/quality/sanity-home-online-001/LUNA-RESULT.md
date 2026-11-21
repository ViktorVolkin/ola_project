# Luna scoped current-source Presentation verification

**Result: PASS for the scoped local synthetic verification; final post-run binding/port guard BLOCKED.** No source or harness edits made during execution. No deployment, cloud read/write, content publish, real login, or photo upload occurred.

## Commands and identities

Executed the prepared foreground sequence from `/workspace` using the pinned Node 24.22.3 environment: `verify-binding.py --ports`; `current-build.mjs`; `verify-binding.py --built --ports`; `current-browser.mjs`; and final `verify-binding.py --built --ports`.

- Preflight: PASS; 296 source files checked, 290 compared against the frozen release fixture; all four ports initially free.
- Synthetic Next build and isolated Sanity Studio build: both exit 0. Synthetic Next BUILD_ID `Ttje3vjrDZBdrR_qghiex`; 46,492,271-byte fixture, 290 built files hashed. Studio preview origin configured only as localhost.
- Built binding: PASS, including source/build hashes and ports.
- Browser driver exit 0; `failure` absent, `errors=[]`, `studioConsole=[]`. Actual Studio Presentation loaded the local synthetic homepage. EN/RU/SR title edits were saved via Studio and appeared in the preview after mutation refresh; each changed only synthetic draft data, with public fixture title unchanged. 21 locale-specific section save-refresh flows (7 per locale) and 190 recorded exact-path field clicks (includes image-field mapping, not uploads). 29 checks: three public-release locales, three unauthenticated draft-isolation locales, ten security-control cases, three mobile-source locales, and CHIPS, parent-origin, served-client, draft-render and exit checks. Eleven served client assets matched the built fixture and had no read token. No browser error or Studio console error.
- Browser cleanup terminated only its spawned release/synthetic servers and closed owned APIs; its explicit rebind checks passed for 42241, 42242, 42244 and 3333.
- Final standalone `verify-binding.py --built --ports` **failed** at the port guard with `OSError: [Errno 98] Address already in use`. Follow-up non-listening bind diagnostic found 42242 and 42244 still unavailable while 42241/3333 were bindable; TCP connect probes found no listener. Did not retry, kill any process, or repair port state. This post-run guard therefore remains unresolved despite the browser driver's cleanup/rebind checks.

## Evidence / limits

Artifacts are in `current-run/`: build/browser results and logs, binding logs, Studio screenshots and visible-text capture. `browser-results.json` records counts and locale workflow details. All Sanity API/auth/assets are synthetic mocks; Next and Studio are local built applications. This is not proof of Google/Sanity cloud authentication, live Viewer permission, actual asset upload/replacement, hosted Studio identity, deployment, or production variables. Existing full suite remains 473 passed / 228 failed / 1 skipped (historical; not rerun). Protected checkpoint, historical packet, shared ledger/routing and source tree were not edited. No owned server remains by browser-run results; the final ephemeral port conflict is unexplained. Supervisor review and owner-controlled cloud/deployment gates remain required.
