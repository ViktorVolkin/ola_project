import {cp,mkdir,readFile,writeFile,symlink,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/cms-r1-correction`,old=`${root}/docs/qa/quality/sanity-home-ready-001/takeover`;
const hash=b=>createHash('sha256').update(b).digest('hex'),assert=(ok,msg)=>{if(!ok)throw Error(msg);};
const env={...process.env,PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:${process.env.PATH}`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'};
const oldBindings=JSON.parse(await readFile(`${old}/source-bindings.json`)),files=[],differences=[];
for(const f of oldBindings.files){const b=await readFile(`${root}/${f.path}`);files.push({path:f.path,bytes:b.length,sha256:hash(b)});if(hash(b)!==f.sha256)differences.push(f.path);}
assert(JSON.stringify(differences)===JSON.stringify(['src/content/sanity/home.ts']),'unexpected production source drift');
for(const f of oldBindings.deps)assert(hash(await readFile(`${root}/${f.path}`))===f.sha256,`dependency drift ${f.path}`);
const studio=JSON.parse(await readFile(`${old}/studio-source-manifest.json`));for(const f of studio)assert(hash(await readFile(`${root}/${f.path}`))===f.sha256,`Studio drift ${f.path}`);
const doc=await readFile(`${old}/synthetic-document.json`,'utf8');const api=createServer((req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({result:JSON.parse(doc)}));});await new Promise(r=>api.listen(42194,'127.0.0.1',r));
async function size(dir){let bytes=0;for(const e of await readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const path=`${dir}/${e.name}`;bytes+=e.isDirectory()?await size(path):(await stat(path)).size;}return bytes;}
const variants=[],results=[];
try{for(const kind of ['release','synthetic']){
 const fixture=`${root}/.local-tools/ola-qa/sanity-home-cms-r1-${kind}`;await mkdir(fixture);
 for(const path of ['src','public','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts'])await cp(`${root}/${path}`,`${fixture}/${path}`,{recursive:true});await symlink(`${root}/node_modules`,`${fixture}/node_modules`);
 if(kind==='synthetic'){const path=`${fixture}/src/content/sanity/home.ts`,before=await readFile(path,'utf8'),after=before.replace('https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production','http://127.0.0.1:42194/data/query/production');assert(before!==after,'synthetic endpoint substitution');await writeFile(path,after);await writeFile(`${qa}/synthetic-adapter.ts.txt`,after);}
 const bindings=[];for(const f of files){const b=await readFile(`${fixture}/${f.path}`);bindings.push({...f,fixtureSha256:hash(b),equal:hash(b)===f.sha256});}variants.push({kind,fixture,bindings});
 const command=['/workspace/node_modules/next/dist/bin/next','build','--webpack'];const p=spawn(`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`,command,{cwd:fixture,env});const log=[];p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));const exit=await new Promise(r=>p.once('exit',r));await writeFile(`${qa}/build-${kind}.log`,Buffer.concat(log));const bytes=await size(fixture),buildId=exit===0?(await readFile(`${fixture}/.next/BUILD_ID`,'utf8')).trim():null;results.push({kind,fixture,command,exit,bytes,buildId});console.log(JSON.stringify(results.at(-1)));assert(exit===0&&bytes<=200*1024*1024,'build/size failed');
}}finally{await new Promise(r=>api.close(r));await writeFile(`${qa}/build-results.json`,JSON.stringify(results,null,2));await writeFile(`${qa}/source-bindings.json`,JSON.stringify({sourceCount:files.length,files,sourceDigest:hash(JSON.stringify(files)),priorProductionDifferences:differences,dependencies:oldBindings.deps,studioUnchanged:studio,variants},null,2));}
