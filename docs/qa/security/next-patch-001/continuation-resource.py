import os,json,pathlib,shutil,hashlib,datetime,subprocess
base=pathlib.Path('/workspace/docs/qa/security/next-patch-001')
ts=datetime.datetime.now(datetime.timezone.utc).strftime('%Y%m%dT%H%M%S%fZ')
e=base/('continuation-'+ts); e.mkdir()
old=pathlib.Path('/tmp/ola-next-patch-001-20261114T234548627385Z'); target=old/'node_modules'
def space(p):
 s=os.statvfs(p); return {'available_bytes':s.f_bavail*s.f_frsize,'free_inodes':s.f_favail}
def sha(p): return hashlib.sha256(p.read_bytes()).hexdigest()
r={'timestamp':ts,'evidence_dir':str(e),'removed_path':str(target),'before_tmp':space(old),'cache_before':space('/home/pn/.cache'),'root_before':{n:sha(pathlib.Path('/workspace')/n) for n in ['package.json','package-lock.json']}}
assert old.resolve()==old and not old.is_symlink() and old.stat().st_uid==os.getuid()
assert target.resolve()==target and not target.is_symlink() and target.lstat().st_uid==os.getuid() and shutil.rmtree.avoids_symlink_attacks
count=links=0
for d,ds,fs in os.walk(target,followlinks=False):
 for n in ds+fs:
  p=pathlib.Path(d)/n;count+=1;assert p.lstat().st_uid==os.getuid(),str(p)
  if p.is_symlink(): links+=1;assert p.resolve().is_relative_to(target),str(p)
r['cleanup_proof']={'uid':os.getuid(),'entries':count,'internal_symlinks':links,'exact_real_parent':str(old.resolve()),'no_external_links':True}
(e/'resource.json').write_text(json.dumps(r,indent=2))
shutil.rmtree(target)
r['after_tmp']=space(old);r['removed_verified']=not target.exists()
s=json.loads((base/'source-snapshot.json').read_text());assert s['consistent']
assert all(sha(old/n)==h for n,h in s['exported'].items())
cache=pathlib.Path('/home/pn/.cache');assert cache.resolve()==cache and os.access(cache,os.W_OK|os.X_OK)
assert space(cache)['available_bytes']>=2*1024**3 and space(cache)['free_inodes']>=150000
mount=subprocess.check_output(['findmnt','-T',str(cache),'-n','-o','OPTIONS'],text=True).strip();assert 'noexec' not in mount.split(',')
new=cache/('ola-next-patch-001-'+ts);new.mkdir()
for n,h in s['exported'].items():
 p=new/n;p.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(old/n,p);assert sha(p)==h
r.update(new_export=str(new),verified_source_files=len(s['exported']),tmp_mount=subprocess.check_output(['findmnt','-T','/tmp','-n','-o','OPTIONS'],text=True).strip(),cache_mount=mount,cache_after_copy=space(cache))
(e/'resource.json').write_text(json.dumps(r,indent=2));(e/'checkpoint.txt').write_text(str(new)+'\n');(base/'continuation-checkpoint.txt').write_text(str(e)+'\n')
print(json.dumps(r,indent=2))
