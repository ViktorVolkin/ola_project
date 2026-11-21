"""Exact IPv4 loopback bind+listen reuse check, matching Node listener semantics.
No retries, SO_REUSEPORT, wildcard addresses, connect probes or process signals.
"""
import argparse
import json
import socket


def check_port(port):
    """Raise the actual bind/listen error; TIME_WAIT alone is not a listener."""
    with socket.socket(socket.AF_INET, socket.SOCK_STREAM) as sock:
        sock.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)
        sock.bind(('127.0.0.1', port))
        sock.listen(1)
    return {'port': port, 'host': '127.0.0.1', 'bind_listen': True, 'reuseaddr': True}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--ports', nargs='+', type=int, required=True)
    args = parser.parse_args()
    if any(not 1 <= port <= 65535 for port in args.ports):
        parser.error('ports must be explicit 1..65535')
    print(json.dumps({'port_guard': 'PASS', 'checks': [check_port(port) for port in args.ports]}))
