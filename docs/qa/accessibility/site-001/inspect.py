import collections
import json
import socket
from pathlib import Path
root = Path(__file__).parent
rows = [json.loads(p.read_text()) for p in (root / 'raw').glob('*.json')]
for name in ['desktop-en-home-normal.json', 'mobile-en-home-menu.json']:
    r = json.loads((root / 'raw' / name).read_text())
    print(name, 'before', r['backgroundBefore'], 'document', r['document'], 'firstTab', r['firstTab'])
normal = [r for r in rows if r['state'] == 'normal']
print('normal status', collections.Counter(r.get('status') for r in normal))
print('main counts', collections.Counter(r['document']['main'] for r in normal))
print('h1 counts', collections.Counter(len(r['document']['h1']) for r in normal))
print('langs', collections.Counter((r['locale'], r['document']['lang']) for r in normal))
rules = rows[0]['axe']['rules']
print('rules', len(rules), sorted(r['ruleId'] for r in rules))
print('port3100 connect result', socket.socket().connect_ex(('127.0.0.1', 3100)))
