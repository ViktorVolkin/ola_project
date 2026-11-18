import os,json,shutil,socket,subprocess,time,importlib.util
from pathlib import Path
R=Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; F=Path('/tmp/ola-home-quality-001-fixture'); P=31876
spec=importlib.util.spec_from_file_location('baseline',E/'before.py'); base=importlib.util.module_from_spec(spec); spec.loader.exec_module(base); old=base.old
root=old.manifest(R,base.inputs); before=json.loads((E/'before-inputs.json').read_text()); deps=json.loads((E/'dependencies.json').read_text()); diffs=sorted(k for k in set(root)|set(before) if root.get(k)!=before.get(k)); assert diffs and all(k.startswith('src/components/widgets/HomeBlocks/') for k in diffs)
assert old.manifest(R,['node_modules'])==deps and base.free() and F.is_dir() and old.manifest(F,base.inputs)==before
base.save('after-inputs.json',root); base.save('input-differences.json',diffs)
shutil.rmtree(F/'.next'); target=F/'src/components/widgets/HomeBlocks'; shutil.rmtree(target); shutil.copytree(R/'src/components/widgets/HomeBlocks',target); assert old.manifest(F,base.inputs)==root
d=E/'after'; d.mkdir(); env=os.environ.copy(); env['NEXT_TELEMETRY_DISABLED']='1'
with open(d/'build.log','wb') as f: result=subprocess.run(['node','/workspace/node_modules/next/dist/bin/next','build','--webpack'],cwd=F,env=env,stdout=f,stderr=subprocess.STDOUT)
base.save('after/build-result.json',{'exit_code':result.returncode,'command':'next build --webpack','cwd':str(F)}); assert result.returncode==0
assert old.manifest(F,base.inputs)==root and old.manifest(R,base.inputs)==root
out=F/'.next'; bid=(out/'BUILD_ID').read_text().strip(); artifacts=[]
for p in ['BUILD_ID','build-manifest.json','prerender-manifest.json','routes-manifest.json','server/app-paths-manifest.json']:
 src=out/p; dst=d/'artifacts'/p; dst.parent.mkdir(parents=True,exist_ok=True); shutil.copy2(src,dst); artifacts.append({'path':p,'sha256':old.sha(src)})
base.save('after/build.json',{'build_id':bid,'artifacts':artifacts,'input_sha256':old.sha(E/'after-inputs.json'),'dependencies_sha256':old.sha(E/'dependencies.json')})
log=open(d/'server.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(P),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT,env=env)
try:
 for _ in range(100):
  if proc.poll() is not None: raise RuntimeError('server exited')
  if not base.free(): break
  time.sleep(.2)
 else: raise RuntimeError('server not ready')
 assert os.readlink(f'/proc/{proc.pid}/cwd')==str(F)
 stat=Path(f'/proc/{proc.pid}/stat').read_text(); start=stat[stat.rfind(')')+2:].split()[19]; base.save('after/server-identity.json',{'pid':proc.pid,'cwd':str(F),'starttime':start,'proc_stat':stat,'build_id':bid})
 with open(d/'capture.log','wb') as f: result=subprocess.run(['node',str(E/'capture.mjs'),'after',str(d/'captures'),str(F),bid],cwd=R,env=env,stdout=f,stderr=subprocess.STDOUT)
 base.save('after/capture-result.json',{'exit_code':result.returncode}); assert result.returncode==0
 stat2=Path(f'/proc/{proc.pid}/stat').read_text(); assert stat2[stat2.rfind(')')+2:].split()[19]==start
finally:
 if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
 log.close(); base.save('after/cleanup.json',{'pid':proc.pid,'returncode':proc.returncode,'port_free':base.free()})
assert base.free()
