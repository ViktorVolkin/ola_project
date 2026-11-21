"""Single public walk, reuse already fetched selections, stop first mismatch."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import urllib.request
import urllib.error

ROOT = Path('/workspace')
H = ROOT / 'docs/qa/quality/sanity-home-online-001/studio-hosting'
OUT = H / 'readonly-diagnostic'
STAGED = ROOT / '.local-tools/ola-qa/sanity-home-online-hosting-deploy-candidate/dist'
BASE = 'https://ola-studio-zhn2ddaj.sanity.studio/'
b = json.loads((H / 'build-binding.json').read_text())
original = {f['path']: f for f in b['files']}
manifest = json.loads((STAGED / 'static/create-manifest.json').read_text())
w = manifest['workspaces'][0]
allowed_metadata = {'static/create-manifest.json', 'static/' + w['schema'], 'static/' + w['tools']}
cache = {f['path']: f for f in json.loads((OUT / 'selected-public-readback.json').read_text())['rows']}
sha = lambda v: hashlib.sha256(v).hexdigest()


class Manual(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


op = urllib.request.build_opener(Manual)
rows = []
# Lexical depth-first order matching the original Node readdir traversal.
paths = []
def walk(directory, prefix=''):
    for p in sorted(directory.iterdir(), key=lambda p: p.name):
        assert not p.is_symlink()
        relative = prefix + p.name
        if p.is_dir():
            walk(p, relative + '/')
        else:
            assert relative in original or relative in allowed_metadata
            paths.append(relative)
walk(STAGED)
for path in paths:
    local = (STAGED / path).read_bytes()
    if path in original:
        assert sha(local) == original[path]['sha256'] and len(local) == original[path]['bytes']
    if path in cache:
        row = dict(cache[path], reusedEarlierSelection=True)
    else:
        try:
            res = op.open(BASE + path, timeout=30)
        except urllib.error.HTTPError as error:
            res = error
        body = res.read()
        row = {'observedAt': datetime.now(timezone.utc).isoformat(), 'path': path, 'url': BASE + path, 'status': res.code, 'location': res.headers.get('Location'), 'contentType': res.headers.get('Content-Type'), 'bytes': len(body), 'sha256': sha(body), 'expectedBytes': len(local), 'expectedSha256': sha(local), 'exact': res.code == 200 and body == local}
    if path == 'index.html':
        row['acceptedCanonical'] = row['status'] == 301 and row['location'] == '/'
        accepted = row['acceptedCanonical']
    else:
        accepted = row['exact']
    rows.append(row)
    # Persist progress before stopping, unlike the original approved verifier.
    (OUT / 'first-mismatch-walk.json').write_text(json.dumps({'readOnly': True, 'totalLocalAllowlisted': len(paths), 'order': 'lexical-depth-first', 'complete': len(rows) == len(paths), 'firstMismatch': None if accepted else row, 'rows': rows}, indent=2) + '\n')
    if not accepted:
        print(json.dumps({'checked': len(rows), 'totalLocalAllowlisted': len(paths), 'firstMismatch': row}, indent=2))
        break
else:
    print(json.dumps({'checked': len(rows), 'allCurrentlyMatch': True}))
