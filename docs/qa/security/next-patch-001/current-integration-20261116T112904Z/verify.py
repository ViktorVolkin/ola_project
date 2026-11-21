from pathlib import Path
import json,hashlib,re,subprocess,socket,datetime
R=Path('/workspace');O=Path(__file__).parent
sha=lambda b:hashlib.sha256(b).hexdigest()
before=json.loads((O/'inputs.before.json').read_text())
files=[]
for folder in ['src','tests','public','.github']:
 p=R/folder
 if p.exists():files.extend(x for x in p.rglob('*') if x.is_file() and not any(z in {'node_modules','.next','test-results','playwright-report','__pycache__'} for z in x.relative_to(R).parts))
files.extend(x for x in R.iterdir() if x.is_file() and x.suffix in {'.json','.ts','.mts','.mjs','.cjs','.js'} and x.name!='next-env.d.ts')
after={str(p.relative_to(R)):sha(p.read_bytes()) for p in sorted(set(files))}
assert set(after)-set(before)=={'tests/e2e/security-next-patch.spec.ts'}
assert not set(before)-set(after)
(O/'inputs.after.json').write_text(json.dumps(dict(sorted(after.items())),indent=2)+'\n')
changed=[k for k in before if before[k]!=after.get(k)]
assert changed==['package-lock.json','package.json'],changed
old={}
for l in (R/'docs/qa/motion-scroll/001/revision-1/final/source-inputs-after.sha256').read_text().splitlines():
 h,n=l.split(maxsplit=1);old[n.removeprefix('./')]=h
historical={'old_count':len(old),'fresh_preimage_count':len(before),'old_only':sorted(old.keys()-before.keys()),'mismatches_on_297_common_inputs':[k for k in before if before[k]!=old.get(k)],'supplemental_current_hashes':{k:sha((R/k).read_bytes()) for k in old.keys()-before.keys()}}
assert not historical['mismatches_on_297_common_inputs']
assert all(historical['supplemental_current_hashes'][k]==old[k] for k in historical['supplemental_current_hashes'])
manifest=json.loads((R/'package.json').read_text());lock=json.loads((R/'package-lock.json').read_text());packages=lock['packages']
versions={n:{'manifest':manifest.get('dependencies',{}).get(n,manifest.get('devDependencies',{}).get(n)),'lock':packages['node_modules/'+n]['version'],'installed':json.loads((R/'node_modules'/n/'package.json').read_text())['version']} for n in ['next','eslint-config-next','framer-motion','lenis','react','react-dom','next-intl']}
for n in ['next','eslint-config-next']:
 assert set(versions[n].values())=={'16.4.5'}
 assert packages['node_modules/'+n]['integrity']==json.loads((O/(n+'.json')).read_text())['data']['dist']['integrity']
checks=[];missing=[]
for k,v in packages.items():
 if not k:continue
 p=R/k/'package.json'
 if p.exists():
  actual=json.loads(p.read_text())['version'];checks.append(k);assert actual==v['version'],(k,actual,v['version'])
 else:missing.append({'path':k,'optional':v.get('optional',False)})
assert all(v['optional'] for v in missing)
def cases(d):
 out=[]
 def walk(s):
  for sp in s.get('specs',[]):
   for t in sp['tests']:out.append({'project':t['projectName'],'file':sp['file'].split('/')[-1],'title':sp['title'],'status':t['status']})
  for sub in s.get('suites',[]):walk(sub)
 walk(d);return out
combined=cases(json.loads((O/'combined.json').read_text()))
oldcases=[]
for l in (R/'docs/qa/motion-scroll/001/revision-1/final/combined.log').read_text().splitlines():
 m=re.search(r'✓\s+\d+ \[([^]]+)\] › tests/e2e/([^:]+):\d+:\d+ › (.*) \([^()]*\)$',l)
 if m:oldcases.append(m.groups())
key=lambda x:(x['project'],x['file'],x['title'])
assert len(combined)==128 and len(set(map(key,combined)))==128
assert set(map(key,combined))==set(oldcases),(len(oldcases),set(map(key,combined))-set(oldcases))
comparison={'historical_accepted_cases':len(oldcases),'current_cases':len(combined),'unique_without_project':len({(x['file'],x['title']) for x in combined}),'missing_from_historical':[],'extra_to_historical':[],'current_nonpassing':[x for x in combined if x['status']!='expected'],'focused_rerun_stats':json.loads((O/'focused-keyboard.json').read_text())['stats'],'note':'Initial combined run remains 127 pass/1 fail, not relabeled 128 pass. Focused same-build rerun passed once; historical same-symptom native reduced-motion failure exists but causality unknown.'}
(O/'case-comparison.json').write_text(json.dumps(comparison,indent=2)+'\n')
# Same underlying audit records, not seven independent new production vulnerabilities.
a=json.loads((O/'audit.before.json').read_text());b=json.loads((O/'audit.after.json').read_text());assert a['vulnerabilities']==b['vulnerabilities']
with socket.socket() as s:
 try:s.bind(('127.0.0.1',3100));free=True
 except OSError:free=False
resources={}
for label,args in [('root_node_modules',['du','-sh','node_modules']),('npm_cache',['du','-sh','/home/pn/.npm']),('new_evidence',['du','-sh',str(O)]),('filesystem',['df','-h','.'])]:resources[label]=subprocess.check_output(args,cwd=R,text=True).strip()
(O/'git.after.txt').write_text(subprocess.check_output(['git','status','--short'],cwd=R,text=True))
for f in ['package.json','package-lock.json']:(O/(f+'.after')).write_bytes((R/f).read_bytes())
output={'observed_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'build_id':(R/'.next/BUILD_ID').read_text().strip(),'versions':versions,'fresh_input_count_before':len(before),'input_count_after':len(after),'before_inventory_sha256':sha((O/'inputs.before.json').read_bytes()),'after_inventory_sha256':sha((O/'inputs.after.json').read_bytes()),'changed_existing_inputs':changed,'added_input':['tests/e2e/security-next-patch.spec.ts'],'historical_identity':historical,'installed_lock_version_checks':len(checks),'absent_optional_entries':len(missing),'audit_unchanged':True,'port3100_free':free,'resources_after':resources}
(O/'verification.json').write_text(json.dumps(output,indent=2)+'\n');print(json.dumps(output,indent=2))
