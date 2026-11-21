# Evidence assembly only: no project imports, tests, or source writes.
from pathlib import Path
import difflib
import gzip
import hashlib
import json

root = Path('/workspace')
revision = root / 'docs/qa/quality/qa-environment-restore-001/guard-correction-001'
out = revision / 'source-review-inputs'
summary = json.loads((revision / 'preservation-summary.json').read_text())
files = [
    ('scripts/qa/local.mjs', 'local.mjs', 'modified'),
    ('scripts/qa/verify.mjs', 'verify.mjs', 'modified'),
    ('scripts/qa/reuse-guards.mjs', 'reuse-guards.mjs', 'added'),
    ('scripts/qa/guard-regression.test.mjs', 'guard-regression.test.mjs', 'added'),
    ('scripts/qa/guard-evidence.mjs', 'guard-evidence.mjs', 'added'),
    ('docs/development/local-qa.md', 'local-qa.md', 'modified'),
]
# These are the exact five accepted local.mjs replacements retained in this
# conversation's tool calls, inverted. Unedited bytes come from hash-bound
# current source, not guessed/transcribed missing code.
replacements = [
    ("import {assertSeparateEvidence} from './reuse-guards.mjs';\n", ''),
    ("export const expectedPacket = path.join(root, 'docs/qa/quality/qa-environment-restore-001/current-production');\nexport let packet = process.env.OLA_QA_EVIDENCE_DIR || expectedPacket;", "export const packet = path.join(root, 'docs/qa/quality/qa-environment-restore-001/current-production');"),
    ('export function snapshot(name,data=manifest()) {', 'export function snapshot(name) {const data=manifest();'),
    ("    if(['record','compact'].includes(command)&&fs.existsSync(path.join(expectedPacket,'reusable-build.json'))) throw new Error('Sealed verified packets are read-only; historical record/compact maintenance cannot rewrite their baseline');\n    if(!['record','compact'].includes(command)&&!process.env.OLA_QA_EVIDENCE_DIR) {\n      packet=fs.mkdtempSync(path.join(path.dirname(expectedPacket),'run-'));\n      env.OLA_QA_EVIDENCE_DIR=packet;\n    }\n", ''),
    ("    assertSeparateEvidence(packet,path.dirname(process.env.OLA_QA_EXPECTED_HANDOFF||path.join(expectedPacket,'reusable-build.json')));\n", ''),
]
sha = lambda content: hashlib.sha256(content).hexdigest()
current_local = (root / 'scripts/qa/local.mjs').read_bytes()
assert sha(current_local) == summary['finalToolingHashes']['local.mjs'], 'Current local.mjs differs from recorded final correction'
local_before = current_local.decode('utf-8')
for current, prior in replacements:
    assert local_before.count(current) == 1, 'Recorded inverse patch is not unique'
    local_before = local_before.replace(current, prior, 1)
local_bytes = local_before.encode('utf-8')
assert len(local_bytes) == 15427, 'Recovered local.mjs differs from retained pre-read size'
(out / 'before/local.mjs.txt').write_bytes(local_bytes)
(out / 'local-inverse-patches.json').write_text(json.dumps([
    {'recorded_after_literal': a, 'recorded_before_literal': b}
    for a, b in replacements
], ensure_ascii=False, indent=2) + '\n')

expected_pre_sizes = {'local.mjs': 15427, 'verify.mjs': 9456, 'local-qa.md': 6028}
entries = []
patches = []
for relative, name, change in files:
    current = (root / relative).read_bytes()
    if name in summary['finalToolingHashes']:
        assert sha(current) == summary['finalToolingHashes'][name], f'Current {relative} differs from final correction record'
    target = out / 'after' / f'{name}.txt'
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_bytes(current)
    before_path = out / 'before' / f'{name}.txt'
    previous = before_path.read_bytes() if change == 'modified' else b''
    if change == 'modified':
        assert len(previous) == expected_pre_sizes[name], f'Recovered {relative} size differs from pre-correction tool read'
    if name == 'local.mjs':
        provenance = 'Deterministic inverse of all five actual recorded targeted edits; current unedited ranges are SHA-bound to preservation-summary. Corroborated by pre-correction paginated read 1-65 and134-156, size15427. Not a separately captured complete pre-file or independently observed historical SHA.'
    elif change == 'modified':
        provenance = 'Recovered from complete retained pre-correction tool-read text with original author-owned UTF-8/LF write/patch provenance; no guessed ranges. Verify111lines/9456bytes; guide59lines/6028bytes. Recovery hash is computed now, not claimed historically measured.'
    else:
        provenance = 'Newly authored in this correction by first successful write_file calls, not a pre-existing empty source; diff uses /dev/null. No fabricated preimage file.'
    entries.append({
        'path': relative, 'change': change,
        'before': None if change == 'added' else {
            'snapshot': str(before_path.relative_to(out)), 'bytes': len(previous),
            'sha256_computed_at_recovery': sha(previous), 'independent_historical_sha256': None,
        },
        'after': {'snapshot': str(target.relative_to(out)), 'bytes': len(current), 'sha256': sha(current)},
        'provenance': provenance,
    })
    patches.extend(difflib.unified_diff(
        previous.decode('utf-8').splitlines(keepends=True),
        current.decode('utf-8').splitlines(keepends=True),
        fromfile=f'a/{relative}' if change == 'modified' else '/dev/null',
        tofile=f'b/{relative}', n=3,
    ))
(out / 'source-changes.diff').write_text(''.join(patches), encoding='utf-8')
before = json.loads(gzip.decompress((revision / 'before.json.gz').read_bytes()))
assert all(set(value).issubset({'size', 'sha256'}) for value in before['source'].values())
manifest = {
    'purpose': 'Evidence completeness only; no current implementation or tests changed/executed',
    'files': entries,
    'prior_before_snapshot': {
        'path': '../before.json.gz', 'top_level_keys': list(before),
        'source_bodies_present': False,
        'requested_source_paths_in_source_map': [relative for relative, _, _ in files if relative in before['source']],
        'meaning': 'Identity hashes/sizes/protected identities and baseline+delta metadata only; not an archive of QA/controller/guide source bytes.',
    },
    'limits': [
        'No independently observed pre-correction SHA was retained for these untracked sources; recovery hashes must not be mistaken for historical digests.',
        'local.mjs has complete deterministic inverse-edit recovery, not a separate full original snapshot; unedited ranges rely on the retained complete edit history and exclusive executor ownership.',
        'No Git-based before/after is claimed. The standalone unified diff is generated from the inert recovered/current source snapshots.',
        'This supplement does not rerun tests, alter a saved build/handoff/FAIL receipt, or claim Supervisor review2.',
    ],
}
(out / 'manifest.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n')
print(json.dumps({'files': len(entries), 'modified': sum(e['change'] == 'modified' for e in entries), 'added': sum(e['change'] == 'added' for e in entries), 'diff_bytes': (out / 'source-changes.diff').stat().st_size, 'manifest': str(out / 'manifest.json')}, ensure_ascii=False))
