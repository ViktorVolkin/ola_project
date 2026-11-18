import json,hashlib,re
from pathlib import Path
from PIL import Image,ImageChops
R=Path('/workspace'); E=R/'docs/qa/quality/weddings-001/provenance-002'
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
def load(p): return json.loads(p.read_text())
b=load(E/'before-inputs.json'); a=load(E/'after-inputs.json'); diff=[k for k in set(a)|set(b) if a.get(k)!=b.get(k)]; assert len(diff)==39 and all(k.startswith('src/components/widgets/WeddingsBlocks/') for k in diff)
for k,v in a.items(): assert sha(R/k)==v,k
for top in ['src','public']:
 assert {str(p.relative_to(R)) for p in (R/top).rglob('*') if p.is_file()}=={k for k in a if k.startswith(top+'/')}
results={}; capture={}
for phase in ['before','after']:
 d=E/phase; build=load(d/'build.json'); assert build['input_manifest_sha256']==sha(E/(phase+'-inputs.json')); assert build['dependency_manifest_sha256']==sha(E/'dependencies.json'); assert build['build']['exit_code']==0
 for x in build['artifacts']: assert sha(d/'artifacts'/x['path'])==x['sha256']
 assert (d/'artifacts/BUILD_ID').read_text().strip()==build['build_id']; emitted=load(d/'emitted-static.json'); runtime=load(d/'runtime.json'); end=load(d/'runtime-after.json'); assert runtime['pid']==end['pid'] and runtime['proc_stat'].split()[21]==end['proc_stat'].split()[21] and runtime['build_id']==end['build_id']==build['build_id']
 for w in [runtime,end]:
  for x in w['assets']: assert x['matches'] and x['emitted_sha256']==x['served_sha256']==emitted[x['emitted_path']]
 capture[phase]=load(d/'captures/dom.json'); assert len(capture[phase])==9
 for key,c in capture[phase].items():
  assert c['phase']==phase and c['status']==200 and not c['errors'] and c['assets'] and c['overflow']['width']==c['overflow']['scrollWidth']; assert c['html_sha256']==sha(d/'captures'/f'{key}.html'); assert all(i['complete'] and i['width'] and not i['error'] for i in c['images'])
  for x in c['assets']: assert x['matches'] and x['emitted_sha256']==x['served_sha256']==emitted[x['emitted_path']]
 assert load(d/'cleanup-continuation.json')['port_free']; results[phase]={'build_id':build['build_id'],'pid':runtime['pid'],'assets_in_build':len(emitted),'capture_count':len(capture[phase])}
assert set(capture['before'])==set(capture['after'])
comparisons={}
for key in sorted(capture['before']):
 l=capture['before'][key]; r=capture['after'][key]; fields=['status','errors','images','overflow','data']
 with Image.open(E/'before/captures'/f'{key}.png') as im1, Image.open(E/'after/captures'/f'{key}.png') as im2:
  i1,i2=im1.convert('RGBA'),im2.convert('RGBA'); comparisons[key]={'dom_equal':all(l[f]==r[f] for f in fields),'size_before':i1.size,'size_after':i2.size,'rgba_equal':i1.size==i2.size and i1.tobytes()==i2.tobytes()}
env=load(E/'after/suite-envelope.json'); p=load(E/'after/suite-before.json'); q=load(E/'after/suite-after.json'); assert env['command_result']['exit_code']==0 and p['pid']==q['pid']==results['after']['pid'] and p['proc_stat'].split()[21]==q['proc_stat'].split()[21] and p['assets']==q['assets'] and p['build_id']==q['build_id']==results['after']['build_id']; assert env['input_manifest_sha256']==sha(E/'after-inputs.json'); assert env['dependency_manifest_sha256']==sha(E/'dependencies.json')
log=(E/'after/e2e.log').read_text(); assert re.search(r'24 passed',log); assert load(E/'test-results/.last-run.json')['status']=='passed'; assert load(E/'execution.json')['dependencies_unchanged']; assert load(E/'final-cleanup.json')['fixture_absent'] and load(E/'final-cleanup.json')['port_free']
result={'source_difference_count':len(diff),'current_root_matches_after':True,'phases':results,'comparisons':comparisons,'suite_24_passed':True,'cleanup':load(E/'final-cleanup.json')}; (E/'verification.json').write_text(json.dumps(result,indent=2)+'\n'); print(json.dumps(result,indent=2)); assert all(x['dom_equal'] and x['rgba_equal'] for x in comparisons.values())
