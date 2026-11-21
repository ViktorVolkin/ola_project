import hashlib, http.client, json, os, selectors, signal, socket, subprocess, time
from pathlib import Path

ROOT = Path('/workspace')
RUN = ROOT / '.local-tools/ola-qa/test-suite-runs/run-6kkimo'
APP = RUN / 'source/tests/fixtures/action-button'
BUILD = APP / '.next'
NODE = '/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node'
NEXT = str(RUN / 'source/node_modules/next/dist/bin/next')
PORT = 45190
BASE = ROOT / 'docs/qa/quality/test-suites-001/luna-verification/action-button-diagnostic/attempt-2'
BASE.mkdir(parents=True, exist_ok=True)
stdout_path, stderr_path = BASE / 'server.stdout.log', BASE / 'server.stderr.log'
result_path = BASE / 'diagnostic.json'
inputs = json.loads((RUN / 'inputs.json').read_text())
checks = ['tests/fixtures/action-button/next.config.ts','tests/fixtures/action-button/package.json','tests/fixtures/action-button/app/[locale]/page.tsx','tests/fixtures/action-button/browser-smoke.spec.ts','tests/suites.config.mjs']
source_checks = {}
for rel in checks:
    p = RUN / 'source' / rel
    digest = hashlib.sha256(p.read_bytes()).hexdigest()
    source_checks[rel] = {'actual_sha256': digest, 'input_sha256': inputs.get(rel), 'matches': digest == inputs.get(rel)}
if not all(v['matches'] for v in source_checks.values()):
    result_path.write_text(json.dumps({'status':'STOP_INPUT_IDENTITY_MISMATCH','source_checks':source_checks}, indent=2)+'\n')
    raise SystemExit('Stopped: source input identity mismatch')
build_id = (BUILD / 'BUILD_ID').read_text().strip()
if build_id != 'i7WAUMf_giUqKVKRUcvbQ':
    result_path.write_text(json.dumps({'status':'STOP_BUILD_ID_MISMATCH','build_id':build_id}, indent=2)+'\n')
    raise SystemExit('Stopped: old diagnostic BUILD_ID mismatch')
command = [NODE, NEXT, 'start', '--hostname', '127.0.0.1', '--port', str(PORT)]
env = {'PATH':'/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin','HOME':'/workspace/.local-tools/ola-qa/home','XDG_CONFIG_HOME':'/workspace/.local-tools/ola-qa/home/config','XDG_CACHE_HOME':'/workspace/.local-tools/ola-qa/cache','SHELL':'/bin/bash','SWC_NATIVE_BINDING_CACHE':'/ola-native-cache','NODE_DISABLE_COMPILE_CACHE':'1','PLAYWRIGHT_BROWSERS_PATH':'/workspace/.local-tools/ola-qa/browsers','OLA_SUITE_PORT':str(PORT),'OLA_SUITE_BASE_URL':f'http://127.0.0.1:{PORT}','BD_MIGRATION_EVIDENCE':str(RUN/'migration-evidence')}
result = {'status':'STARTING','run':str(RUN),'build_id':build_id,'app_cwd':str(APP),'command':command,'port':PORT,'readiness_path':'/en','actual_test_route':'/en','source_checks':source_checks,'env_keys':sorted(env),'start_monotonic':time.monotonic()}
probe = socket.socket()
try:
    probe.bind(('127.0.0.1', PORT))
except OSError as exc:
    result.update(status='STOP_PORT_OCCUPIED', port_guard_error=f'{type(exc).__name__}: {exc}')
    result_path.write_text(json.dumps(result, indent=2)+'\n')
    raise SystemExit('Port guard failed; no child started')
finally:
    probe.close()
