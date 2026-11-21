"""Prepare only: current-source binding and adapted existing official harness.
No subprocess, network, credential paths, builds, browser or cloud execution.
"""
import hashlib
import json
from pathlib import Path

ROOT = Path('/workspace')
QA = ROOT / 'docs/qa/quality/sanity-home-online-001'
OLD = ROOT / 'docs/qa/quality/sanity-home-visual-editing-001/takeover'
PRIVATE = ROOT / '.local-tools/ola-qa/sanity-home-online-001'
RELEASE = ROOT / '.local-tools/ola-qa/fixture-fzwRsz'


def sha(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def replace(text, old, new):
    if text.count(old) != 1:
        raise RuntimeError('Expected one exact harness seam: ' + old[:100])
    return text.replace(old, new)


if PRIVATE.exists():
    raise RuntimeError('Refuse overwriting existing private packet')
paths = []
for directory in ['src', 'public']:
    paths += sorted(p for p in (ROOT / directory).rglob('*') if p.is_file())
for name in ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'next-env.d.ts']:
    paths.append(ROOT / name)
for name in ['sanity.config.js', 'sanity.cli.js', 'package.json', 'package-lock.json', 'tsconfig.json']:
    paths.append(ROOT / 'studio' / name)
for p in paths:
    if p.is_symlink():
        raise RuntimeError('Refuse symlink source: ' + str(p))
records = [{'path': str(p.relative_to(ROOT)), 'sha256': sha(p)} for p in paths]
# next-env.d.ts is generated and not accepted as immutable original source.
comparisons = [r for r in records if not r['path'].startswith('studio/') and r['path'] != 'next-env.d.ts']
mismatches = [r['path'] for r in comparisons if not (RELEASE / r['path']).is_file() or sha(RELEASE / r['path']) != r['sha256']]
if mismatches:
    raise RuntimeError('Fresh release source mismatch: ' + repr(mismatches))
if (RELEASE / '.next/BUILD_ID').read_text().strip() != 'Rp-GZr8-oMAV7SgRiAKIA':
    raise RuntimeError('Wrong release BUILD_ID')
PRIVATE.mkdir(parents=True, mode=0o700)
for p in paths:
    dest = PRIVATE / 'source' / p.relative_to(ROOT)
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(p.read_bytes())
(PRIVATE / 'studio').mkdir()
for p in paths:
    if p.parent == ROOT / 'studio':
        (PRIVATE / 'studio' / p.name).write_bytes(p.read_bytes())
(PRIVATE / 'studio/node_modules').symlink_to(ROOT / 'studio/node_modules', target_is_directory=True)
build = (OLD / 'build-execute.mjs').read_text()
build = replace(build, 'qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`', 'qa=`${root}/docs/qa/quality/sanity-home-online-001/current-run`')
build = replace(build, "['release','synthetic']", "['synthetic']")
build = replace(build, '`${root}/.local-tools/ola-qa/visual-editing-${kind}`', f'`{PRIVATE}/next-${{kind}}`')
build = replace(build, 'await cp(`${root}/${path}`,', f'await cp(`{PRIVATE}/source/${{path}}`,')
build = replace(build, "  await run(`configured-types-${kind}`,['/usr/local/lib/node_modules/npm/bin/npm-cli.js','run','typecheck'],fixture);", "  // Existing fresh lint/units/types are not rerun by this browser-only binding.")
start = build.index(" await run('studio-types'")
end = build.index('}finally', start)
build = build[:start] + f" await run('studio-build',['node_modules/sanity/bin/sanity','build'],'{PRIVATE}/studio',{{SANITY_STUDIO_PREVIEW_ORIGIN:'http://localhost:42242'}});\n" + build[end:]
browser = (OLD / 'browser-final.mjs').read_text()
browser = replace(browser, 'qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`', 'qa=`${root}/docs/qa/quality/sanity-home-online-001/current-run`')
browser = replace(browser, 'cwd:`${root}/.local-tools/ola-qa/visual-editing-${kind}`', f"cwd:kind==='release'?'{RELEASE}':`{PRIVATE}/next-${{kind}}`")
browser = replace(browser, '`${root}/studio/dist${path}`', f'`{PRIVATE}/studio/dist${{path}}`')
browser = replace(browser, "'/workspace/.local-tools/ola-qa/visual-editing-synthetic/.next/'", f"'{PRIVATE}/next-synthetic/.next/'")
# Preserve the original all-locale field/photo/save assertions and cleanup witnesses.
(QA / 'current-build.mjs').write_text(build)
(QA / 'current-browser.mjs').write_text(browser)
(QA / 'current-run').mkdir(exist_ok=False)
manifest = {'unit': 'OLA-SANITY-HOME-ONLINE-001-continuation', 'runtime_basis': 'visible developer-injected gpt-6.1-sol / openai-codex; parent completion reconciliation pending', 'source_files': records, 'release_fixture': str(RELEASE), 'release_build_id': 'Rp-GZr8-oMAV7SgRiAKIA', 'release_comparison_count': len(comparisons), 'release_mismatches': mismatches, 'private_source': str(PRIVATE / 'source'), 'old_harness': {'path': str(OLD / 'browser-final.mjs'), 'sha256': sha(OLD / 'browser-final.mjs')}, 'generated': {n: sha(QA / n) for n in ['current-build.mjs', 'current-browser.mjs']}, 'state': 'PREPARED_NOT_BUILT_OR_BROWSER_RUN', 'limits': ['release source bytes compared, not full installed dependency attestation', 'synthetic private fixture relaxes localhost policy and redirects Content Lake; never deploy it', 'real Viewer/editor/cloud not exercised']}
(QA / 'current-source-binding.json').write_text(json.dumps(manifest, indent=2) + '\n')
print(json.dumps({'prepared': True, 'source_files': len(records), 'release_compared': len(comparisons), 'mismatches': mismatches, 'build_browser_run': False}))
