"""Bounded public-only prerequisite evidence. No auth or secret loading."""
import hashlib
import json
import subprocess
from datetime import datetime, timezone
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode
from urllib.request import Request, urlopen

# Tool workdir maps the requested host path to /workspace (observed pwd).
ROOT = Path.cwd()
PACKET = ROOT / 'docs/qa/quality/sanity-home-online-001'
FIXTURE = ROOT / '.local-tools/ola-qa/fixture-fzwRsz'
PATHS = [
    'src/content/sanity/preview-policy.ts',
    'src/content/sanity/preview-client.ts',
    'src/content/sanity/preview-fetch.ts',
    'src/content/sanity/home.ts',
    'src/components/pages/HomePage/HomePage.tsx',
    'src/app/[locale]/layout.tsx',
    'next.config.ts', 'package.json', 'package-lock.json',
]

def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()

def observe(url, count_only=False):
    try:
        with urlopen(Request(url, headers={'User-Agent': 'OLA-prereq-readonly/1'}), timeout=25) as response:
            data = response.read()
            row = {'url': url, 'status': response.status, 'final_url': response.url}
            if count_only:
                result = json.loads(data).get('result')
                row['published_home_count'] = result if type(result) is int else None
            else:
                row['body_bytes'] = len(data)
            return row
    except HTTPError as error:
        return {'url': url, 'status': error.code, 'final_url': error.url}
    except (URLError, TimeoutError) as error:
        return {'url': url, 'error_type': type(error).__name__}

result = {
    'observed_at': datetime.now(timezone.utc).isoformat(),
    'runtime': {'model': 'gpt-6.1-sol', 'provider': 'openai-codex',
                'basis': 'developer-injected actual runtime; completion metadata pending parent'},
    'git_head': subprocess.check_output(['git', 'rev-parse', 'HEAD'], cwd=ROOT, text=True).strip(),
    'vercel': {
        'project_link_exists': (ROOT / '.vercel/project.json').is_file(),
        'local_cli_exists': (ROOT / 'node_modules/.bin/vercel').exists(),
        'path_cli': None,
        'path_cli_basis': 'command -v vercel returned no path',
        'browser_observation': 'https://vercel.com/dashboard redirected to https://vercel.com/login?next=%2Fdashboard; title Login – Vercel',
        'vault_list': {'success': True, 'items': []},
        'authorized_access': False,
        'limits': 'This managed browser only; owner other sessions/accounts are not inspected.'
    },
    'viewer': {'loaded': False, 'validated': False, 'reason': 'Stop at confirmed deployment access blocker; no real-secret helper execution needed.'},
    'source_fixture_selected_bindings': [],
    'public_observations': []
}
for name in PATHS:
    a, b = ROOT / name, FIXTURE / name
    row = {'path': name, 'root_sha256': digest(a)}
    row['fixture_sha256'] = digest(b) if b.is_file() else None
    row['equal'] = row['root_sha256'] == row['fixture_sha256']
    result['source_fixture_selected_bindings'].append(row)
result['fresh_fixture_build_id'] = (FIXTURE / '.next/BUILD_ID').read_text().strip()
for locale in ['en', 'ru', 'sr']:
    result['public_observations'].append(observe(f'https://olaproject-chi.vercel.app/{locale}'))
result['public_observations'].append(observe('https://olaproject-chi.vercel.app/api/draft-mode/enable'))
result['public_observations'].append(observe('https://ola-studio-zhn2ddaj.sanity.studio/'))
query = urlencode({'query': 'count(*[_type == "homePage" && _id == "homePage"])', 'perspective': 'published'})
result['public_observations'].append(observe('https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production?' + query, count_only=True))
(PACKET / 'prerequisites.json').write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n')
print(json.dumps(result, ensure_ascii=False, indent=2))
