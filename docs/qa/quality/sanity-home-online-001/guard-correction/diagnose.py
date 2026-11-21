"""Controlled cause investigation, own loopback ephemeral TCP only."""
import errno
import json
import socket
import subprocess


def states(port):
    rows = []
    with open('/proc/net/tcp', encoding='ascii') as file:
        for line in file.readlines()[1:]:
            cells = line.split()
            if int(cells[1].split(':')[1], 16) == port:
                rows.append({'local': cells[1], 'remote': cells[2], 'state_hex': cells[3]})
    return rows


def probe(port, reuse):
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        if reuse:
            sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        try:
            sock.bind(('127.0.0.1', port))
            sock.listen(1)
            return {'bind_listen': True, 'reuseaddr': sock.getsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR)}
        except OSError as error:
            if error.errno != errno.EADDRINUSE:
                raise
            return {'bind_listen': False, 'errno': error.errno}


with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', 0))
    port = server.getsockname()[1]
    server.listen(1)
    busy_raw, busy_reuse = probe(port, False), probe(port, True)
    with socket.create_connection(('127.0.0.1', port)) as client:
        connection, _ = server.accept()
        # Accepted server end initiates FIN; client observes EOF and then closes.
        connection.shutdown(socket.SHUT_WR)
        assert client.recv(1) == b''
        client.shutdown(socket.SHUT_WR)
        assert connection.recv(1) == b''
        connection.close()
    socket_rows = states(port)
post_close_rows = states(port)
raw, reuse = probe(port, False), probe(port, True)
node_code = "const net=require('node:net');const s=net.createServer();s.once('error',e=>{console.error(e.code);process.exitCode=1});s.listen(Number(process.argv[1]),'127.0.0.1',()=>{console.log('bind_listen');s.close()});"
node = subprocess.run(['/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node', '-e', node_code, str(port)], capture_output=True, text=True, check=False, timeout=10)
assert node.returncode == 0 and node.stdout.strip() == 'bind_listen', node.stderr
result = {'node_same_endpoint': {'exit': node.returncode, 'stdout': node.stdout.strip()}, 'port': port, 'busy_raw': busy_raw, 'busy_reuse': busy_reuse, 'before_listener_close': socket_rows, 'after_listener_close': post_close_rows, 'closed_raw': raw, 'closed_reuse': reuse}
print(json.dumps(result, indent=2))
assert not busy_raw['bind_listen'] and not busy_reuse['bind_listen']
assert any(row['state_hex'] == '06' for row in post_close_rows), 'Expected controlled TIME_WAIT'
assert not any(row['state_hex'] == '0A' for row in post_close_rows), 'Owned listener not closed'
assert not raw['bind_listen'] and reuse['bind_listen'], 'Hypothesis not reproduced'
