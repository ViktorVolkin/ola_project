#!/usr/bin/env python3
import os,sys,json,hashlib,shutil,subprocess,time,socket,urllib.request,urllib.parse,re,datetime,signal
from pathlib import Path
R=Path('/workspace'); E=R/'docs/qa/quality/weddings-001/provenance-002'; Q=E.parent; F=Path('/tmp/ola-weddings-001-fixture'); PORT=31877
now=lambda:datetime.datetime.now(datetime.timezone.utc).isoformat()
def sha(p):
 h=hashlib.sha256()
 with open(p,'rb') as f:
  for b in iter(lambda:f.read(1048576),b''): h.update(b)
 return h.hexdigest()
def save(p,v): p.parent.mkdir(parents=True,exist_ok=True); p.write_text(json.dumps(v,indent=2,sort_keys=True)+'\n')
def manifest(root,paths):
 out={}
 for p in paths:
  p=root/p
  if p.is_file(): out[str(p.relative_to(root))]=sha(p)
  elif p.is_dir():
   for x in sorted(p.rglob('*')):
    if x.is_file(): out[str(x.relative_to(root))]=sha(x)
 return out
def free():
 s=socket.socket(); s.settimeout(1); r=s.connect_ex(('127.0.0.1',PORT)); s.close(); return r!=0
def run(cmd,cwd,log,env=None):
 t=now()
 with open(log,'wb') as f: p=subprocess.run(cmd,cwd=cwd,stdout=f,stderr=subprocess.STDOUT,env=env)
 result={'command':cmd,'cwd':str(cwd),'started':t,'ended':now(),'exit_code':p.returncode,'log':str(log.relative_to(E))}; print(result,flush=True)
 if p.returncode: raise RuntimeError(str(result))
 return result
def witness(dir,label,pid,buildid):
 if os.readlink('/proc/%s/cwd'%pid)!=str(F): raise RuntimeError('listener cwd changed')
 url=f'http://127.0.0.1:{PORT}/en/weddings-events'; body=urllib.request.urlopen(url).read(); (dir/(label+'.html')).write_bytes(body)
 paths=sorted(set(re.findall(rb'/_next/static/[^"? ]+\.(?:js|css)',body)))
 assets=[]
 for raw in paths:
  name=raw.decode(); emitted=F/'.next'/urllib.parse.unquote(name.removeprefix('/_next/')); data=urllib.request.urlopen('http://127.0.0.1:31877'+name).read(); emittedhash=sha(emitted); servedhash=hashlib.sha256(data).hexdigest()
  assets.append({'url':'http://127.0.0.1:31877'+name,'emitted_path':str(emitted.relative_to(F)),'emitted_sha256':emittedhash,'served_sha256':servedhash,'matches':emittedhash==servedhash})
 if not assets or not all(x['matches'] for x in assets) or (F/'.next/BUILD_ID').read_text().strip()!=buildid: raise RuntimeError('identity witness failed')
 record={'at':now(),'phase':dir.name,'pid':pid,'cwd':os.readlink('/proc/%s/cwd'%pid),'proc_stat':Path('/proc/%s/stat'%pid).read_text(),'build_id':buildid,'url':url,'html_sha256':hashlib.sha256(body).hexdigest(),'assets':assets}; save(dir/(label+'.json'),record); return record

