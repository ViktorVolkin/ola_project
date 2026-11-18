import os,json,shutil,subprocess,time,traceback,importlib.util
from pathlib import Path
R=Path('/workspace'); Q=R/'docs/qa/quality/weddings-001'; E=Q/'ru1440-003'; F=Path('/tmp/ola-weddings-001-fixture'); PORT=31877
spec=importlib.util.spec_from_file_location('old',Q/'provenance-002/run.py'); old=importlib.util.module_from_spec(spec); spec.loader.exec_module(old); old.E=E
inputs=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json']
def save(name,obj): (E/name).write_text(json.dumps(obj,indent=2,sort_keys=True)+'\n')
def phase_capture(phase,bid,expected):
 d=E/phase; env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'; log=open(d/'server-continuation.log','wb')
 proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(PORT),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env,start_new_session=True)
 try:
  for _ in range(100):
   if proc.poll() is not None: raise RuntimeError('server exited')
   if not old.free(): break
   time.sleep(.2)
  else: raise RuntimeError('server not ready')
  old.witness(d,'runtime-continuation',proc.pid,bid)
  old.run(['node',str(E/'capture.mjs'),str(d/'captures'),str(F),bid],R,d/'capture-continuation.log',env)
  old.witness(d,'runtime-after-continuation',proc.pid,bid)
  assert old.manifest(F,inputs)==expected
 finally:
  if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
  log.close(); save(phase+'/cleanup-continuation.json',{'pid':proc.pid,'returncode':proc.returncode,'port_free':old.free()}); assert old.free()
def main():
 assert F.is_dir() and old.free()
 root=json.loads((E/'after-inputs.json').read_text()); before=json.loads((E/'before-inputs.json').read_text()); deps=json.loads((E/'dependencies.json').read_text()); assert old.manifest(R,inputs)==root and old.manifest(F,inputs)==before and old.manifest(R,['node_modules'])==deps
 build=json.loads((E/'before/build.json').read_text()); bid=build['build_id']; assert (F/'.next/BUILD_ID').read_text().strip()==bid
 for a in build['artifacts']: assert old.sha(F/'.next'/a['path'])==a['sha256']
 phase_capture('before',bid,before)
 assert old.free(); shutil.rmtree(F/'.next'); w=F/'src/components/widgets/WeddingsBlocks'; shutil.rmtree(w); shutil.copytree(R/'src/components/widgets/WeddingsBlocks',w); assert old.manifest(F,inputs)==root
 d=E/'after'; d.mkdir(); env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
 result=old.run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],F,d/'build.log',env); assert old.manifest(F,inputs)==root
 out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); arts=[]
 for p in ['BUILD_ID','build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
  src=out/p; dst=d/'artifacts'/p; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst); arts.append({'path':p,'sha256':old.sha(src)})
 save('after/build.json',{'build_id':bid,'build':result,'artifacts':arts,'inputs_sha256':old.sha(E/'after-inputs.json'),'dependencies_sha256':old.sha(E/'dependencies.json')})
 phase_capture('after',bid,root)
 deps2=old.manifest(R,['node_modules']); save('final-identity.json',{'root_unchanged':old.manifest(R,inputs)==root,'dependencies_unchanged':deps2==deps,'dependency_diff':sorted(k for k in set(deps2)|set(deps) if deps2.get(k)!=deps.get(k))})
 shutil.rmtree(F); save('cleanup.json',{'fixture_absent':not F.exists(),'port_free':old.free()})
if __name__=='__main__':
 try: main()
 except BaseException as e:
  save('continuation-error.json',{'error':repr(e),'traceback':traceback.format_exc(),'fixture_exists':F.exists(),'port_free':old.free()}); raise
