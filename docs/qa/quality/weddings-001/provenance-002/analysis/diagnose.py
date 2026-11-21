from pathlib import Path
from html.parser import HTMLParser
from urllib.parse import urlsplit, parse_qs
from PIL import Image
import json, hashlib, re
R=Path('/workspace'); E=R/'docs/qa/quality/weddings-001/provenance-002'; O=E/'analysis'
def load(p): return json.loads(p.read_text())
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def start(w): return w['proc_stat'][w['proc_stat'].rfind(')')+2:].split()[19]
class Images(HTMLParser):
 def __init__(self): super().__init__(); self.images=[]
 def handle_starttag(self,tag,attrs):
  if tag=='img': self.images.append(dict(attrs))
ph={s:load(E/s/'captures/dom.json') for s in ('before','after')}
a,b=(ph[s]['ru-1440'] for s in ('before','after'))
diffs={field:[{'index':i,'before':x,'after':y} for i,(x,y) in enumerate(zip(a[field],b[field])) if x!=y] for field in ('images','data')}
assert len(a['data'])==len(b['data']) and len(a['images'])==len(b['images']) and len(diffs['data'])==3 and not diffs['images']
tags={}
for s in ('before','after'):
 p=Images(); p.feed((E/s/'captures/ru-1440.html').read_text()); tags[s]=p.images
man={s:load(E/(s+'-inputs.json')) for s in ('before','after')}
items=[]
for d in diffs['data']:
 x,y=d['before'],d['after']; q1=parse_qs(urlsplit(x['src']).query); q2=parse_qs(urlsplit(y['src']).query); assert q1['url']==q2['url'] and q1['w']==['128'] and q2['w']==['256']
 path='public'+q1['url'][0]; ht=[]
 for s in ('before','after'):
  matches=[t for t in tags[s] if t.get('alt')==x['alt'] and q1['url'][0] in parse_qs(urlsplit(t.get('src','')).query).get('url',[])]
  assert len(matches)==1; ht.append(matches[0])
  candidates=[z.strip().split()[0] for z in matches[0]['srcset'].split(',')]; assert x['src'] in candidates and y['src'] in candidates
 assert ht[0]['srcset']==ht[1]['srcset'] and ht[0]['sizes']==ht[1]['sizes'] and man['before'][path]==man['after'][path]==sha(R/path)
 items.append({'dom_diff':d,'html_before':ht[0],'html_after':ht[1],'html_differing_fields':{k:[ht[0].get(k),ht[1].get(k)] for k in set(ht[0])|set(ht[1]) if ht[0].get(k)!=ht[1].get(k)},'public_path':path,'public_sha256':sha(R/path),'candidate_membership_both_phases':True})
img=[Image.open(E/s/'captures/ru-1440.png').convert('RGBA') for s in ('before','after')]; assert img[0].size==img[1].size
W,H=img[0].size; p0,p1=img[0].load(),img[1].load(); boxes=[]
for it in items:
 x,y,w,h=it['dom_diff']['before']['rect']; assert all(isinstance(n,int) for n in (x,y,w,h)); boxes.append((x,y,x+w,y+h))
counts=[0]*4; bounds=[None]*4
for y in range(H):
 for x in range(W):
  if p0[x,y]!=p1[x,y]:
   ix=next((i for i,(l,t,r,b) in enumerate(boxes) if l<=x<r and t<=y<b),3); counts[ix]+=1
   z=bounds[ix]; bounds[ix]=[x,y,x+1,y+1] if z is None else [min(x,z[0]),min(y,z[1]),max(x+1,z[2]),max(y+1,z[3])]
