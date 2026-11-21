import socket
s = socket.socket()
s.bind(('127.0.0.1', 3219))
print('3219 bind available')
s.close()