with stdout_path.open('wb') as out, stderr_path.open('wb') as err:
    child = subprocess.Popen(command, cwd=str(APP), env=env, stdout=subprocess.PIPE, stderr=subprocess.PIPE, bufsize=0)
    result['pid'] = child.pid
    sel = selectors.DefaultSelector()
    sel.register(child.stdout, selectors.EVENT_READ, 'stdout')
    sel.register(child.stderr, selectors.EVENT_READ, 'stderr')
    buffers = {'stdout':bytearray(),'stderr':bytearray()}
    ready = False
    deadline = time.monotonic()+30
    while time.monotonic() < deadline and child.poll() is None and not ready:
        for key, _ in sel.select(timeout=min(0.25, max(0, deadline-time.monotonic()))):
            data = os.read(key.fileobj.fileno(), 4096)
            if not data:
                try: sel.unregister(key.fileobj)
                except Exception: pass
                continue
            target = out if key.data == 'stdout' else err
            target.write(data); target.flush()
            buffers[key.data].extend(data)
            if key.data == 'stdout' and b'Ready in ' in buffers['stdout']:
                ready = True
                result['ready_observed_monotonic'] = time.monotonic()
                break
    result['ready_observed'] = ready
    result['exit_before_probe'] = child.poll()
    result['startup_deadline_seconds'] = 30
    if ready and child.poll() is None:
        ready_at = result['ready_observed_monotonic']
        conn = http.client.HTTPConnection('127.0.0.1', PORT, timeout=5)
        observed = {'path':'/en','request_started_monotonic':time.monotonic()}
        try:
            conn.request('GET','/en',headers={'User-Agent':'owned-action-diagnostic'})
            response = conn.getresponse()
            body = response.read(4096)
            text = body.decode('utf-8','replace')
            import re
            title = re.search(r'<title[^>]*>(.*?)</title>', text, re.I|re.S)
            observed.update({'status':response.status,'reason':response.reason,'location':response.getheader('Location'),'content_type':response.getheader('Content-Type'),'body_bytes_captured':len(body),'body_limit_bytes':4096,'title':re.sub(r'\s+',' ',title.group(1)).strip() if title else None,'looks_like_next_html':'__next' in text,'has_fixture_marker':('Ask the studio' in text or 'WhatsApp enquiries are not available yet' in text),'has_not_found_marker':('404' in text or 'not found' in text.lower()),'http_error':None})
        except Exception as exc:
            observed.update({'http_error':f'{type(exc).__name__}: {exc}'})
        finally:
            observed['request_completed_monotonic'] = time.monotonic()
            observed['seconds_after_ready'] = observed['request_started_monotonic']-ready_at
            conn.close()
        result['http_observation'] = observed
    else:
        result['http_observation'] = None
    # Stop only the child spawned above, then drain its captured stdout/stderr.
    if child.poll() is None:
        child.terminate(); result['cleanup_signal'] = 'SIGTERM'
        try: result['child_exit_code'] = child.wait(timeout=10)
        except subprocess.TimeoutExpired:
            child.kill(); result['cleanup_signal'] = 'SIGKILL_OWN_CHILD_ONLY'; result['child_exit_code'] = child.wait(timeout=5)
    else:
        result['child_exit_code'] = child.returncode
    for stream, target, name in [(child.stdout,out,'stdout'),(child.stderr,err,'stderr')]:
        try:
            tail = stream.read()
            if tail: target.write(tail); buffers[name].extend(tail)
        except Exception: pass
    sel.close()
result['elapsed_seconds'] = time.monotonic()-result['start_monotonic']
check = socket.socket()
try:
    check.bind(('127.0.0.1',PORT)); result['port_released'] = True
except OSError as exc:
    result['port_released'] = False; result['port_release_error'] = f'{type(exc).__name__}: {exc}'
finally: check.close()
result['stdout_log'] = str(stdout_path); result['stderr_log'] = str(stderr_path)
if ready and result['http_observation'] and result['http_observation'].get('status'):
    result['status'] = 'READY_AND_HTTP_OBSERVED'
elif ready:
    result['status'] = 'READY_BUT_HTTP_FAILED'
else:
    result['status'] = 'EXITED_BEFORE_READY' if result['exit_before_probe'] is not None else 'STARTUP_DEADLINE_NO_READY'
result_path.write_text(json.dumps(result, indent=2)+'\n')
print(json.dumps(result, indent=2))
