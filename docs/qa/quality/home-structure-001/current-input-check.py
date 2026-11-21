import hashlib,json,pathlib,socket,datetime
R=pathlib.Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; F=pathlib.Path('/tmp/ola-home-quality-001-fixture')
paths=['src','public','next-env.d.ts','next.config.ts','package-lock.json','package.json','tsconfig.json','.prettierrc.json','.prettierignore','eslint.config.mjs']
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''): h.update(b)
 return h.hexdigest()
def manifest(root):
 out={}
 for name in paths:
  p=root/name
  if p.is_file(): out[str(p.relative_to(root))]=sha(p)
  elif p.is_dir():
   for x in sorted(p.rglob('*')):
    if x.is_file(): out[str(x.relative_to(root))]=sha(x)
 return out
expected=json.loads((E/'after-inputs.json').read_text()); s=socket.socket(); port_free=s.connect_ex(('127.0.0.1',31876))!=0; s.close()
result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':'python docs/qa/quality/home-structure-001/current-input-check.py','after_inputs_sha256':sha(E/'after-inputs.json'),'root_equal_after_inputs':manifest(R)==expected,'fixture_exists':F.is_dir(),'fixture_equal_after_inputs':F.is_dir() and manifest(F)==expected,'port_31876_loopback_connect_refused':port_free,'note':'Loopback connect result alone is not a full port ownership check.'}
(E/'current-input-check.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n'); print(json.dumps(result,indent=2,sort_keys=True))
