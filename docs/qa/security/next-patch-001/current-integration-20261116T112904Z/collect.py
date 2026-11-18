from pathlib import Path
import json,hashlib,urllib.request,concurrent.futures,datetime,subprocess
R=Path('/workspace'); O=Path(__file__).parent
ids=['GHSA-mfr8-8qww-v76h','GHSA-vc7v-qv4w-wrv8','GHSA-vvgp-ww4w-46vf','GHSA-rhh4-g77r-r9qj','GHSA-pc58-hwjq-p385','GHSA-7qx7-33qx-rqx2','GHSA-f3mh-rxg3-f5g2','GHSA-mcj8-r9mp-w47p']
urls={i:'https://api.github.com/repos/vercel/next.js/security-advisories/'+i for i in ids}
urls.update({'release':'https://api.github.com/repos/vercel/next.js/releases/tags/v16.4.5','next':'https://registry.npmjs.org/next/16.4.5','eslint-config-next':'https://registry.npmjs.org/eslint-config-next/16.4.5','advisory-list':'https://api.github.com/repos/vercel/next.js/security-advisories?per_page=100'})
def get(kv):
 k,u=kv
 try:
  with urllib.request.urlopen(urllib.request.Request(u,headers={'User-Agent':'OLA-maintenance-evidence'}),timeout=60) as r:d=json.load(r)
  (O/(k+'.json')).write_text(json.dumps({'url':u,'retrieved_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'data':d},indent=2)+'\n')
  return k,True
 except Exception as e:return k,str(e)
print(list(concurrent.futures.ThreadPoolExecutor(6).map(get,urls.items())))
for f in ['package.json','package-lock.json']:(O/(f+'.before')).write_bytes((R/f).read_bytes())
def inventory():
 files=[]
 for folder in ['src','tests','public','.github']:
  p=R/folder
  if p.exists():files.extend(x for x in p.rglob('*') if x.is_file() and not any(z in {'node_modules','.next','test-results','playwright-report','__pycache__'} for z in x.relative_to(R).parts))
 files.extend(x for x in R.iterdir() if x.is_file() and x.suffix in {'.json','.ts','.mts','.mjs','.cjs','.js'} and x.name!='next-env.d.ts')
 return {str(p.relative_to(R)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(set(files))}
(O/'inputs.before.json').write_text(json.dumps(inventory(),indent=2)+'\n')
(O/'git.before.txt').write_text(subprocess.check_output(['git','status','--short'],cwd=R,text=True))
(O/'resources.before.txt').write_text(subprocess.check_output(['du','-sh','node_modules','/home/pn/.npm'],cwd=R,text=True))
print('inputs',len(inventory()))
for i in ids:
 d=json.loads((O/(i+'.json')).read_text())['data'];print(i,d['severity'],d.get('withdrawn_at'),d['vulnerabilities'])