for n,im in zip(('before','after'),img): im.crop((380,700,1200,945)).save(O/(n+'-diagnostic-crop.png'))
result={'coordinate_note':'Boxes use full-page pixel coordinates; DPR configured 1. Recorded getBoundingClientRect is viewport-relative; scrollX/Y not retained; zero scroll at DOM read is an assumption, not observed. The containment is conditional on zero scroll and no full-page capture offset. Crop is diagnostic only.', 'size':[W,H], 'dom_field_differences':diffs,'items':items,'boxes_assuming_zero_scroll':boxes,'changed_pixels':sum(counts),'counts_per_image_then_outside':counts,'bounds_per_image_then_outside_exclusive':bounds}
(O/'ru-1440-diff.json').write_text(json.dumps(result,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'counts':counts,'bounds':bounds,'size':[W,H]},ensure_ascii=False))
# Recompute recorded provenance links; served response bodies themselves are not retained.
checks={}
for s in ('before','after'):
 d=E/s; build=load(d/'build.json'); emitted=load(d/'emitted-static.json'); runtime=load(d/'runtime.json'); end=load(d/'runtime-after.json'); capture=ph[s]
 def witness(w):
  assert w['build_id']==build['build_id']; assert sha(d/(w['label']+'.html'))==w['html_sha256'] if 'label' in w else True
  assert all(x['matches'] and x['served_sha256']==x['emitted_sha256']==emitted[x['emitted_path']] for x in w['assets'])
 assert build['input_manifest_sha256']==sha(E/(s+'-inputs.json')) and build['dependency_manifest_sha256']==sha(E/'dependencies.json') and build['build']['exit_code']==0
 assert all(sha(d/'artifacts'/x['path'])==x['sha256'] for x in build['artifacts']) and (d/'artifacts/BUILD_ID').read_text().strip()==build['build_id']
 for label,w in [('runtime',runtime),('runtime-after',end)]: w['label']=label; witness(w)
 assert runtime['pid']==end['pid'] and start(runtime)==start(end)
 for key,c in capture.items():
  assert c['runtime_witness']=='../runtime.json' and c['phase']==s and c['html_sha256']==sha(d/'captures'/(key+'.html')) and c['assets']
  assert all(x['matches'] and x['served_sha256']==x['emitted_sha256']==emitted[x['emitted_path']] for x in c['assets'])
 checks[s]={'build_id':build['build_id'],'pid':runtime['pid'],'process_start_ticks':start(runtime),'build_artifacts':len(build['artifacts']),'emitted_inventory':len(emitted),'captures':len(capture),'capture_asset_records':sum(len(c['assets']) for c in capture.values()),'input_manifest_sha256':sha(E/(s+'-inputs.json')),'runtime_assets':len(runtime['assets'])}
p=load(E/'after/suite-before.json'); q=load(E/'after/suite-after.json'); env=load(E/'after/suite-envelope.json'); end=load(E/'after/runtime-after.json'); runtime=load(E/'after/runtime.json'); emitted=load(E/'after/emitted-static.json')
for label,w in [('suite-before',p),('suite-after',q)]:
 assert sha(E/'after'/(label+'.html'))==w['html_sha256']; assert all(x['matches'] and x['served_sha256']==x['emitted_sha256']==emitted[x['emitted_path']] for x in w['assets'])
assert p['pid']==q['pid']==runtime['pid']==end['pid'] and len({start(w) for w in [p,q,runtime,end]})==1 and p['assets']==q['assets'] and p['build_id']==q['build_id']==checks['after']['build_id']
assert env['input_manifest_sha256']==sha(E/'after-inputs.json') and env['dependency_manifest_sha256']==sha(E/'dependencies.json') and env['command_result']['exit_code']==0 and re.search(r'24 passed',(E/'after/e2e.log').read_text())
assert all(sha(R/k)==v for k,v in man['after'].items())
checks['suite']={'pid':p['pid'],'process_start_ticks':start(p),'same_assets_before_after':True,'logged_24_passed':True,'suite_response_body_or_success_traces_retained':False}
checks['limits']=['Raw emitted JS/CSS and served response bodies not retained in provenance packet: recorded digest equality is independently cross-checkable, bytes not independently rehashed.','Build input binding and process chronology rely on contemporaneous instrumentation records, not independent immutable attestation.','Suite-specific response bodies / successful traces not retained; witnesses bracket suite, not per-test proof.','DPR configured but actual window.devicePixelRatio and scroll offsets not retained.']
(O/'provenance-check.json').write_text(json.dumps(checks,indent=2)+'\n'); print(json.dumps(checks,indent=2))
