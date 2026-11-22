import next from '/workspace/.local-tools/ola-qa/unified-content-source-001/locked-install/node_modules/next/dist/server/next.js';
import {createServer} from 'node:http';
const app=next({dev:false,hostname:'localhost',port:Number(process.env.TEST_PUBLIC_PORT),dir:process.cwd()});
await app.prepare();
const server=createServer((req,res)=>app.getRequestHandler()(req,res));
server.listen(Number(process.env.TEST_LISTEN_PORT),'127.0.0.1',()=>console.log('About custom production fixture ready'));
process.on('SIGTERM',()=>{server.closeAllConnections();server.close(async()=>{await app.close();process.exit(0)});});
