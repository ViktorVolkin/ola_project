from pathlib import Path
import hashlib, json, shutil

qa = Path('/workspace/docs/qa/quality/cms-balloons-001')
source = qa / 'baseline'
target = qa / 'before-coherent'
exclude = {'balloons-cms.test.ts', 'balloons-render.test.ts', 'balloonsEditing.tsx', 'BalloonsPreviewStatus.tsx'}

def omit(directory, names):
    folder = Path(directory)
    ignored = {n for n in names if n in exclude or n in {'.next', 'tsconfig.tsbuildinfo'}}
    if folder.name in ('sanity', 'resolver') and str(folder).endswith(('src/content/sanity', 'src/content/resolver')):
        ignored.add('balloons.ts')
    return ignored

shutil.copytree(source, target, symlinks=True, ignore=omit)

def files(base, sub):
    return {str(p.relative_to(base)): hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted((base / sub).rglob('*')) if p.is_file()}
manifest = {'meaning': 'pre-Balloons source and pre-Balloons test state, from preserved first fixture plus tracked original widget/page bytes; no product test exclusions', 'excluded_balloons_task_additions': sorted(exclude | {'src/content/sanity/balloons.ts', 'src/content/resolver/balloons.ts'}), 'before_owned': files(target, 'src/components/pages/BalloonsPage') | files(target, 'src/components/widgets/BalloonsBlocks'), 'before_tests': files(target, 'tests/unit'), 'before_config': {p: hashlib.sha256((target / p).read_bytes()).hexdigest() for p in ['vitest.config.mts', 'tsconfig.json', 'next.config.ts', 'package.json', 'package-lock.json']}}
(qa / 'before-coherent-manifest.json').write_text(json.dumps(manifest, indent=2) + '\n')
print('created coherent before; test count', len(manifest['before_tests']))
