from pathlib import Path
import hashlib,json,shutil,datetime
root=Path('/workspace'); packet=root/'docs/qa/security/next-patch-001'
stamp=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
target=Path('/tmp')/('ola-next-patch-001-'+stamp)
if target.exists(): raise SystemExit('target exists')
files=[]
for name in ['src','public','tests']:
    files.extend(p for p in (root/name).rglob('*') if p.is_file())
for name in ['package.json','package-lock.json','tsconfig.json','next-env.d.ts','next.config.ts','eslint.config.mjs','playwright.config.ts','vitest.config.mts','.nvmrc','AGENTS.md','docs/assets-manifest.json','docs/design/balloons-intake.json']:
    p=root/name
    if p.is_file(): files.append(p)
if any(p.is_symlink() for p in files): raise SystemExit('symlink requires inspection')
def hashes(): return {str(p.relative_to(root)):hashlib.sha256(p.read_bytes()).hexdigest() for p in sorted(files)}
before=hashes(); target.mkdir()
for p in files:
    out=target/p.relative_to(root); out.parent.mkdir(parents=True,exist_ok=True); shutil.copyfile(p,out)
after=hashes(); changed=[s for s in before if before[s]!=after[s]]
for s in changed: shutil.copyfile(root/s,target/s)
final=hashes(); exported={s:hashlib.sha256((target/s).read_bytes()).hexdigest() for s in before}
consistent=exported==final
record={'timestamp':stamp,'root':'/workspace','requested_host_path':'/home/viktor/Projects/ola_project (not present in Docker)','export':str(target),'kind':'allowlisted working-tree snapshot, not Git release','before':before,'after_copy':after,'after_retry':final,'exported':exported,'changed_retry_once':changed,'consistent':consistent}
(packet/'source-snapshot.json').write_text(json.dumps(record,indent=2)+'\n')
(packet/'checkpoint.txt').write_text(str(target)+'\n')
for n in ['package.json','package-lock.json']: shutil.copyfile(target/n,packet/('baseline-'+n))
print(json.dumps({'export':str(target),'files':len(files),'changed':changed,'consistent':consistent}))
if not consistent: raise SystemExit(2)
