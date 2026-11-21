"""Targeted mechanics for Luna: own ephemeral endpoints, no project/source guard."""
import errno
import json
import socket
from port_guard import check_port

results = []
for reuse in [False, True]:
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
        if reuse:
            server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        server.bind(('127.0.0.1', 0))
        server.listen(1)
        port = server.getsockname()[1]
        try:
            check_port(port)
        except OSError as error:
            assert error.errno == errno.EADDRINUSE, error
            results.append({'case': 'occupied-listener', 'listener_reuseaddr': reuse, 'rejected_errno': error.errno})
        else:
            raise AssertionError('Occupied listener accepted')
    check_port(port)
    results.append({'case': 'clean-handoff', 'listener_reuseaddr': reuse, 'accepted': True})

with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as server:
    server.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
    server.bind(('127.0.0.1', 0))
    server.listen(1)
    port = server.getsockname()[1]
    with socket.create_connection(('127.0.0.1', port)) as client:
        connection, _ = server.accept()
        connection.shutdown(socket.SHUT_WR)
        assert client.recv(1) == b''
        client.shutdown(socket.SHUT_WR)
        assert connection.recv(1) == b''
        connection.close()
# RED control: old guard fails for the exact same now-closed endpoint.
with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as old:
    try:
        old.bind(('127.0.0.1', port))
    except OSError as error:
        assert error.errno == errno.EADDRINUSE, error
        results.append({'case': 'old-guard-TIME_WAIT-RED', 'errno': error.errno})
    else:
        raise AssertionError('TIME_WAIT RED control did not reproduce')
check_port(port)
results.append({'case': 'corrected-TIME_WAIT-handoff', 'accepted': True})
print(json.dumps({'controlled_regression': 'PASS', 'checks': results}, indent=2))
