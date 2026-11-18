from pathlib import Path
import hashlib, sys
roots = [Path('src'), Path('tests'), Path('public'), Path('.github')]
files = {p for root in roots if root.exists() for p in root.rglob('*') if p.is_file()}
for pattern in ['*config*', 'package*.json', '.nvmrc', '.env*', 'next-env.d.ts']:
    files.update(p for p in Path('.').glob(pattern) if p.is_file())
files = sorted(files, key=lambda p: p.as_posix())
text = ''.join(f'{hashlib.sha256(p.read_bytes()).hexdigest()}  {p.as_posix()}\n' for p in files)
Path(sys.argv[1]).write_text(text)
print('paths:', len(files), 'inventory sha256:', hashlib.sha256(text.encode()).hexdigest())
