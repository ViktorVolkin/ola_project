# LUNA-REACT-BUTTON-001 evidence

## Outcome
Implemented a generic React `ActionButton` using `actionClassName` from existing `ActionLink`; adopted only in `EnquiryLink`'s unavailable/disabled branch. Enabled external-link branch, URL builder, translations, CSS, classes and callers' strings remain unchanged.

## Verification and reused actual-Next evidence
- Current SHA-256 exactly matches the final actual-Next source manifest (`green-source-manifest.json`, 249 entries): `ActionButton.tsx` `ca769a335cff95de050e403a97d92ed49a7be6cbb62edda7b80dc2f929611928`; `EnquiryLink.tsx` `26cf5cc30001de7ea283ebdb3023124d99e8f213c7aca0fb4d10c8406740e30d`. No redundant full-site rebuild was run.
- Reused report `docs/qa/bouquet-detail/preferences-001/terra-verification-001/REPORT.md`: actual private Next build `Ihe3tkd8xp6aqCTZdprA8`; 40/40 unique Chromium cases and 13/13 actual DOM measurement cases passed on its frozen 249-entry source. `tests/e2e/bouquet-detail-page.spec.ts` (in that QA run) exercises actual disabled buttons in EN/RU/SR across 320–1440 widths, checks six disabled buttons and `aria-describedby`, keyboard focusability sequence; raw SSR checks each locale. This proves adoption in that frozen build, not a new browser run or universal styling equivalence. Retained screenshots are whole-page/pristine, not component-specific comparisons.
- Current `npm exec vitest -- run tests/unit/action-button.test.ts tests/unit/enquiry-url.test.ts`: PASS, 2 files / 13 tests (2 ActionButton SSR tests + 11 existing URL tests). SSR asserts native default/explicit `type`, children, class variants/custom class, disabled, aria and data attributes.
- Current scoped ESLint command on ActionButton, EnquiryLink and its unit test: exit 0.
- No new source change was needed. No owned Next build or new browser/screenshot run. `tests/fixtures/action-button` remains a fixture template; its existing `test-results` error-context explicitly says no fixture run was performed.

## Supervisor-returned corrections and final disposition

- BUTTON-R1: preserved all runtime/data assertions; moved the props object into a named inferred object before `createElement`, avoiding excess-property rejection of a fresh literal while retaining the exact `data-enquiry-subject` value and SSR assertion. No unsafe cast and no production component change.
- BUTTON-R2: replaced cast-only `includes` check with `supported.find(candidate => candidate === locale)`, then used the narrowed `validatedLocale` for the message import and returned locale. Unsupported/missing locale still calls `notFound()`; no fallback policy added.
- After the above correction, the historical project command exited 2 only for unrelated TS7053 at `tests/unit/model-quality-summary.test.ts:27` (`typecheck-after.log`). This was not a Button defect; a separate Luna metrics correction later resolved it. Do not conflate that external observation with Button implementation or rework.
- Scoped Vitest: 2 files / 13 tests PASS; captured `scoped-vitest.log`. Scoped ESLint including fixture: exit 0; captured `scoped-eslint.log`. No Next typegen/build or browser rerun; reused frozen proof is applicable because ActionButton and EnquiryLink hashes remain unchanged: `ca769a335cff95de050e403a97d92ed49a7be6cbb62edda7b80dc2f929611928`, `26cf5cc30001de7ea283ebdb3023124d99e8f213c7aca0fb4d10c8406740e30d`.
- Current changed test SHA-256 `1779848d6afeb478d00b887980cc5a0466caaec1cedd8d899917349f5de0b81f`; fixture SHA-256 `2f3254769730c146bb540ca349454292ff9a8e1f89a00bb098a75c3bac3ee7c0`.

## Final disposition: bounded technical acceptance
- Actual independent `@supervisor` profile / `gpt-6.1-sol` review 2 PASS (`supervisor-review-2.json`) explicitly resolves BUTTON-R1 and BUTTON-R2. Review 1 remains FAIL in its original receipt; corrections and the later PASS do not rewrite it.
- Current independent project `tsc` exit 0, scoped ESLint exit 0, and 13/13 SSR/URL tests pass. Current 249-source frozen manifest hashes unchanged; reused actual-Next evidence remains exactly as scoped above. Review 2 confirms no new blocker.
- Accepted scope is native React `ActionButton` extraction, adoption in the unavailable EnquiryLink branch, and its test/fixture integration. This is not full Detail/site, metrics CLI, comparative visual geometry, owner approval, visual release, or public release acceptance.
- Preserve initial test-scope/assertion corrections and two review-returned test/fixture integration defects as self-correction; first submission was not accepted. Separate TS7053 metrics correction `deleg_a88d8567` is external context only, not Button coding/rework.

## Runtime, accounting and remaining gates
- Original implementation attempt remains `deleg_47dd9e03`, actual model/provider `gpt-6-luna` / `openai-codex`, 22 API calls, 222.72 seconds. Current continuation runtime/model/counters not exposed; do not combine or invent them.
- Medium shared-UI risk; actual Supervisor Sol review is complete and PASS for the bounded scope only. Existing reused browser evidence verifies branch disabled/accessibility behavior, but did not compare adopted-vs-legacy button geometry; no new geometry differential evidence was produced.
- No automatic repair/fixer, Git writes, root build, port 3100/3221 server, or unrelated cleanup. Existing unrelated repository changes were left untouched.

## Attempts / completeness
| Attempt | Actual model/provider | Delegation | Calls / child duration | Role and disposition |
|---|---|---|---|---|
| Original implementation | Luna / openai-codex | `deleg_47dd9e03` | 22 / 222.72s | Implementation; initial outcome corrected after review |
| Proof continuation | Luna / openai-codex | `deleg_a1fcbe61task1` | 11 / 99.0s | Task1 proof continuation |
| Correction | Luna / openai-codex | `deleg_9f8bbbfe` | 10 / 153.42s | Implementer correction |
| Earlier follow-up | unknown | unavailable | unknown | Record incomplete; do not infer |
| Review 1 and 2 | Sol / openai-codex | receipts | unknown | Independent review; usage unknown |
| External metrics correction | Luna / openai-codex | `deleg_a88d8567` | 13 / 126.09s | Separate task; not charged as Button coding |
| This closeout | Luna session | not exposed | unknown | Original executor's final accounting; current runtime unknown |

Usage, tokens, cost, reviewer counters and total end-to-end duration are unknown; no sums or price estimates. Full history completeness is unknown due to unavailable earlier follow-up result. No new build or agent was run for closeout.
