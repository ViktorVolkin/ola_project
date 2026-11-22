import {cp,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
const root='/workspace',qa=`${root}/docs/qa/quality/cms-about-001`,base=`${root}/.local-tools/ola-qa/cms-about-001`,dep=`${root}/.local-tools/ola-qa/unified-content-source-001/locked-install`,node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,SWC_NATIVE_BINDING_CACHE:'/ola-native-cache',NODE_DISABLE_COMPILE_CACHE:'1',NEXT_TELEMETRY_DISABLED:'1',CONTENT_SOURCE:'default'};
const commands=[];
async function run(name,args,cwd){const started=new Date().toISOString(),child=spawn(node,args,{cwd,env}),chunks=[];child.stdout.on('data',b=>chunks.push(b));child.stderr.on('data',b=>chunks.push(b));const exit=await new Promise(r=>child.once('exit',r));await writeFile(`${qa}/${name}.log`,Buffer.concat(chunks));commands.push({name,command:[node,...args],cwd,started,finished:new Date().toISOString(),exit});return exit;}
const checks=`${base}/checks`;for(const name of ['src','tests/unit','scripts','public','docs/assets-manifest.json','docs/design/balloons-intake.json'])await cp(`${root}/${name}`,`${checks}/${name}`,{recursive:true});
await run('unit', [`${dep}/node_modules/vitest/vitest.mjs`,'run'],checks);
await run('lint',[`${root}/node_modules/eslint/bin/eslint.js`,'--max-warnings=0'],root);
await run('typecheck',[`${dep}/node_modules/next/dist/bin/next`,'typegen'],checks);
await run('tsc',[`${dep}/node_modules/typescript/bin/tsc`,'--noEmit','--incremental','false'],checks);
await writeFile(`${qa}/commands.json`,JSON.stringify(commands,null,2));console.log(commands);
if(commands.some(c=>c.exit!==0))process.exitCode=1;
