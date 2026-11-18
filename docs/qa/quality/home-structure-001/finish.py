import json, importlib.util, shutil, subprocess
from pathlib import Path
R=Path('/workspace'); E=R/'docs/qa/quality/home-structure-001'; F=Path('/tmp/ola-home-quality-001-fixture')
spec=importlib.util.spec_from_file_location('baseline',E/'before.py'); b=importlib.util.module_from_spec(spec); spec.loader.exec_module(b)
expected=json.loads((E/'after-inputs.json').read_text()); deps=json.loads((E/'dependencies.json').read_text());
identity={'root_unchanged':b.old.manifest(R,b.inputs)==expected,'fixture_inputs_unchanged':b.old.manifest(F,b.inputs)==expected,'dependencies_unchanged':b.old.manifest(R,['node_modules'])==deps,'port_free':b.free(),'fixture_size_bytes':sum(p.stat().st_size for p in F.rglob('*') if p.is_file() and not p.is_symlink())}
b.save('final-identity.json',identity); assert all(identity[k] for k in ['root_unchanged','fixture_inputs_unchanged','dependencies_unchanged','port_free']); assert identity['fixture_size_bytes']<=200*1024*1024
shutil.rmtree(F); b.save('final-cleanup.json',{'fixture_absent':not F.exists(),'port_free':b.free()}); assert not F.exists() and b.free()
