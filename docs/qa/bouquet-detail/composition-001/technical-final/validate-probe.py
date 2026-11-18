import json
from pathlib import Path
p=Path(__file__).with_name('page-probe.json')
rows=json.loads(p.read_text())
assert [r['width'] for r in rows]==[360,768,1440]
expected=[('A',None),*[('BUTTON','button')]*4,('INPUT','radio'),*[('INPUT','checkbox')]*3,('INPUT','text'),('TEXTAREA',None),('A',None),*[('SUMMARY',None)]*3,('A',None)]
for row in rows:
 f=row['focuses']; l=row['layout']; w=row['width']
 assert [(x['tag'],x['type']) for x in f]==expected, w
 assert all(x['visible'] for x in f), w
 assert all(x['outlineStyle']=='solid' and float(x['outlineWidth'].removesuffix('px'))>=2 for i,x in enumerate(f) if i not in [5,6,7,8]),w
 assert len(l['disabled'])==6 and all(x['disabled'] for x in l['disabled']),w
 assert l['information']['y']<l['related']['y']<l['custom']['y'],w
 assert l['preferences']['y']<l['action']['y']<l['information']['y'],w
 if w != 1440: assert l['h1']['y']<l['gallery']['y']<l['preferences']['y'],w
 else: assert l['gallery']['x']<l['preferences']['x'] and l['h1']['x']==l['preferences']['x'],w
 print(f"PASS EN {w}: sequential focus 16, 12 direct focused outlines, 6 native disabled skipped, section geometry")
print('NOTE choice focus is on input; probe collected parent label, not styled sibling. Use existing Preferences computed sibling and new full viewport capture; no parent-outline assertion.')
