# OLA-SANITY-HOME-CLICK-NULL-001 — confirmed SDK null seam, minimal config fix prepared

**Current continuation:** actual Luna RED/GREEN + official browser proof is recorded; import-only lint cleanup and a fresh production-origin356-file release are ready. Root lint rerun and actual current-source Supervisor review remain pending. See `PREDEPLOY.md` for new source/output/candidate hashes and exact next command. The original preparation report below is retained as history, not current test status.

**Root cause reproduced; project fix implemented locally, awaiting Luna targeted RED/GREEN + actual Studio click regression and actual Sol Supervisor review. NOT deployed.** Parent ONLINE history/hosting NOT_VERIFIED unchanged.

## Exact owner stack mapped to real code

Preserved literal report: fileName **https://ola-studio-zhn2ddaj.sanity.studio/static/PresentationToolGrantsCheck-DSRQXwPt-Brz2FIHT.js**, lineNumber **2**, columnNumber **39317**, message **`can't access property "_id", e is null`** (reported twice).

One public GET of that exact chunk returned200 and matched the local production build byte-for-byte: SHA256 **b29dd338a8f9944a5efa6c9bfee1c318e160da4cc72308816b30bfcd41b602bb** (`chunk-binding.json`). Column39317 falls in `e!==void 0&&Ct(n)!==Ct(e._id)` where immediately preceding `e=i?.document`. This is **ContentEditor mainDocumentState.document**, not currentUser/grants identity. Chunk's exported name is not the failing component's identity.

Installed `studio/node_modules/sanity/lib/PresentationToolGrantsCheck-DSRQXwPt.js:1396-1398` has the same expression: `mainDocument !== void 0 ... mainDocument._id`. Installed sourcemap identifies **src/presentation/editor/ContentEditor.tsx** and **src/presentation/useMainDocument.ts**; source contents saved inert as `.txt`.

Dataflow: useMainDocument:3356-3364 builds `// groq\n*[_type == "homePage" && _id == "homePage"][0]{_id, _type}`; resolved no-match `{result:null}` becomes `doc=null`. handleResponse:3333-3336 stores `{document:doc,path}`. Selecting an annotated text/photo supplies documentId/type, enters ContentEditor1396, null passes `!==undefined`, `_id` throws. The hook's declared response type excludes null but runtime GROQ no-match does not. Actual cause class is proven; **which real owner document/perspective produces null remains unobserved** (private draft existence unknown). Missing/unsaved/draft-only published selection are legitimate null-input cases, not claims of inspected private data.

## Actual causal execution, no mechanical-suite takeover

`sdk-seam.mjs` extracts actual compiled installed **useMainDocument**, **ContentEditor**, query helper functions via TypeScript AST; does not rewrite their null guard. Hook/SDK client/cache/JSX/route-boundary collaborators are isolated stubs. A controlled causal diagnostic executed the real hook with `{result:null}` and real ContentEditor selection: captured query, state `{document:null,path:'/en'}`, and **TypeError: Cannot read properties of null (reading '_id')** in `causal-diagnostic.json`. This is the same null dereference, Node wording differs from owner browser. Initial probe lacked module-level urlPatternPolyfillPromise in the isolated context and stopped ReferenceError; supplied that missing test collaborator, then root-cause reproduction succeeded. Neither event is a cloud/permissions diagnosis. Final seam helper reads API_VERSION from the installed same preview-secret constants instead of a hardcoded test value; that constant adjustment was syntax-checked, not re-executed.

The seam is **not a real pointer/UI test**: JSX leaves/hooks/cache are isolated, selection paths are intents. Real official browser regression is separately prepared below. No mechanical unit/lint/build/browser run by Sol.

## Minimal supported project correction

Only `studio/sanity.config.js`: remove optional `resolve.mainDocuments` auto-query mapping, add2explanatory comments; preserve `resolve.locations`, official Presentation, singleton/schema/forms/EN-RU-SR routes, preview authentication/grants/origins/CSP, annotations and strict public fallback/image handling. New config SHA256 **edd777479f6375875780d51600a893172b4fcfb4d3abe2dd2218ecefec3429ad**. Before source `.txt`, before/hash, `source.diff`, `source-binding.json` preserved.

Why supported: installed useMainDocument:3323 defaults `resolvers=[]`, and3375 resets state to **undefined** when no mainDocuments resolver. ContentEditor safely processes explicit overlay documentId/type with undefined main state. This disables **optional automatic main-document selection/breadcrumb**, not field/image click-to-edit, grants checks or document editing. No fabricated main-document placeholder, catch-all error boundary, SDK/node_modules/dependency edit or requirement to publish Home. Selecting a missing document must still use official new/unsaved input flow; creating/saving cloud content remains owner-controlled, not automatic.

Earlier populated official harness always included both homePage and drafts.homePage and its public query always returned the populated constant: it did not exercise this null state. Old administrator/mock grants values are unchanged and not used to explain this crash.

## Prepared Luna checks — tight loop, then narrow actual browser

Use pinned Node24/private HOME/XDG/SHELL/browser/native cache. No installs or root .next/3100. `N=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`, `Q=docs/qa/quality/sanity-home-click-null-001`; cwd `/workspace`. Define command-local wrapper:

