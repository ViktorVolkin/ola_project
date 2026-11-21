"""One public root/manifest pair; residual pass only on exact convergence."""
from pathlib import Path
from datetime import datetime, timezone
import json
import hashlib
import urllib.request
import urllib.error

H = Path('/workspace/docs/qa/quality/sanity-home-online-001/studio-hosting')
OUT = H / 'public-postactivation'
BASE = 'https://ola-studio-zhn2ddaj.sanity.studio/'
DASH = 'https://www.sanity.io/@obdulf8du/studio/xxpedejjvg9va6r4u8t4llzw'
EXPECTED = '97d64ff536835aa18807a15fa03c9c67f9f96cf922eb4a2944a39c4dc414badb'
STAGED = Path('/workspace/.local-tools/ola-qa/sanity-home-online-hosting-deploy-candidate/dist')
sha = lambda value: hashlib.sha256(value).hexdigest()


class Manual(urllib.request.HTTPRedirectHandler):
    def redirect_request(self, *args, **kwargs):
        return None


opener = urllib.request.build_opener(Manual)
headers = ['date', 'location', 'cache-control', 'age', 'etag', 'last-modified', 'x-request-id', 'x-sanity-request-id', 'via', 'x-cache', 'cf-cache-status', 'content-type']

def get(path):
    url = BASE + path
    try:
        response = opener.open(url, timeout=30)
    except urllib.error.HTTPError as error:
        response = error
    body = response.read()
    row = {'observedAt': datetime.now(timezone.utc).isoformat(), 'path': path, 'url': url, 'status': response.code, 'headers': {key: response.headers.get(key) for key in headers}, 'bytes': len(body), 'sha256': sha(body)}
    return row, body

root, _ = get('')
manifest, body = get('static/create-manifest.json')
if manifest['status'] == 200:
    (OUT / 'public-manifest.json').write_bytes(body)
manifest['expectedSha256'] = EXPECTED
manifest['exact'] = manifest['status'] == 200 and manifest['sha256'] == EXPECTED
if manifest['status'] == 200:
    data = json.loads(body)
    manifest['createdAt'] = data.get('createdAt')
    manifest['workspaces'] = [{key: value.get(key) for key in ['name', 'projectId', 'dataset', 'schema', 'tools']} for value in data.get('workspaces', [])]
pair = {'root': root, 'manifest': manifest, 'exactRootRedirect': root['status'] == 302 and root['headers']['location'] == DASH, 'noAuthNoCookiesNoRetries': True}
(OUT / 'pair.json').write_text(json.dumps(pair, indent=2) + '\n')
print(json.dumps(pair, indent=2), flush=True)
if not pair['exactRootRedirect'] or not manifest['exact']:
    print('STOP: pair not converged; residual pass not authorized by condition.', flush=True)
else:
    # Residual set: same lexical depth-first inventory, minus every prior walked entry.
    prior = json.loads((H / 'readonly-diagnostic/first-mismatch-walk.json').read_text())
    done = {r['path'] for r in prior['rows']}
    build = json.loads((H / 'build-binding.json').read_text())
    original = {r['path']: r for r in build['files']}
    staged_mf = json.loads((STAGED / 'static/create-manifest.json').read_text())
    workspace = staged_mf['workspaces'][0]
    extras = {'static/create-manifest.json', 'static/' + workspace['schema'], 'static/' + workspace['tools']}
    paths = []
    def walk(directory, prefix=''):
        for path in sorted(directory.iterdir(), key=lambda path: path.name):
            assert not path.is_symlink()
            relative = prefix + path.name
            if path.is_dir():
                walk(path, relative + '/')
            else:
                assert relative in original or relative in extras
                paths.append(relative)
    walk(STAGED)
    remaining = [path for path in paths if path not in done]
    assert len(paths) == 359 and len(remaining) == 66
    rows = []
    for path in remaining:
        expected = (STAGED / path).read_bytes()
        if path in original:
            assert sha(expected) == original[path]['sha256'] and len(expected) == original[path]['bytes']
        row, _ = get(path)
        row.update(expectedSha256=sha(expected), expectedBytes=len(expected))
        row['exact'] = row['status'] == 200 and row['sha256'] == row['expectedSha256'] and row['bytes'] == row['expectedBytes']
        rows.append(row)
        (OUT / 'residual.json').write_text(json.dumps({'planned': 66, 'observed': len(rows), 'complete': len(rows) == 66 and all(r['exact'] for r in rows), 'compositeNotAtomic': True, 'rows': rows}, indent=2) + '\n')
        if not row['exact']:
            print(json.dumps({'STOP_FIRST_MISMATCH': row}, indent=2), flush=True)
            break
    else:
        print('Residual complete: 66 exact matches; composite evidence, not atomic full snapshot.', flush=True)
