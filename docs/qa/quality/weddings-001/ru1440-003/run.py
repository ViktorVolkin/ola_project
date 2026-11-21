import os, sys, json, shutil, socket, subprocess, time, traceback, importlib.util
from pathlib import Path
R=Path('/workspace'); Q=R/'docs/qa/quality/weddings-001'; E=Q/'ru1440-003'; F=Path('/tmp/ola-weddings-001-fixture'); PORT=31877
spec=importlib.util.spec_from_file_location('old', Q/'provenance-002/run.py'); old=importlib.util.module_from_spec(spec); spec.loader.exec_module(old); old.E=E
inputs=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json']
def save(name, obj): (E/name).write_text(json.dumps(obj,indent=2,sort_keys=True)+'\n')
def main():
 if F.exists() or not old.free(): raise RuntimeError('fixture exists or port occupied')
 root=old.manifest(R,inputs); prior=json.loads((Q/'provenance-002/after-inputs.json').read_text()); assert root==prior
 deps=old.manifest(R,['node_modules']); previous=json.loads((Q/'provenance-002/dependencies.json').read_text()); save('identity.json',{'root_matches_prior':root==prior,'root_count':len(root),'dependencies_match_prior':deps==previous,'dependency_count':len(deps),'dependency_diff':sorted(k for k in set(deps)|set(previous) if deps.get(k)!=previous.get(k)),'prior_inputs_sha256':old.sha(Q/'provenance-002/after-inputs.json'),'prior_dependencies_sha256':old.sha(Q/'provenance-002/dependencies.json')}); save('dependencies.json',deps); save('after-inputs.json',root)
 F.mkdir(); (F/'node_modules').symlink_to(R/'node_modules',target_is_directory=True)
 for p in inputs:
  s=R/p; d=F/p
  if s.is_dir(): shutil.copytree(s,d)
  elif s.is_file(): shutil.copy2(s,d)
 w=F/'src/components/widgets/WeddingsBlocks'; shutil.rmtree(w); w.mkdir()
 for target,info in json.loads((Q/'before-sources/manifest.json').read_text()).items():
  src=R/info['snapshot']; assert old.sha(src)==info['sha256']; dst=F/target; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst)
 before=old.manifest(F,inputs); assert before==json.loads((Q/'provenance-002/before-inputs.json').read_text()); save('before-inputs.json',before)
 for phase,expected in [('before',before),('after',root)]:
  d=E/phase; d.mkdir();
  if phase=='after':
   assert old.free(); shutil.rmtree(F/'.next'); shutil.rmtree(w); shutil.copytree(R/'src/components/widgets/WeddingsBlocks',w)
  assert old.manifest(F,inputs)==expected
  env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
  build=old.run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],F,d/'build.log',env)
  assert old.manifest(F,inputs)==expected
  out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); arts=[]
  for p in ['BUILD_ID','build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
   src=out/p; dst=d/'artifacts'/p; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst); arts.append({'path':p,'sha256':old.sha(src)})
  save(phase+'/build.json',{'build_id':bid,'build':build,'artifacts':arts,'inputs_sha256':old.sha(E/(phase+'-inputs.json')),'dependencies_sha256':old.sha(E/'dependencies.json')})
  log=open(d/'server.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(PORT),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env,start_new_session=True)
  try:
   for _ in range(100):
    if proc.poll() is not None: raise RuntimeError('server exited')
    if not old.free(): break
    time.sleep(.2)
   else: raise RuntimeError('server not ready')
   old.witness(d,'runtime',proc.pid,bid)
   old.run(['node',str(E/'capture.mjs'),str(d/'captures'),str(F),bid],R,d/'capture.log',env)
   old.witness(d,'runtime-after',proc.pid,bid)
   assert old.manifest(F,inputs)==expected and old.manifest(R,inputs)==root
  finally:
   if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
   log.close(); save(phase+'/cleanup.json',{'pid':proc.pid,'returncode':proc.returncode,'port_free':old.free()}); assert old.free()
 deps2=old.manifest(R,['node_modules']); save('final-identity.json',{'root_unchanged':old.manifest(R,inputs)==root,'dependencies_unchanged':deps2==deps,'dependency_diff':sorted(k for k in set(deps2)|set(deps) if deps2.get(k)!=deps.get(k))})
 shutil.rmtree(F); save('cleanup.json',{'fixture_absent':not F.exists(),'port_free':old.free()})
if __name__=='__main__':
 try: main()
 except BaseException as e:
  save('execution-error.json',{'error':repr(e),'traceback':traceback.format_exc(),'fixture_exists':F.exists(),'port_free':old.free()}); raise
