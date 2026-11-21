import json, os, socket, subprocess, time, hashlib, urllib.request
from pathlib import Path
R=Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; F=Path('/tmp/ola-home-quality-001-fixture'); port=31876
phase=os.environ.get('PHASE','before'); d=E/phase
s=socket.socket(); assert s.connect_ex(('127.0.0.1',port))!=0; s.close()
bid=(F/'.next/BUILD_ID').read_text().strip(); assert bid==json.loads((d/'build.json').read_text())['build_id']
log=open(d/'suite-server.log','wb'); proc=subprocess.Popen(['node','/workspace/node_modules/next/dist/bin/next','start','-p',str(port),'-H','127.0.0.1'],cwd=F,stdout=log,stderr=subprocess.STDOUT)
def witness():
 stat=Path(f'/proc/{proc.pid}/stat').read_text(); start=stat[stat.rfind(')')+2:].split()[19]; body=urllib.request.urlopen(f'http://127.0.0.1:{port}/en').read(); return {'pid':proc.pid,'starttime':start,'cwd':os.readlink(f'/proc/{proc.pid}/cwd'),'build_id':bid,'html_sha256':hashlib.sha256(body).hexdigest(),'html_contains_build_id':bid.encode() in body}
try:
 for _ in range(100):
  if proc.poll() is not None: raise RuntimeError('server exited')
  s=socket.socket(); ready=s.connect_ex(('127.0.0.1',port))==0; s.close()
  if ready: break
  time.sleep(.2)
 else: raise RuntimeError('not ready')
 pre=witness(); assert pre['cwd']==str(F) and pre['html_contains_build_id']
 with open(d/'e2e.log','wb') as out: result=subprocess.run(['node','/workspace/node_modules/@playwright/test/cli.js','test','--config',str(E/'playwright.config.mjs')],cwd=R,stdout=out,stderr=subprocess.STDOUT)
 post=witness(); assert pre==post
 (d/'suite-envelope.json').write_text(json.dumps({'before':pre,'after':post,'exit_code':result.returncode},indent=2)+'\n')
finally:
 if proc.poll() is None: proc.terminate(); proc.wait(timeout=20)
 log.close()
 s=socket.socket(); free=s.connect_ex(('127.0.0.1',port))!=0; s.close(); (d/'suite-cleanup.json').write_text(json.dumps({'pid':proc.pid,'returncode':proc.returncode,'port_free':free},indent=2)+'\n'); assert free
