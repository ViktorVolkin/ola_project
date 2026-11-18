import json
from pathlib import Path
root = Path(__file__).parent
files = list((root / 'final-artifacts').glob('*/bounds.json'))
rows = sorted((json.loads(p.read_text()) for p in files), key=lambda r: (r['locale'], r['width']))
assert len(rows) == 9, len(rows)
(root / 'bounds.json').write_text(json.dumps(rows, ensure_ascii=False, separators=(',', ':')) + '\n')
for row in rows:
    print(row['locale'], row['width'], 'header', row['headerBounds']['height'], 'targets', len(row['metrics']), 'minimum', min(m['width'] for m in row['metrics']), min(m['height'] for m in row['metrics']), 'focused', row.get('focusBounds', {}).get('focused'))
