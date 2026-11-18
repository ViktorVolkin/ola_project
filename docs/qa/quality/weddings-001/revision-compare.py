import hashlib
import json
from pathlib import Path
from PIL import Image, ImageChops

base = Path('/workspace/docs/qa/quality/weddings-001')
before = json.loads((base / 'revision-before/dom.json').read_text())
after = json.loads((base / 'revision-after/dom.json').read_text())
results = {}
for key in sorted(before):
    with Image.open(base / 'revision-before' / f'{key}.png') as left, Image.open(base / 'revision-after' / f'{key}.png') as right:
        left, right = left.convert('RGBA'), right.convert('RGBA')
        bbox = ImageChops.difference(left, right).getbbox() if left.size == right.size else None
        results[key] = {'dom_equal': before[key] == after[key], 'before_size': left.size, 'after_size': right.size, 'pixels_equal': left.size == right.size and left.tobytes() == right.tobytes(), 'difference_bbox': bbox}
inputs = json.loads((base / 'revision-after-inputs.json').read_text())
root_mismatches = []
fixture_mismatches = []
for name, expected in inputs.items():
    for prefix, mismatches in ((Path('/workspace'), root_mismatches), (Path('/tmp/ola-weddings-001-fixture'), fixture_mismatches)):
        file = prefix / name
        if not file.is_file() or hashlib.sha256(file.read_bytes()).hexdigest() != expected:
            mismatches.append(name)
result = {'cases': results, 'root_input_mismatches': root_mismatches, 'fixture_input_mismatches': fixture_mismatches}
(base / 'revision-comparison.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps(result, indent=2))
