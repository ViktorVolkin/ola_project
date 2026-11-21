import subprocess, time, socket
from pathlib import Path
root=Path('/workspace')
fixture=Path('/home/pn/.cache/ola-bd-next-fixture-20261115T012213Z')
s=socket.socket(); s.bind(('127.0.0.1',3310)); s.close()
with (root/'docs/qa/bouquet-detail/test-migration-001/font-debug-server.log').open('w') as log:
    p=subprocess.Popen(['/home/pn/.npm/_npx/78122db76a76712a/node_modules/node/bin/node','/workspace/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port','3310'],cwd=fixture,stdout=log,stderr=subprocess.STDOUT)
    try:
        time.sleep(2)
        subprocess.run(['node','tests/fixtures/bouquet-detail-next/font-diagnostic.cjs'],cwd=root,check=True)
    finally:
        p.terminate(); p.wait(timeout=10)
        s=socket.socket(); s.bind(('127.0.0.1',3310)); s.close(); print('port free, server exit',p.returncode)
