from pathlib import Path
import re
from collections import Counter

root = Path(__file__).parent
listed = []
for line in (root / 'case-list.txt').read_text().splitlines():
    match = re.match(r'\s*\[(desktop|mobile)\] › (.+)', line)
    if match:
        listed.append((match.group(1), match.group(2)))
passed = []
for line in (root / 'combined.log').read_text().splitlines():
    match = re.match(r'\s*✓\s+\d+ \[(desktop|mobile)\] › tests/e2e/(.+) \([^()]*\)$', line)
    if match:
        passed.append((match.group(1), match.group(2)))
unique = sorted(set(case for _, case in listed))
(root / 'unique-case-list.txt').write_text('\n'.join(unique) + '\n')
result = (f'listed project-qualified: {len(listed)}; unique: {len(unique)}\n'
          f'listed per project: {dict(Counter(project for project, _ in listed))}\n'
          f'passed project-qualified: {len(passed)}; per project: {dict(Counter(project for project, _ in passed))}\n'
          f'duplicate listed IDs: {len(listed) - len(set(listed))}\n'
          f'duplicate passed IDs: {len(passed) - len(set(passed))}\n'
          f'listed but not passed: {sorted(set(listed) - set(passed))}\n'
          f'passed but not listed: {sorted(set(passed) - set(listed))}\n')
(root / 'case-reconciliation.txt').write_text(result)
print(result)
