"""One bounded public selection; no credentials, SDK, runtime or retries."""
from pathlib import Path
from datetime import datetime, timezone
import hashlib
import json
import urllib.request
import urllib.error

BASE = 'https://ola-studio-zhn2ddaj.sanity.studio/'
ROOT = Path('/workspace')
HOSTING = ROOT / 'docs/qa/quality/sanity-home-online-001/studio-hosting'
OUT = HOSTING / 'readonly-diagnostic'
binding = json.loads((HOSTING / 'build-binding.json').read_text())
STAGED = ROOT / '.local-tools/ola-qa/sanity-home-online-hosting-deploy-candidate/dist'


class Manual(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


opener = urllib.request.build_opener(Manual)
sha = lambda b: hashlib.sha256(b).hexdigest()
paths = ['static/create-manifest.json'] + [r['path'] for r in binding['originPublicBundleWitnesses']]
rows = []
for path in paths:
    url = BASE + path
    try:
        response = opener.open(url, timeout=40)
    except urllib.error.HTTPError as error:
        response = error
    body = response.read()
    local = (STAGED / path).read_bytes()
    row = {'observedAt': datetime.now(timezone.utc).isoformat(), 'url': url, 'path': path, 'status': response.code, 'location': response.headers.get('Location'), 'contentType': response.headers.get('Content-Type'), 'bytes': len(body), 'sha256': sha(body), 'expectedBytes': len(local), 'expectedSha256': sha(local), 'exact': response.code == 200 and body == local}
    if path.endswith('.js'):
        row['productionOriginLiteralPresent'] = binding['previewOrigin'].encode() in body
    if path == 'static/create-manifest.json' and response.code == 200:
        (OUT / 'current-public-manifest.json').write_bytes(body)
        row['equalsOldManifestHash'] = sha(body) == '3e69f1c2712ed72b3e434d8b819ca9818b94a011c883e2ca3b65bfc1a14cfa3b'
    rows.append(row)
    if response.code in [401, 403] or (300 <= response.code < 400 and response.headers.get('Location', '').startswith('https://www.sanity.io')):
        break
(OUT / 'selected-public-readback.json').write_text(json.dumps({'readOnly': True, 'redirectsFollowed': False, 'retries': 0, 'rows': rows}, indent=2) + '\n')
print(json.dumps(rows, indent=2))
