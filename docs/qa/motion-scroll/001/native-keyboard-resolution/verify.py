from pathlib import Path
import json, hashlib
R=Path('/workspace'); O=Path(__file__).parent; S=R/'docs/qa/security/next-patch-001/current-integration-20261116T112904Z'
def cases(d):
 out=[]
 def walk(s):
  for sp in s.get('specs',[]):
   for t in sp['tests']:out.append((t['projectName'],sp['file'].split('/')[-1],sp['title'],t['status']))
  for sub in s.get('suites',[]):walk(sub)
 walk(d);return out
new=cases(json.loads((O/'combined.json').read_text()));old=cases(json.loads((S/'combined.json').read_text()))
key=lambda r:r[:3]
assert len(new)==128 and len(set(map(key,new)))==128 and set(map(key,new))==set(map(key,old))
assert all(x[3]=='expected' for x in new)
inputs=json.loads((S/'inputs.after.json').read_text());diff={}
for p,h in inputs.items():
 f=R/p; actual=hashlib.sha256(f.read_bytes()).hexdigest() if f.is_file() else None
 if actual!=h:diff[p]={'before':h,'now':actual}
assert set(diff)=={'tests/e2e/motion-scroll.spec.ts'},diff
raw=json.loads((O/'probe-results.json').read_text());settled=json.loads((O/'probe-scrollend-results.json').read_text())
out={'combined_stats':json.loads((O/'combined.json').read_text())['stats'],'case_count':len(new),'unique_without_project':len({r[1:3] for r in new}),'same_128_ids_as_security':True,'input_differences':diff,'build_id':(R/'.next/BUILD_ID').read_text().strip(),'focused_first_stats':json.loads((O/'focused.json').read_text())['stats'],'focused_final_stats':json.loads((O/'focused-final.json').read_text())['stats'],'raw_stuck':{k:sum(x['y']>100 for x in raw if x['kind']==k) for k in ['control','app']},'settled_pass':{k:sum(x['y']>100 and any(e['type']=='scrollend' and e['y']==0 for e in x['log']['events']) for x in settled if x['kind']==k) for k in ['control','app']},'app_roots':sorted({x['root'] for x in raw if x['kind']=='app'}),'app_fonts_initial':sorted({x['log']['initial']['fonts'] for x in raw if x['kind']=='app'}),'trusted_unprevented_home':sum(any(e['type']=='keydown' and e['key']=='Home' and e['trusted'] and not e['prevented'] for e in x['log']['events']) for x in raw)}
(O/'verification.json').write_text(json.dumps(out,indent=2)+'\n');print(json.dumps(out,indent=2))
