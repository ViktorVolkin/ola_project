import base64, hashlib, json, pathlib, tarfile
root = pathlib.Path('/workspace/docs/qa/quality/gallery-swiper-001')
archive = root / 'pack-stage/swiper-14.4.0.tgz'
data = archive.read_bytes()
integrity = 'sha512-' + base64.b64encode(hashlib.sha512(data).digest()).decode()
sha1 = hashlib.sha1(data).hexdigest()
assert integrity == 'sha512-6axnAuBsttFJe0gwsM5tT203/Bts0vcI+FwIX6dqFE4pUFVW6qrdRprNFQVxOYMW7V0S6A/KIqJ6JaPpNN2MCw=='
assert sha1 == '9c6a7f787e1afdb52862e3f2c7c0d16bc3652108'
stage = root / 'pack-stage/verified-package'
assert not stage.exists()
files = {}
with tarfile.open(archive, 'r:gz') as tar:
    members = tar.getmembers()
    seen = set()
    for member in members:
        path = pathlib.PurePosixPath(member.name)
        assert not path.is_absolute() and path.parts[0] == 'package' and all(x not in ('..', '.', '') for x in path.parts)
        assert member.isfile() and not member.issym() and not member.islnk()
        relative = pathlib.PurePosixPath(*path.parts[1:])
        assert str(relative) and str(relative) not in seen
        seen.add(str(relative))
    stage.mkdir()
    for member in members:
        relative = pathlib.PurePosixPath(*pathlib.PurePosixPath(member.name).parts[1:])
        target = stage.joinpath(*relative.parts)
        target.parent.mkdir(parents=True, exist_ok=True)
        content = tar.extractfile(member).read()
        assert len(content) == member.size
        target.write_bytes(content)
        files[str(relative)] = {'size': len(content), 'sha256': hashlib.sha256(content).hexdigest()}
manifest = json.loads((stage / 'package.json').read_text())
assert manifest['name'] == 'swiper' and manifest['version'] == '14.4.0'
assert not manifest.get('dependencies') and not manifest.get('optionalDependencies') and not manifest.get('peerDependencies')
assert not manifest.get('scripts', {}).get('install') and not manifest.get('scripts', {}).get('postinstall') and not manifest.get('scripts', {}).get('preinstall')
result = {'integrity': integrity, 'sha1': sha1, 'entries': len(files), 'bytes': sum(v['size'] for v in files.values()), 'archiveTypes': 'regular files only; no links or unsafe paths', 'files': files}
(root / 'archive-verification.json').write_text(json.dumps(result, indent=2) + '\n')
print(json.dumps({k: v for k, v in result.items() if k != 'files'}, indent=2))
