# Content diff

Run from the repository root on the project's supported Node version:

```sh
npm run content:diff
npm run --silent content:diff -- --locale ru --page home --format json
```

Locales: `ru` (default), `en`, `sr`. Pages: `home`, `about`, `weddings`, `balloons`, `bouquets`, `contact`; omitted page means all six. `--format json` emits only JSON from the CLI; use npm's `--silent` to suppress its banner. Every valid invocation writes `reports/content-diff/<locale>.json` and `.csv`. Selection and incomplete metadata accompany even partial results; a page-filtered run replaces that locale's prior report. Differences and empty fields exit 0; argument errors exit 2; operational failures exit 1 and are marked incomplete. Do not treat a partial report as a complete comparison.

The CLI imports the existing Studio schema/config and sends only a public GET with `perspective=published`; it does not use tokens, drafts, fallback parsers or mutations. Its allowlisted mapping manifest is based on the current parser's paths, with technical array IDs read from the TypeScript content declarations and fixed positional slots marked as index-based. Changes to copy/schema or ID order require review and manifest updates; unmatched paths are not guessed. Schema fields without an established mapping and raw extra text are UNMAPPED; raw metadata, asset references, image crop/hotspot and other language branches are excluded. If a document or network is unavailable, it produces no field comparisons for that page rather than inventing emptiness. Common dictionary entries are a separate local-only bucket.

Values are compared byte-for-value as JavaScript strings, with no trimming or normalization for equality. `SANITY_EMPTY` means a mapped field is absent, null, empty or whitespace-only; presence flags distinguish absent from null, and the raw value is preserved. Malformed non-string values are UNMAPPED. `LOCAL_ONLY` indicates known deliberate local-only copy; `SANITY_ONLY` is reserved for known CMS-only correspondence (there are currently none); unresolved local, schema and raw paths are UNMAPPED. JSON retains raw null/presence information; CSV preserves text and includes presence columns. Errors are sanitized and separate from comparison records.