def main():
 if F.exists() or not free(): raise RuntimeError('fixture exists or port occupied: stop')
 E.mkdir(exist_ok=True); inputs=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json']; root=manifest(R,inputs); save(E/'root-inputs.json',root)
 deps=manifest(R,['node_modules']); save(E/'dependencies.json',deps); print('dependencies',len(deps),flush=True)
 F.mkdir(); (F/'node_modules').symlink_to(R/'node_modules',target_is_directory=True)
 for path in inputs:
  src=R/path; dst=F/path
  if src.is_dir(): shutil.copytree(src,dst)
  elif src.is_file(): shutil.copy2(src,dst)
 snap=json.loads((Q/'before-sources/manifest.json').read_text()); w=F/'src/components/widgets/WeddingsBlocks'; shutil.rmtree(w); w.mkdir()
 for target,info in snap.items():
  src=R/info['snapshot']; assert sha(src)==info['sha256']; dst=F/target; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst)
 before=manifest(F,inputs); priorbefore=json.loads((Q/'revision-before-inputs.json').read_text()); priorafter=json.loads((Q/'revision-after-inputs.json').read_text()); assert before==priorbefore and root==priorafter
 save(E/'before-inputs.json',before); save(E/'after-inputs.json',root)
 diffs=sorted(k for k in set(before)|set(root) if before.get(k)!=root.get(k)); assert all(k.startswith('src/components/widgets/WeddingsBlocks/') for k in diffs); save(E/'input-differences.json',diffs)
 config=(Q/'revision-playwright.config.mjs').read_text().replace(str(Q/'revision-test-results'),str(E/'test-results')); (E/'playwright.config.mjs').write_text(config)
 for phase in ['before','after']:
  d=E/phase; d.mkdir(); expected=before if phase=='before' else root
  if phase=='after':
   assert free(); shutil.rmtree(F/'.next'); shutil.rmtree(w); shutil.copytree(R/'src/components/widgets/WeddingsBlocks',w)
  assert manifest(F,inputs)==expected
  env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
  build=run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],F,d/'build.log',env)
  assert manifest(F,inputs)==expected
  out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); artifacts=[]
  for path in ['BUILD_ID','build-manifest.json','app-build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
   p=out/path
   if p.exists(): dest=d/'artifacts'/path; dest.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(p,dest); artifacts.append({'path':path,'sha256':sha(p)})
  save(d/'build.json',{'phase':phase,'input_manifest_sha256':sha(E/(phase+'-inputs.json')),'dependency_manifest_sha256':sha(E/'dependencies.json'),'build_id':bid,'artifacts':artifacts,'build':build,'node':subprocess.check_output(['node','--version'],text=True).strip()})
  log=open(d/'server.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(PORT),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env,start_new_session=True)
  try:
   for _ in range(100):
    if proc.poll() is not None: raise RuntimeError('listener exited')
    if not free(): break
    time.sleep(.2)
   else: raise RuntimeError('listener not ready')
   first=witness(d,'runtime',proc.pid,bid)
   capture=run(['node',str(E/'capture.mjs'),phase,str(d/'captures'),str(F)],R,d/'capture.log',env)
   if phase=='after':
    pre=witness(d,'suite-before',proc.pid,bid)
    suite=run(['node','/workspace/node_modules/@playwright/test/cli.js','test','--config',str(E/'playwright.config.mjs')],R,d/'e2e.log',env)
    post=witness(d,'suite-after',proc.pid,bid)
    assert pre['proc_stat'].split()[21]==post['proc_stat'].split()[21] and pre['assets']==post['assets']
    save(d/'suite-envelope.json',{'before':'suite-before.json','after':'suite-after.json','build':'build.json','input_manifest_sha256':sha(E/'after-inputs.json'),'dependency_manifest_sha256':sha(E/'dependencies.json'),'command_result':suite})
   witness(d,'runtime-after',proc.pid,bid); assert proc.poll() is None; assert manifest(F,inputs)==expected; assert manifest(R,inputs)==root
  finally:
   if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
   log.close(); save(d/'cleanup.json',{'at':now(),'pid':proc.pid,'returncode':proc.returncode,'port_free':free()}); assert free()
 assert manifest(R,['node_modules'])==deps
 save(E/'execution.json',{'completed':now(),'fixture_size_bytes':sum(p.stat().st_size for p in F.rglob('*') if p.is_file() and not p.is_symlink()),'dependencies_unchanged':True,'root_unchanged':manifest(R,inputs)==root,'fixture_owned':str(F)})
 shutil.rmtree(F); assert not F.exists() and free()
if __name__=='__main__':
 try: main()
 except BaseException as e:
  save(E/'BLOCKED.json',{'at':now(),'error':repr(e),'fixture_exists':F.exists(),'port_free':free()}); raise
