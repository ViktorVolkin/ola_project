import {cp,mkdir,readFile,writeFile,symlink,readdir,stat,readlink,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import {createServer} from 'node:http';
const root='/workspace', qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`;
const node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache',NODE_DISABLE_COMPILE_CACHE:'1'};
const digest=b=>createHash('sha256').update(b).digest('hex');
const doc=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/takeover/synthetic-document.json`,'utf8'));
const api=createServer((req,res)=>{res.setHeader('Content-Type','application/json');res.end(JSON.stringify({result:doc}));});
await new Promise((resolve,reject)=>{api.once('error',reject);api.listen(42244,'127.0.0.1',resolve);});
async function size(dir){let sum=0;for(const e of await readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const path=`${dir}/${e.name}`;sum+=e.isDirectory()?await size(path):(await stat(path)).size;}return sum;}
async function run(name,args,cwd,extra={}){const p=spawn(node,args,{cwd,env:{...env,...extra}}),log=[];p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));const exit=await new Promise((resolve,reject)=>{p.once('error',reject);p.once('exit',resolve);});await writeFile(`${qa}/${name}.log`,Buffer.concat(log));console.log(name,exit);if(exit!==0)throw Error(`${name} failed`);}
const results=[];
try {
 for(const kind of ['release','synthetic']) {
  const fixture=`${root}/.local-tools/ola-qa/visual-editing-${kind}`;await mkdir(fixture,{recursive:true});
  for(const path of ['src','public','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts'])await cp(`${root}/${path}`,`${fixture}/${path}`,{recursive:true});
  try {await symlink(`${root}/node_modules`,`${fixture}/node_modules`);} catch(error) {if(error.code!=='EEXIST'||await readlink(`${fixture}/node_modules`)!==`${root}/node_modules`)throw error;}
  if(kind==='synthetic'){
   const path=`${fixture}/src/content/sanity/home.ts`;await writeFile(path,(await readFile(path,'utf8')).replace('https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production','http://127.0.0.1:42244/data/query/production'));
   const client=`${fixture}/src/content/sanity/preview-client.ts`;await writeFile(client,(await readFile(client,'utf8')).replace('useCdn: false, perspective:', 'apiHost: "http://127.0.0.1:42244", useProjectHostname: false, useCdn: false, perspective:').replace('process.env.NODE_ENV !== "production" && url.hostname', 'url.hostname'));
   const policy=`${fixture}/src/content/sanity/preview-policy.ts`;await writeFile(policy,(await readFile(policy,'utf8')).replace('process.env.NODE_ENV === "development" && origin', 'origin'));
   const config=`${fixture}/next.config.ts`;await writeFile(config,(await readFile(config,'utf8')).replace('process.env.NODE_ENV === "development" ? " http://localhost:3333" : ""','" http://localhost:3333"'));
  }
  await run(`build-${kind}`,['/workspace/node_modules/next/dist/bin/next','build','--webpack'],fixture);
  await run(`configured-types-${kind}`,['/usr/local/lib/node_modules/npm/bin/npm-cli.js','run','typecheck'],fixture);
  // Build-only webpack cache is not a serving dependency. Keep fetch/ISR caches.
  await rm(`${fixture}/.next/cache/webpack`,{recursive:true,force:true});
  const bytes=await size(fixture);if(bytes>200*1024*1024)throw Error('Fixture exceeds budget');
  const files=[];async function collect(dir){for(const e of await readdir(`${fixture}/${dir}`,{withFileTypes:true})){const path=`${dir}/${e.name}`;if(e.isDirectory())await collect(path);else files.push({path,sha256:digest(await readFile(`${fixture}/${path}`))});}}
  await collect('src');await collect('public');for(const path of ['package.json','package-lock.json','next.config.ts','tsconfig.json'])files.push({path,sha256:digest(await readFile(`${fixture}/${path}`))});
  results.push({kind,fixture,bytes,buildId:(await readFile(`${fixture}/.next/BUILD_ID`,'utf8')).trim(),files});
  await writeFile(`${qa}/build-results.json`,JSON.stringify(results,null,2));
 }
 await run('studio-types',['node_modules/typescript/bin/tsc','--noEmit'],`${root}/studio`);
 await run('studio-lint',['/workspace/node_modules/eslint/bin/eslint.js','--max-warnings=0','sanity.config.js','sanity.cli.js'],`${root}/studio`);
 await run('studio-build',['node_modules/sanity/bin/sanity','build'],`${root}/studio`,{SANITY_STUDIO_PREVIEW_ORIGIN:'http://localhost:42242'});
}finally{await new Promise(resolve=>api.close(resolve));}
