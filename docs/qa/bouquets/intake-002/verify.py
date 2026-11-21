import collections, datetime, hashlib, json
from pathlib import Path
from PIL import Image
root=Path.cwd(); out=root/'docs/qa/bouquets/intake-002'; old=root/'docs/design/bouquets-intake-completion/crop-map.json'
data=json.loads(old.read_text()); p=data['placements']; manifest=json.loads((root/'docs/design/bouquets-local-assets.json').read_text())['assets']
def digest(path,alg): return hashlib.new(alg,path.read_bytes()).hexdigest()
counts=collections.Counter((x['kind'],x['state']) for x in p)
expected={(k,s):n for k,n in [('card',8),('thumbnail',5),('seasonal',4),('editorial',2)] for s in 'DTM'}
assert counts==expected and len({x['leafId'] for x in p})==len(p)==57
assert all(len({x['label'] for x in p if x['kind']==k and x['state']==s})==n for (k,s),n in expected.items())
assets=[]; before={}
for a in manifest:
    path=root/'public'/a['path']; native=out/'native-fills'/f"{digest(path,'sha1')}.jpg"
    before[str(path)]=digest(path,'sha256')
    with Image.open(path) as im: size=list(im.size)
    with Image.open(native) as im: nsize=list(im.size)
    row={'public':str(path.relative_to(root)),'native':str(native.relative_to(root)),'sha1':digest(path,'sha1'),'sha256':before[str(path)],'bytes':path.stat().st_size,'size':size,'native_sha256':digest(native,'sha256'),'native_size':nsize,'historical_sha256':a['sha256']}
    assert row['sha1']==native.stem and row['sha256']==row['native_sha256']==a['sha256'] and size==nsize==[a['width'],a['height']] and row['bytes']==a['bytes']
    assets.append(row)
assert len(assets)==12 and len({x['sha256'] for x in assets})==12
for x in p:
    a=next(a for a in assets if a['public']==x['source']['path'])
    assert x['source']['sha1']==a['sha1'] and x['source']['natural']==a['size']
    assert all(k in x for k in ['leafId','viewport','imageRect','clipping','mask','paint'])
after={name:digest(Path(name),'sha256') for name in before}; assert before==after
result={'generated_at_utc':datetime.datetime.now(datetime.timezone.utc).isoformat(),'provenance':'New Figwright save_image_fills returned 57 named leaves with hashes agreeing with prior placement map; local native and production bytes compared. Geometry is prior captured evidence, with newly read D/T/M seasonal nodes and card grid contexts checked against it, not a new full transform read.','counts':{f'{k}/{s}':v for (k,s),v in sorted(counts.items())},'unique_leaf_ids':len({x['leafId'] for x in p}),'unique_sources':len(assets),'assets':assets,'placements':p,'production_before_after_unchanged':before==after,'limitations':['No imageTransform exposed; centered default remains conditional, not exact paint proof.','No browser visual acceptance or product/action approval.']}
(out/'verification.json').write_text(json.dumps(result,indent=2,ensure_ascii=False)+'\n')
print(json.dumps({'counts':result['counts'],'unique_leaves':result['unique_leaf_ids'],'unique_sources':len(assets),'native_public_sha256_dimensions_match':True,'production_before_after_unchanged':True},indent=2))
