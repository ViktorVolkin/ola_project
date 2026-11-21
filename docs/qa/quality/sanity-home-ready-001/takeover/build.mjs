import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
import {readFile,writeFile,readdir,stat} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-ready-001/takeover';
const env={...process.env,PATH:`/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:${process.env.PATH}`,HOME:'/workspace/.local-tools/ola-qa/home',XDG_CACHE_HOME:'/workspace/.local-tools/ola-qa/cache',XDG_CONFIG_HOME:'/workspace/.local-tools/ola-qa/home/config',npm_config_cache:'/workspace/.local-tools/ola-qa/cache/npm',SHELL:'/bin/bash',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'};
const api=createServer(async(req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({result:JSON.parse(await readFile(`${qa}/synthetic-document.json`,'utf8'))}));});
await new Promise(r=>api.listen(42184,'127.0.0.1',r));
async function size(dir){let n=0;for(const e of await readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const p=`${dir}/${e.name}`;n+=e.isDirectory()?await size(p):(await stat(p)).size;}return n;}
const results=[];
try{for(const kind of ['release','synthetic']){
 const cwd=`/workspace/.local-tools/ola-qa/sanity-home-sol-${kind}`;
 const log=[];const p=spawn('/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node',['/workspace/node_modules/next/dist/bin/next','build','--webpack'],{cwd,env});p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));
 const exit=await new Promise(r=>p.once('exit',r));await writeFile(`${qa}/build-${kind}.log`,Buffer.concat(log));
 const bytes=await size(cwd);const buildId=exit===0?(await readFile(`${cwd}/.next/BUILD_ID`,'utf8')).trim():null;
 results.push({kind,exit,bytes,buildId});console.log(JSON.stringify(results.at(-1)));
 if(exit!==0||bytes>200*1024*1024)throw Error('build or fixture size failed');
}}finally{await new Promise(r=>api.close(r));await writeFile(`${qa}/build-results.json`,JSON.stringify(results,null,2));}
