import json, hashlib
from pathlib import Path
from PIL import Image, ImageOps, ImageDraw
p = Path('docs/qa/contact/revision-1')
data = json.loads((p/'geometry.json').read_text())
locales = sorted({r['locale'] for r in data}); widths = sorted({r['width'] for r in data})
assert len({(r['locale'],r['width']) for r in data}) == len(data) == len(locales)*len(widths)
assert all(r['scrollWidth'] <= r['clientWidth'] and len(r['crops']) == 2 for r in data)
lines = [f"{len(data)} unique records = {locales} × {widths}; no document horizontal overflow."]
for photo,height,cutoff in [('02_contact',1236,1100),('03_contact',1328,1180)]:
    lines += ['',f'### {photo} (source height {height}, conservative cutoff row {cutoff})','', '| Width | viewport document x,y,w,h (CSS px) | image local x,y,w,h (CSS px) | source bottom (source px) | signed margin (CSS px) |','|---:|---|---|---:|---:|']
    for r in data:
        if r['locale'] != 'en': continue
        c = next(c for c in r['crops'] if photo in c['src']); v=c['viewport']; i=c['image']
        bottom=(v['y']+v['height']-i['y'])*height/i['height']
        margin=i['y']+cutoff*i['height']/height-(v['y']+v['height'])
        fmt=lambda nums: ', '.join(f'{n:.2f}' for n in nums)
        lines.append(f"| {r['width']} | {fmt([v['x'],v['y'],v['width'],v['height']])} | {fmt([i['x']-v['x'],i['y']-v['y'],i['width'],i['height']])} | {bottom:.2f} | {margin:+.2f} |")
(p/'crop-tables.md').write_text('\n'.join(lines)+'\n')
with (p/'screenshots.sha256').open('w') as f:
    for image in sorted(p.glob('*.png')):
        f.write(hashlib.sha256(image.read_bytes()).hexdigest()+'  '+str(image)+'\n')
# Inspection aid, RU long text at each transition and both sides.
chosen=[559,560,561,599,600,601,639,640,641,1099,1100,1101,1199,1200,1201]
thumbs=[]
for width in chosen:
    im=Image.open(p/f'ru-{width}.png').convert('RGB'); im.thumbnail((180,800))
    canvas=Image.new('RGB',(190,830),'white'); canvas.paste(im,((190-im.width)//2,25)); ImageDraw.Draw(canvas).text((5,5),str(width),fill='black'); thumbs.append(canvas)
sheet=Image.new('RGB',(190*5,830*3),'white')
for n,im in enumerate(thumbs): sheet.paste(im,((n%5)*190,(n//5)*830))
sheet.save(p/'ru-transitions-contact-sheet.jpg',quality=85)
print('\n'.join(lines))
