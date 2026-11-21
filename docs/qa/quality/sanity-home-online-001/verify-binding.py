"""Read-only guard for the prepared packet; no secrets, network or processes."""
import hashlib
import json
import socket
import sys
from pathlib import Path

root = Path('/workspace')
qa = root / 'docs/qa/quality/sanity-home-online-001'
m = json.loads((qa / 'current-source-binding.json').read_text())
errors = []
sha = lambda p: hashlib.sha256(p.read_bytes()).hexdigest()
for row in m['source_files']:
    for base in [root, Path(m['private_source'])]:
        p = base / row['path']
        if not p.is_file() or sha(p) != row['sha256']:
            errors.append(str(p))
    if not row['path'].startswith('studio/') and row['path'] != 'next-env.d.ts':
        p = Path(m['release_fixture']) / row['path']
        if not p.is_file() or sha(p) != row['sha256']:
            errors.append(str(p))
assert (Path(m['release_fixture']) / '.next/BUILD_ID').read_text().strip() == m['release_build_id']
for name, expected in json.loads((qa / 'final-harness-binding.json').read_text()).items():
    if sha(root / name) != expected:
        errors.append(name)
if '--built' in sys.argv:
    builds = json.loads((qa / 'current-run/build-results.json').read_text())
    assert len(builds) == 1 and builds[0]['kind'] == 'synthetic'
    b = builds[0]
    assert (Path(b['fixture']) / '.next/BUILD_ID').read_text().strip() == b['buildId']
    for row in b['files']:
        if sha(Path(b['fixture']) / row['path']) != row['sha256']:
            errors.append('built:' + row['path'])
if '--ports' in sys.argv:
    for port in [42241, 42242, 42244, 3333]:
        with socket.socket() as sock:
            sock.bind(('127.0.0.1', port))
assert not errors, errors
print(json.dumps({'binding': 'PASS', 'source_files': len(m['source_files']), 'release_compared': m['release_comparison_count'], 'built_checked': '--built' in sys.argv, 'ports_checked': '--ports' in sys.argv, 'browser_run': False}))
