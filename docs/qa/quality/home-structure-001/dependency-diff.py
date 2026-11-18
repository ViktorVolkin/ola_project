import hashlib, json, pathlib, datetime
R=pathlib.Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'
def sha(p):
 h=hashlib.sha256()
 with p.open('rb') as f:
  for b in iter(lambda:f.read(1048576),b''): h.update(b)
 return h.hexdigest()
old=json.loads((E/'dependencies.json').read_text())
root=R/'node_modules'; current={str(p.relative_to(R)):sha(p) for p in sorted(root.rglob('*')) if p.is_file()}
added={k:current[k] for k in sorted(current.keys()-old.keys())}
removed={k:old[k] for k in sorted(old.keys()-current.keys())}
changed={k:{'before':old[k],'current':current[k]} for k in sorted(old.keys() & current.keys()) if old[k]!=current[k]}
result={'utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'command':'python docs/qa/quality/home-structure-001/dependency-diff.py','before_manifest_sha256':sha(E/'dependencies.json'),'before_count':len(old),'current_count':len(current),'added':added,'removed':removed,'changed':changed,'raw_equal':old==current,'note':'Current snapshot, not a retained full final snapshot; original final assertion remains separately recorded.'}
(E/'dependency-diff-current.json').write_text(json.dumps(result,indent=2,sort_keys=True)+'\n')
print(json.dumps(result,indent=2,sort_keys=True))
