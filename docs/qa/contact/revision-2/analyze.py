import json, hashlib
from pathlib import Path
from PIL import Image
p=Path('docs/qa/contact/revision-2')
data=json.loads((p/'geometry.json').read_text())
widths=[320,360,375,559,560,561,599,600,601,639,640,641,768,900,1024,1099,1100,1101,1199,1200,1201,1440]
assert {(r['locale'],r['width']) for r in data} == {(l,w) for l in ['en','ru','sr'] for w in widths} and len(data)==66
assert all(r['scrollWidth']<=r['clientWidth'] and len(r['crops'])==2 for r in data)
lines=['66 unique locale/width records; no document overflow.','Source bottom = (viewport bottom - image top) × source height / image height. Signed CSS margin = image top + cutoff × image height / source height - viewport bottom. Positive means cutoff is below viewport.']
for photo,height,cutoff in [('02_contact',1236,1100),('03_contact',1328,1180)]:
 lines += ['',f'## {photo}: source height {height}, cutoff {cutoff}','','| locale | width | viewport x,y,w,h | image local x,y,w,h | source bottom | signed CSS margin |','|---|---:|---|---|---:|---:|']
 margins=[]
 for r in data:
  c=next(c for c in r['crops'] if photo in c['src']); v=c['viewport']; i=c['image']
  bottom=(v['y']+v['height']-i['y'])*height/i['height']; margin=i['y']+cutoff*i['height']/height-(v['y']+v['height']); margins.append(margin)
  fmt=lambda ns:', '.join(f'{n:.2f}' for n in ns)
  lines.append(f"| {r['locale']} | {r['width']} | {fmt([v['x'],v['y'],v['width'],v['height']])} | {fmt([i['x']-v['x'],i['y']-v['y'],i['width'],i['height']])} | {bottom:.2f} | {margin:+.2f} |")
 lines.append(f'\nMinimum signed margin: {min(margins):.4f} CSS px.')
(p/'crop-tables.md').write_text('\n'.join(lines)+'\n')
for r in data:
 if r['width'] not in [1099,1100,1101,1199,1200,1440]: continue
 # Geography section is second section; keep full width, section height at native pixels.
 section=r['sections'][1]; image=Image.open(p/f"{r['locale']}-{r['width']}.png")
 y=max(0,int(section['y'])); bottom=min(image.height,int(section['y']+section['height']+1))
 image.crop((0,y,image.width,bottom)).save(p/f"geo-{r['locale']}-{r['width']}.png")
with (p/'screenshots.sha256').open('w') as f:
 for image in sorted(p.glob('*.png')): f.write(hashlib.sha256(image.read_bytes()).hexdigest()+'  '+str(image)+'\n')
print('66 records analyzed; crop tables and native section crops generated')
