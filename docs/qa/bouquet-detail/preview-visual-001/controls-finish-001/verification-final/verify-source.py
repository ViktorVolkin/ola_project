import hashlib, json
from pathlib import Path
root=Path('/workspace'); private=Path('/tmp/ola-controls-final-3223')
out=root/'docs/qa/bouquet-detail/preview-visual-001/controls-finish-001/verification-final'
manifest=json.loads((out/'source-before.json').read_text())
results={}
for name, expected in manifest.items():
    results[name]={side:hashlib.sha256((base/name).read_bytes()).hexdigest() for side,base in [('root',root),('private',private)]}
    results[name]['before']=expected
(out/'source-after.json').write_text(json.dumps(results,indent=2)+'\n')
bad=[name for name,v in results.items() if len(set(v.values()))!=1]
print(f'{len(results)} selected src/public/config inputs, mismatches={len(bad)}')
if bad: print('\n'.join(bad)); raise SystemExit(1)
