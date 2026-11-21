import os, json, shutil, socket, subprocess, time, importlib.util, traceback
from pathlib import Path
R=Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; F=Path('/tmp/ola-home-quality-001-fixture'); P=31876
spec=importlib.util.spec_from_file_location('previous',R/'docs/qa/quality/weddings-001/provenance-002/run.py'); old=importlib.util.module_from_spec(spec); spec.loader.exec_module(old)
inputs=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json','.prettierrc.json','.prettierignore','eslint.config.mjs']
def save(name,value): (E/name).write_text(json.dumps(value,indent=2,sort_keys=True)+'\n')
def free():
 s=socket.socket(); result=s.connect_ex(('127.0.0.1',P))!=0; s.close(); return result
def main():
 if F.exists() or not free(): raise RuntimeError('fixture exists or port occupied')
 root=old.manifest(R,inputs); deps=old.manifest(R,['node_modules']); save('before-inputs.json',root); save('dependencies.json',deps)
 family=R/'src/components/widgets/HomeBlocks'; snapshots={}
 for x in sorted(family.iterdir()):
  if x.is_file():
   dest=E/'before-sources'/(x.name+'.txt'); dest.parent.mkdir(exist_ok=True); shutil.copy2(x,dest); snapshots[str(x.relative_to(R))]={'snapshot':str(dest.relative_to(R)),'sha256':old.sha(x)}
 save('before-sources/manifest.json',snapshots)
 F.mkdir(); (F/'node_modules').symlink_to(R/'node_modules',target_is_directory=True)
 for p in inputs:
  src=R/p; dst=F/p
  if src.is_dir(): shutil.copytree(src,dst)
  elif src.is_file(): shutil.copy2(src,dst)
 assert old.manifest(F,inputs)==root
 d=E/'before'; d.mkdir(); env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
 with open(d/'build.log','wb') as log:
  result=subprocess.run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],cwd=F,env=env,stdout=log,stderr=subprocess.STDOUT)
 save('before/build-result.json',{'exit_code':result.returncode,'command':'next build --webpack','cwd':str(F)}); assert result.returncode==0
 assert old.manifest(F,inputs)==root and old.manifest(R,inputs)==root
 out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); artifacts=[]
 for p in ['BUILD_ID','build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
  src=out/p; dst=d/'artifacts'/p; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst); artifacts.append({'path':p,'sha256':old.sha(src)})
 save('before/build.json',{'build_id':bid,'artifacts':artifacts,'input_sha256':old.sha(E/'before-inputs.json'),'dependencies_sha256':old.sha(E/'dependencies.json')})
 log=open(d/'server.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(P),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env)
 try:
  for _ in range(100):
   if proc.poll() is not None: raise RuntimeError('server exited')
   if not free(): break
   time.sleep(.2)
  else: raise RuntimeError('server not ready')
  if os.readlink(f'/proc/{proc.pid}/cwd')!=str(F): raise RuntimeError('server cwd mismatch')
  stat=Path(f'/proc/{proc.pid}/stat').read_text(); start=stat[stat.rfind(')')+2:].split()[19]
  save('before/server-identity.json',{'pid':proc.pid,'cwd':str(F),'starttime':start,'proc_stat':stat,'build_id':bid})
  with open(d/'capture.log','wb') as f: capture=subprocess.run(['node',str(E/'capture.mjs'),'before',str(d/'captures'),str(F),bid],cwd=R,env=env,stdout=f,stderr=subprocess.STDOUT)
  save('before/capture-result.json',{'exit_code':capture.returncode}); assert capture.returncode==0
  assert proc.poll() is None and Path(f'/proc/{proc.pid}/stat').read_text().split(')')[-1].split()[19]==start
 finally:
  if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
  log.close(); save('before/cleanup.json',{'pid':proc.pid,'returncode':proc.returncode,'port_free':free()})
 assert free()
 save('before/post-identity.json',{'root_unchanged':old.manifest(R,inputs)==root,'fixture_inputs_unchanged':old.manifest(F,inputs)==root,'dependencies_unchanged':old.manifest(R,['node_modules'])==deps})
 # Preserve fixture for after build only after baseline evidence is complete.
if __name__=='__main__':
 try: main()
 except BaseException as e:
  save('BLOCKED.json',{'error':repr(e),'traceback':traceback.format_exc(),'fixture_exists':F.exists(),'port_free':free()}); raise
