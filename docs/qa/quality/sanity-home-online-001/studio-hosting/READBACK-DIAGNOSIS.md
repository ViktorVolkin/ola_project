# Read-only hosting diagnosis — current manifest mismatch identified

**Public resource mismatch reproduced; original hosting runtime remains NOT_VERIFIED. No second deployment, approved runtime invocation, credential access or code change.**

## Actual bounded observations

Visible executor runtime `gpt-6.1-sol / openai-codex`. Read own FINAL-HOSTING, sanitized execution result/app-before/app-after/final-error and approved readback implementation. The original assertion at runtime.mjs45 rejects any non-index resource unless HTTP200 and SHA256 equal the staged post-CLI public file. Root redirect and canonical index have separate accepted branches.

One selected public GET pass at **2026-11-20T23:42:26Z**, followed by one lexical depth-first diagnostic walk stopping at the first mismatch. Already fetched selected resources were reused from their recorded observations, **not fetched again**. No redirects followed, auth/cookies/custom headers, alternate host/cache-busting parameters or retries. Source/helper/binding/approval bytes untouched. Diagnostic timestamp summary recorded by tool at **2026-11-20T23:44:12.748691+00:00**.

## Exact failing public resource

**https://ola-studio-zhn2ddaj.sanity.studio/static/create-manifest.json**

- HTTP200, no redirect, Content-Type application/json,1007bytes.
- Current served SHA256 **3e69f1c2712ed72b3e434d8b819ca9818b94a011c883e2ca3b65bfc1a14cfa3b** — identical to the known pre-update public manifest.
- Staged post-CLI expected SHA256 **97d64ff536835aa18807a15fa03c9c67f9f96cf922eb4a2944a39c4dc414badb**, also1007bytes.
- Served `createdAt`:2026-11-19T21:17:19.735Z; schema reference62168408.create-schema.json; tools referencea1fd46b5.create-tools.json.
- Staged `createdAt`:2026-11-20T23:36:04.506Z; schema reference0a0aa0cd.create-schema.json; tools referencee691e35c.create-tools.json.
- Both manifests still identify Studio6.24.0/default workspace/projectzhn2ddaj/datasetproduction. This is not a new app/project mismatch or an index canonical redirect error.

**High confidence current failure mechanism:** the unversioned public create-manifest still serves the old bytes, which the approved equality assertion correctly rejects. This is a substantive reference/content difference, not just a timestamp difference. **Not established:** whether CDN caching, an origin/server rule or another hosting mechanism causes the old response. No relevant cache-header evidence was captured, so CDN is only a hypothesis. The original failed filename was not logged; this present-time first mismatch does not retroactively prove its historical failing resource, though it reproduces exactly the same assertion condition.

## New reviewed artifacts are publicly available now

All3selected production-origin JS resources return HTTP200 and match the approved build bytes exactly; each includes literal `https://olaproject-chi.vercel.app`:

- `static/FormValue-drVsNI6m-BzRMrG5U.js` —997564bytes, SHA2568429f3bffe6ad887e731454b6331855d2278b49dc729cab3ec22ea8a62ce5e69.
- `static/authStore-B09IfFua--OTW4x1n.js` —121713bytes, SHA256229d74e08eef1170b5de2a38dd205c45a79501a2c1bfc1abf31823b6af5fec79.
- `static/sanity-BoXWu92Z.js` —26011bytes, SHA256a0bac1e537c9649f8ae564b518c917bdc7bd2c390d77253d754762c8f70b17c4.

The new staged schema **https://ola-studio-zhn2ddaj.sanity.studio/static/0a0aa0cd.create-schema.json** also returns200/application-json,148496bytes, SHA256 **5ea848c462b5f1b36da6c2353942680a714fca6df75af3d17cb395ec035cc541**, exactly matching post-CLI local schema. Thus the host is not uniformly serving only the old deployment's files. This does not establish which files the authenticated Dashboard currently selects.

## Controlled walk coverage / stopping boundary

Allowed set was exactly the reviewed356public build files plus the3supported CLI metadata files named by the staged manifest, total359. Walk checked293entries:291exact HTTP200 byte matches,1accepted index.html301→/, then1manifest mismatch. Stopped immediately;66entries were not walked. All3origin bundles were separately checked in the selected pass even if outside this prefix. New tools metadata e691e35c.create-tools.json was not checked after the first mismatch; do not infer its remote bytes or complete readback PASS. No complete body/token scans, new deployment ID/time or full asset attestation claimed.

These are new observations after elapsed time, not an override of the original failed runtime or an all-assets-now-match result. The CLI application's old19November activeDeployment field remains historical and is not used as a new timestamp.

## Safe minimal next action — no deployment retry

Lead/actual Supervisor should disposition the exact unversioned-manifest inconsistency using this evidence. If further validation is authorized, use a separately reviewed **readback-only** observer, never the credential/deploy runtime. Minimal instrumentation proposal: persist each resource's URL/status/redirect/content type/expected and actual size/hash **before** the equality assertion, then stop on the first mismatch; preserve strict manifest/content comparison. Do not waive manifest equality just because origin bundles match, and do not modify/redeploy approved source to manufacture green evidence. No patch was made here.

Owner may open **https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw** or **https://ola-studio-zhn2ddaj.sanity.studio/** and check whether Home preview is visible after standard login. Authenticated UI/revision selection is untested. If this public manifest inconsistency needs escalation, provide Sanity hosting support the exact old/new manifest hashes/references plus the matching new schema/origin assets; no token needed. Do not create another app/host or change CORS/cache policy as a workaround.

Website Git/Vercel deployment stays owner-operated and separate; prior website preview404 is not a cause or fix for this Studio manifest mismatch. Viewer/editor/cloud draft isolation and named content-mutation consent remain unverified; no manager-ready or100%usable claim.

## Evidence / own accounting

Own new artifacts only under `readonly-diagnostic/`: `selected.py`, `selected-public-readback.json`, `current-public-manifest.json`, `first-mismatch.py`, `first-mismatch-walk.json`, `diagnosis-summary.json`, plus this own READBACK-DIAGNOSIS.md. Public manifest body saved; JS/schema bodies used only for metadata/hash comparisons, not printed. Scripts are bounded unauthenticated GET diagnostics, not deployment/SDK helpers.

Bounded delegated read-only continuation, HIGH parent hosting risk, pending actual scoped disposition; no independent PASS self-issued. Prior hosting completion7API/318.4schild/318.68sbatch is parent-reported metadata, not this diagnostic's counters. Current route/cost/duration/fallback reconciliation remains parent-owned. No parent takeover or source correction. No secret/env/auth file read/stat/hash/load, SDK/CLI/runtime invocation, new cloud write, app/role/CORS/content mutation, test/build/browser/port/full-tree campaign, Git/Vercel/install/Hermes/OS/model/provider change, helper agent or Supervisor call. Original execution files, statuses, bound code and approval preserved. Workflow lesson: failed readback must preserve the failing resource before throwing; availability of versioned bundles does not prove freshness of an unversioned manifest.
