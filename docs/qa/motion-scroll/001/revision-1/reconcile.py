from pathlib import Path
from collections import Counter
import re, hashlib
root = Path(__file__).parent

def ids(path, passed=False):
    result = []
    for line in path.read_text().splitlines():
        pattern = r'\s*✓\s+\d+ \[(desktop|mobile)\] › tests/e2e/(.+) \([^()]*\)$' if passed else r'\s*\[(desktop|mobile)\] › (.+)'
        m = re.match(pattern, line)
        if m:
            case = re.sub(r':\d+:\d+ ›', ' ›', m.group(2))
            result.append((m.group(1), case))
    return result
old = ids(root.parent / 'deep-history/case-list.txt')
new = ids(root / 'case-list.txt')
passed = ids(root / 'combined.log', True)
print('old/new/listed/passed', len(old), len(new), len(passed))
print('unique cases', len({c for _,c in new}), 'projects', dict(Counter(p for p,_ in new)))
print('old missing', sorted(set(old)-set(new)))
print('new missing pass', sorted(set(new)-set(passed)))
print('pass extra', sorted(set(passed)-set(new)))
print('duplicate listed/passed', len(new)-len(set(new)), len(passed)-len(set(passed)))
old_manifest = root.parent / 'deep-history/inputs-before.sha256'
entries = []
for line in old_manifest.read_text().splitlines():
    _, name = line.split('  ', 1)
    path = Path(name)
    entries.append((name, hashlib.sha256(path.read_bytes()).hexdigest() if path.is_file() else 'MISSING'))
(root / 'inputs-after.sha256').write_text(''.join(f'{digest}  {name}\n' for name,digest in entries))
print('manifest entries', len(entries))
old_hash = {name: digest for digest, name in (line.split('  ', 1) for line in old_manifest.read_text().splitlines())}
print('changed:', [(n, old_hash[n], h) for n,h in entries if old_hash[n] != h])
