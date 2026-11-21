import hashlib
import json
from pathlib import Path

root = Path('/workspace')
copy = Path('/tmp/ola-composition-r1-3219')
out = root / 'docs/qa/bouquet-detail/composition-001/technical-final/revision-1'
before = json.loads((out / 'red-manifest.json').read_text())
def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()
current = {key: digest(root / key) for key in before}
copy_mismatches = [key for key in before if digest(copy / key) != current[key]]
extra = sorted(str(p.relative_to(root)) for d in ['src', 'public'] for p in (root / d).rglob('*') if p.is_file() and str(p.relative_to(root)) not in before)
changed = [key for key in before if before[key] != current[key]]
(out / 'green-manifest.json').write_text(json.dumps(current, indent=2) + '\n')
result = {'entries': len(current), 'changed_since_red': changed, 'copy_mismatches': copy_mismatches, 'unlisted_src_public': extra, 'test_sha256': digest(root / 'tests/e2e/bouquet-detail-page.spec.ts'), 'config_sha256': digest(root / 'tests/bouquet-detail-page.config.ts'), 'route_sha256': digest(root / 'tests/fixtures/bouquet-detail-page/page.tsx.txt'), 'build_id': (copy / '.next/BUILD_ID').read_text().strip()}
(out / 'source-check.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
assert not copy_mismatches and not extra
assert changed == ['src/components/widgets/BouquetDetailPreferences/BouquetDetailPreferences.module.css']
