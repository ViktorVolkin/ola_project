import hashlib, json, pathlib, socket
root=pathlib.Path('/workspace')
old=root/'docs/qa/bouquet-detail/test-migration-001/resume-current/20261115T232303Z-869'
manifest=json.loads((old/'snapshot-0.json').read_text())
diff=[]
for name, expected in manifest.items():
 p=root/name
 actual=hashlib.sha256(p.read_bytes()).hexdigest() if p.is_file() else None
 if actual != expected: diff.append({'path':name,'old':expected,'current':actual})
current={}
for p in sorted((root/'src').rglob('*')):
 if p.is_file() and str(p.relative_to(root)) not in manifest: diff.append({'path':str(p.relative_to(root)),'old':None,'current':hashlib.sha256(p.read_bytes()).hexdigest()})
for name in ['tests/e2e/bouquet-detail-preferences.spec.ts','tests/e2e/bouquet-detail-supporting.spec.ts','tests/fixtures/bouquet-detail-next/migration-page.tsx.txt','tests/fixtures/bouquet-detail-next/migration-worker.ts','tests/fixtures/bouquet-detail-next/migration.config.ts','tests/fixtures/bouquet-detail-next/prepare.py','package-lock.json']:
 current[name]=hashlib.sha256((root/name).read_bytes()).hexdigest()
ports={}
for port in (3310,3311):
 s=socket.socket()
 try: s.bind(('127.0.0.1',port)); ports[port]='free'
 except OSError as e: ports[port]=str(e)
 finally: s.close()
run=pathlib.Path((old/'run-path.txt').read_text().strip())
result={'snapshot_files':len(manifest),'snapshot_differences':diff,'current_inputs':current,'run_path':str(run),'run_path_exists':run.exists(),'fixture_0_exists':(run/'fixture-0').exists(),'fixture_1_exists':(run/'fixture-1').exists(),'ports':ports}
print(json.dumps(result,indent=2))
