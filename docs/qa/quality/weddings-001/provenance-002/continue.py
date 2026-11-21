#!/usr/bin/env python3
# Continue the same first build after a percent-encoded asset-path instrumentation error.
from run import *

def phase(p):
 d=E/p; expected=json.loads((E/(p+'-inputs.json')).read_text()); root=json.loads((E/'root-inputs.json').read_text()); inputs=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json']
 assert free() and manifest(F,inputs)==expected
 if p=='after':
  d.mkdir(); env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
  build=run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],F,d/'build.log',env); assert manifest(F,inputs)==expected
  out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); artifacts=[]
  for name in ['BUILD_ID','build-manifest.json','app-build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
   file=out/name
   if file.exists():
    dest=d/'artifacts'/name; dest.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(file,dest); artifacts.append({'path':name,'sha256':sha(file)})
  save(d/'build.json',{'phase':p,'input_manifest_sha256':sha(E/(p+'-inputs.json')),'dependency_manifest_sha256':sha(E/'dependencies.json'),'build_id':bid,'artifacts':artifacts,'build':build,'node':subprocess.check_output(['node','--version'],text=True).strip()})
 else:
  rec=json.loads((d/'build.json').read_text()); bid=rec['build_id']; assert (F/'.next/BUILD_ID').read_text().strip()==bid
  for x in rec['artifacts']: assert sha(F/'.next'/x['path'])==x['sha256'] and sha(d/'artifacts'/x['path'])==x['sha256']
 save(d/'emitted-static.json',manifest(F,['.next/static']))
 env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'; log=open(d/'server-continuation.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(PORT),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env,start_new_session=True)
 try:
  for _ in range(100):
   if proc.poll() is not None: raise RuntimeError('listener exited')
   if not free(): break
   time.sleep(.2)
  else: raise RuntimeError('listener not ready')
  witness(d,'runtime',proc.pid,bid)
  run(['node',str(E/'capture.mjs'),p,str(d/'captures'),str(F)],R,d/'capture.log',env)
  if p=='after':
   pre=witness(d,'suite-before',proc.pid,bid)
   suite=run(['node','/workspace/node_modules/@playwright/test/cli.js','test','--config',str(E/'playwright.config.mjs')],R,d/'e2e.log',env)
   post=witness(d,'suite-after',proc.pid,bid)
   assert pre['proc_stat'].split()[21]==post['proc_stat'].split()[21] and pre['assets']==post['assets']
   save(d/'suite-envelope.json',{'before':'suite-before.json','after':'suite-after.json','build':'build.json','input_manifest_sha256':sha(E/'after-inputs.json'),'dependency_manifest_sha256':sha(E/'dependencies.json'),'command_result':suite})
  witness(d,'runtime-after',proc.pid,bid); assert proc.poll() is None; assert manifest(F,inputs)==expected and manifest(R,inputs)==root
  assert manifest(F,['.next/static'])==json.loads((d/'emitted-static.json').read_text())
 finally:
  if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
  log.close(); save(d/'cleanup-continuation.json',{'at':now(),'pid':proc.pid,'returncode':proc.returncode,'port_free':free()}); assert free()

def main():
 assert F.is_dir() and F.stat().st_uid==os.getuid() and free()
 phase('before')
 assert free(); shutil.rmtree(F/'.next'); w=F/'src/components/widgets/WeddingsBlocks'; shutil.rmtree(w); shutil.copytree(R/'src/components/widgets/WeddingsBlocks',w)
 phase('after')
 deps=json.loads((E/'dependencies.json').read_text()); assert manifest(R,['node_modules'])==deps
 save(E/'execution.json',{'completed':now(),'fixture_size_bytes':sum(p.stat().st_size for p in F.rglob('*') if p.is_file() and not p.is_symlink()),'dependencies_unchanged':True,'fixture_owned':str(F)})
 shutil.rmtree(F); assert not F.exists() and free(); save(E/'final-cleanup.json',{'at':now(),'fixture_absent':not F.exists(),'port_free':free()})
if __name__=='__main__':
 try: main()
 except BaseException as e:
  save(E/'continuation-BLOCKED.json',{'at':now(),'error':repr(e),'fixture_exists':F.exists(),'port_free':free()}); raise