```bash
run() { env -i PATH=/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin HOME=/workspace/.local-tools/ola-qa/home XDG_CONFIG_HOME=/workspace/.local-tools/ola-qa/home/config XDG_CACHE_HOME=/workspace/.local-tools/ola-qa/cache npm_config_cache=/workspace/.local-tools/ola-qa/cache/npm SHELL=/bin/bash SWC_NATIVE_BINDING_CACHE=/ola-native-cache PLAYWRIGHT_BROWSERS_PATH=/workspace/.local-tools/ola-qa/browsers NODE_DISABLE_COMPILE_CACHE=1 "$@"; }
```

1. **Actual SDK seam RED against inert before config**, expect nonzero from null cases, not setup errors; preserve log:

```bash
run env CLICK_CONFIG=/workspace/docs/qa/quality/sanity-home-click-null-001/sanity.config.before.js.txt "$N" --test "$Q/regression.test.mjs" > "$Q/luna-seam-red.log" 2>&1
```

2. **GREEN against actual root fixed config**:

```bash
run "$N" --test "$Q/regression.test.mjs" > "$Q/luna-seam-green.log" 2>&1
```

Matrix covers EN/RU/SR text/photo intents, missing/no singleton, new unsaved, draft-only under published and drafts responses, published document; actual SDK null-crash control retained. Perspective payloads are declared synthetic, not live permission/data findings.

3. **Narrow official Studio/iframe real pointer RED before/missing**, using the existing pre-fix localhost Studio build and existing synthetic Next fixture (no rebuild/adoption as release). `browser-null.mjs` was generated from the existing official transaction-consistent browser harness, output to new task dirs. It removes Home docs from mock Content Lake, returns actual null main-query payloads, retains standard API/auth/SSE mocks, clicks heading/photo and checks exact editor paths/no error. No editor fill/save/publish. Synthetic preview-secret bookkeeping may write only mock memory; no cloud calls.

```bash
mkdir "$Q/browser-before-missing"
run env CLICK_MODE=before CLICK_CASE=missing "$N" "$Q/browser-null.mjs" > "$Q/luna-browser-red.log" 2>&1
```

Expected nonzero must show the SDK null crash on actual selection, not a harness/import/endpoint failure. If setup/protocol error occurs, preserve it and return to same executor; do not weaken expectations.

4. Only after seam results, build **one new private fixed Studio test fixture**, then actual-pointer GREEN cases:

```bash
run "$N" "$Q/build-studio.mjs"
for CASE in missing unsaved draft-only; do
  mkdir "$Q/browser-fixed-$CASE"
  run env CLICK_MODE=fixed CLICK_CASE="$CASE" "$N" "$Q/browser-null.mjs" > "$Q/luna-browser-$CASE.log" 2>&1 || break
done
```

New private Studio `/workspace/.local-tools/ola-qa/sanity-home-click-null-001/studio`; localhost preview compile is **test-only, never deploy it**. Source/command result recorded in studio-build-binding.json; no product production-origin build or hosting action here. Reuses existing private Next build; no190-click/full702rerun. Browser only starts owned mock API/Studio/synthetic Next processes, cleanup/rebind witnesses retained from established harness. Fixed checks require exact title/photo paths across locale navigation, no page/body errors and no main-document auto-query; inspect screenshots/results, not just exit0. All scenarios are synthetic and not authenticated owner/editor proof.

5. Affected lint/types by Luna, not Sol: configured `npm run lint` from root under run; `node_modules/typescript/bin/tsc --noEmit` from Studio under pinned Node; preserve new logs. No full root unit/build suite needed for this one optional config removal. Preserve any real failure; do not disable lint or alter another scope.

## Current state / review / accounting

Actual completed: one exact public chunk GET/hash/column mapping, installed/source-map trace, controlled actual-SDK causal reproduction, minimal root config patch, inert snapshot/diff/bindings, prepared seam/browser/build tools and JS syntax checks. **Tests/lint/types/build/browser GREEN not yet executed**, no claim user-visible hosted fix. The old deployment/observer approvals bind **old Studio inputs** and must not be reused; current source change invalidates them for any hosting write. Actual @supervisor runtime-confirmed Sol review required after Luna targeted evidence, then separately authorized source-bound hosting update. No Supervisor/helper/outbound messages here.

Stable unit OLA-SANITY-HOME-CLICK-NULL-001, parent ONLINE, delegated coherent executor, HIGH SDK/editor/privacy integration, review_requiredtrue; delivery awaiting execution/review. Visible gpt-6.1-sol/openai-codex, no model/provider/config change, actual completion/fallback/cost/duration unknown pending parent. One in-attempt diagnostic harness correction noted above; no parent takeover, prior no-null coverage gap preserved. No shared ledger/task-routing or other QA/approved helper/reservation edits. No secret read/stat/hash/load, authenticated request, new cache/activation campaign, cloud content/asset/import/save/publish/CORS/roles/settings/Git/OS/install/Hermes changes. Website API last404/owner push remains separate; do not attribute this `_id` fault to it or require publishing Home. Owner need not provide credentials or approve publication to diagnose/fix this null seam. Actual draft existence and owner authenticated UI state remain unknown.
