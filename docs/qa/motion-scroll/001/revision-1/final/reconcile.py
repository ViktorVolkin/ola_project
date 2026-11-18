from pathlib import Path
from collections import Counter
import re, json
p = Path(__file__).parent

def ids(path, passed=False):
    result = []
    for line in path.read_text().splitlines():
        pat = r'\s*✓\s+\d+ \[(desktop|mobile)\] › tests/e2e/(.+) \([^()]*\)$' if passed else r'\s*\[(desktop|mobile)\] › (.+)'
        m = re.match(pat, line)
        if m:
            result.append((m.group(1), re.sub(r':\d+:\d+ ›', ' ›', m.group(2))))
    return result
old = ids(p.parent / 'case-list.txt')
new = ids(p / 'case-list.txt')
passed = ids(p / 'combined.log', True)
print('prior/listed/passed:', len(old), len(new), len(passed))
print('unique and projects:', len({c for _, c in new}), dict(Counter(project for project, _ in new)))
print('prior missing:', sorted(set(old) - set(new)))
print('listed missing pass:', sorted(set(new) - set(passed)))
print('pass not listed:', sorted(set(passed) - set(new)))
print('duplicate listed/passed:', len(new)-len(set(new)), len(passed)-len(set(passed)))
before = dict(line.split('  ',1)[::-1] for line in (p/'inputs-before.sha256').read_text().splitlines())
after = dict(line.split('  ',1)[::-1] for line in (p/'inputs-after.sha256').read_text().splitlines())
print('inventory added:', sorted(after.keys()-before.keys()), 'removed:', sorted(before.keys()-after.keys()))
print('inventory changed:', [(name,before[name],after[name]) for name in before.keys() & after.keys() if before[name] != after[name]])
for line in (p/'combined.log').read_text().splitlines():
    match = re.match(r'NATIVE_HANDOFF (\w+) (\{.*\})$', line)
    if match:
        data = json.loads(match.group(2)); frames = data['evidence']['frames']; key = data['preKey']
        print('handoff',match.group(1),'pre-key y',key['y'],'smooth', 'lenis-smooth' in key['root'],'frames',len(frames),'first/last y',frames[0]['y'],frames[-1]['y'],'last30 range', max(x['y'] for x in frames[-30:])-min(x['y'] for x in frames[-30:]), 'last focus',frames[-1]['focus'][:90], 'visible',frames[-1]['visible'])
assert len(old)==116 and len(new)==128 and len(passed)==128
assert set(old) <= set(new) == set(passed)
assert len(set(new)) == len(new) and len(set(passed)) == len(passed)
assert before.keys() == after.keys()
assert {k for k in before if before[k] != after[k]} <= {'tsconfig.tsbuildinfo'}
