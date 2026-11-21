# OLA-DISK-USAGE-001 — disk snapshot

Measured `/workspace` on branch `development` with a clean Git status, before creating this report.

- Allocated: **4,702,056,448 bytes** (4.379 GiB / 4,485.5 MiB), via `du -s -B1 .`.
- Apparent file sizes: **4,592,488,284 bytes** (4.278 GiB / 4,380.9 MiB), via `du -s -B1 --apparent-size .`.
- `du` counts hardlinked data once; file-path count: **33,339**. Symlinks were not followed. Hidden folders included. No tool-reported errors.

## Top-level allocated footprint

`docs` 2.1G; `.git` 1.5G; `node_modules` 564M; `.next` 222M; `tests` 72M; `ola_dev_design` 48M; `public` 33M; `src` 1.1M. Rounded `du -h` buckets; they overlap only with the root total, not each other.

Largest nested concentrations: `docs/qa` 2.1G (including `docs/qa/quality` 394M); `tests/fixtures/action-button/.next` 72M (standalone 40M, cache 26M). These QA screenshots and fixture/build outputs contribute to project disk size, not runtime bundle size.

## Interpretation

- Runtime-facing supplied assets are under `public/` (33M); source under `src/` is 1.1M. Largest public files are supplied PNG/JPEG imagery (largest observed: `public/assets/decorative/story_botanical_transparent.png`, 1,186,124 bytes). No claim that source + public equals a deployable bundle.
- Installed dependencies (`node_modules`, 564M) and generated Next output/cache (`.next`, 222M; plus fixture `.next`) are not supplied runtime assets.
- Git object storage is 1.5G; largest file is its 760,546,184-byte pack.
- QA archive weight is concentrated in `docs/qa`; largest observed screenshot files are ~4.87 MB PNGs. These are records, not production assets.

Complete top-20 file list and measurements: `machine.json`. No files deleted or existing project files altered. No build, tests, install, browser run, or cleanup performed. Potential regeneration/removal must be separately authorized; preserve QA records and unique supplied assets absent explicit content/retention proof. Disk footprint is **not** download-bundle size.
