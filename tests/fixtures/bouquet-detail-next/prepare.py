#!/usr/bin/env python3
"""Create an isolated source export. No project files or dependencies are mutated."""
import hashlib, json, os, shutil, sys, uuid
from pathlib import Path
from datetime import datetime, timezone

root = Path('/workspace')
# Unique fixture name: timestamp + short UUID to avoid collisions within same second
timestamp = datetime.now(timezone.utc).strftime('%Y%m%dT%H%M%SZ')
unique_suffix = uuid.uuid4().hex[:8]
fixture = Path('/home/pn/.cache') / f'ola-bd-next-fixture-{timestamp}-{unique_suffix}'
fixture.mkdir(exist_ok=False)
files = ['package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json', 'eslint.config.mjs']
for d in ['src', 'public']:
    shutil.copytree(root / d, fixture / d, symlinks=False, ignore=shutil.ignore_patterns('.env*', '.npmrc', '.git', 'node_modules', '.next'))
for f in files:
    shutil.copy2(root / f, fixture / f)
(fixture / 'node_modules').symlink_to(root / 'node_modules', target_is_directory=True)
manifest = {}
for base in ['src','public']:
    for original in (root / base).rglob('*'):
        if original.is_file():
            rel = original.relative_to(root)
            copy = fixture / rel
            if not copy.is_file():
                raise RuntimeError(f'not copied: {rel}')
            a = hashlib.sha256(original.read_bytes()).hexdigest()
            b = hashlib.sha256(copy.read_bytes()).hexdigest()
            if a != b: raise RuntimeError(f'hash mismatch: {rel}')
            manifest[str(rel)] = a
for f in files:
    manifest[f] = hashlib.sha256((root / f).read_bytes()).hexdigest()
    assert manifest[f] == hashlib.sha256((fixture / f).read_bytes()).hexdigest()
(fixture / 'snapshot.json').write_text(json.dumps(manifest, indent=2)+'\n')
route = fixture / 'src/app/[locale]/fixture/detail'
route.mkdir(parents=True)
shutil.copy2(root / 'tests/fixtures/bouquet-detail-next/page.tsx.txt', route / 'page.tsx')
def block(path, begin, end):
    s = (root / path).read_text()
    return s[s.index(begin):s.index(end)]
prefs = block('tests/e2e/bouquet-detail-preferences.spec.ts', 'const labels = {', '\nconst extraImages')
support = block('tests/e2e/bouquet-detail-supporting.spec.ts', 'const content = {', '\nconst files=')
gallery = block('tests/e2e/bouquet-detail-gallery.spec.ts', 'const labels = {', '\nlet script').replace('const labels =', 'const galleryLabels =')
(route / 'fixture-data.ts').write_text(prefs+'\n'+support+'\n'+gallery+'\nexport {labels, content, galleryLabels};\n')
print(fixture)
