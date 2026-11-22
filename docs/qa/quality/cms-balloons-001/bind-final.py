from pathlib import Path
import hashlib, json
root = Path('/workspace')
qa = root / 'docs/qa/quality/cms-balloons-001'
fixture = qa / 'fixture-final'
def digest(path): return hashlib.sha256(path.read_bytes()).hexdigest()
def tree(base, sub):
    path = base / sub
    return {str(p.relative_to(base)): digest(p) for p in sorted(path.rglob('*')) if p.is_file()}
result = {}
for name in ['src', 'tests/unit']:
    a, b = tree(root, name), tree(fixture, name)
    result[name] = {'root': a, 'fixture': b, 'same': a == b, 'missing': sorted(a.keys()-b.keys()), 'extra': sorted(b.keys()-a.keys()), 'different': sorted(k for k in a.keys() & b.keys() if a[k] != b[k])}
for name in ['vitest.config.mts', 'tsconfig.json', 'next.config.ts', 'package.json', 'package-lock.json', 'studio/sanity.config.js']:
    result[name] = {'root': digest(root / name), 'fixture': digest(fixture / name), 'same': digest(root / name) == digest(fixture / name)}
result['studio_types_build_fixture_config'] = {'root': digest(root / 'studio/sanity.config.js'), 'fixture': digest(qa / 'studio-fixture/sanity.config.js'), 'same': digest(root / 'studio/sanity.config.js') == digest(qa / 'studio-fixture/sanity.config.js')}
(qa / 'final-binding.json').write_text(json.dumps(result, indent=2) + '\n')
for name, item in result.items(): print(name, 'equal=', item['same'], 'different=', item.get('different', []), 'missing=', item.get('missing', []), 'extra=', item.get('extra', []))
if not all(item['same'] for item in result.values()): raise SystemExit(1)
