import {spawn} from 'node:child_process';
import {writeFile} from 'node:fs/promises';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/cms-r1-correction`,node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
const env={...process.env,PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:${process.env.PATH}`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash'};
const commands=[['cms-final',['node_modules/vitest/vitest.mjs','run','tests/unit/sanity-home.test.ts','--no-cache','--no-fsModuleCache','--configLoader','runner','--reporter=verbose']],['unit-final',['node_modules/vitest/vitest.mjs','run','--no-cache','--no-fsModuleCache','--configLoader','runner']],['types-final',['node_modules/typescript/bin/tsc','--noEmit','--incremental','false']],['lint-final',['/usr/local/lib/node_modules/npm/bin/npm-cli.js','run','lint']]];
const results=[];
for(const [name,args] of commands){const p=spawn(node,args,{cwd:root,env}),log=[];p.stdout.on('data',b=>log.push(b));p.stderr.on('data',b=>log.push(b));const exit=await new Promise(r=>p.once('exit',r));await writeFile(`${qa}/${name}.log`,Buffer.concat(log));results.push({name,cwd:root,executable:node,args,exit});console.log(`${name}: ${exit}`);}
await writeFile(`${qa}/check-results.json`,JSON.stringify(results,null,2));if(results.some(r=>r.exit!==0))process.exitCode=1;
