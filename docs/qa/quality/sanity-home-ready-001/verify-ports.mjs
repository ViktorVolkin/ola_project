import net from 'node:net';
for (const port of [42179,42180]) await new Promise((resolve,reject)=>{const server=net.createServer();server.once('error',reject);server.listen(port,'127.0.0.1',()=>server.close(()=>{console.log(`${port}: rebind OK`);resolve();}));});
