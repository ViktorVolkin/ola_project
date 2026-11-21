// Token-free isolated production Studio build. No deployment/credential imports.
import {readFile,writeFile,mkdir,copyFile,symlink,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-click-null-001/release`,fixture=`${root}/.local-tools/ola-qa/sanity-home-click-null-production`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const assert=(v,m)=>{if(!v)throw Error(m);};
// Token-free release preparation only; actual click-fix Supervisor acceptance still pending.
const packet=JSON.parse(await readFile(`${qa}/release-inputs.json`));
const sources=packet.source_files.filter(f=>f.path.startsWith('studio/'));assert(sources.length===5,'Unexpected reviewed Studio source set');
await mkdir(fixture,{mode:0o700});
for(const f of sources){assert(/^studio\/(sanity\.config\.js|sanity\.cli\.js|package(?:-lock)?\.json|tsconfig\.json)$/.test(f.path),'Source allowlist failure');const bytes=await readFile(`${root}/${f.path}`);assert(hash(bytes)===f.sha256,`Reviewed Studio drift: ${f.path}`);await copyFile(`${root}/${f.path}`,`${fixture}/${f.path.slice(7)}`);}
await symlink(`${root}/studio/node_modules`,`${fixture}/node_modules`,'dir');
const node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',CI:'true',SANITY_STUDIO_PREVIEW_ORIGIN:'https://olaproject-chi.vercel.app'};
const args=['node_modules/sanity/bin/sanity','build','--no-auto-updates','--yes'];
const child=spawn(node,args,{cwd:fixture,env,stdio:['ignore','pipe','pipe']}),chunks=[];
child.stdout.on('data',b=>chunks.push(b));child.stderr.on('data',b=>chunks.push(b));
const exit=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',(code,signal)=>resolve({code,signal}));});
await writeFile(`${qa}/build.log`,Buffer.concat(chunks));assert(exit.code===0,'Studio build failed; no deployment attempted');
const files=[];async function walk(dir=''){for(const e of await readdir(`${fixture}/dist/${dir}`,{withFileTypes:true})){const p=dir?`${dir}/${e.name}`:e.name;assert(!e.isSymbolicLink(),'Symlink in public output');assert(!/(^|\/)(?:\.env(?:\.|$)|node_modules|\.local-tools|docs|secrets)(?:\/|$)/.test(p),'Forbidden public output');if(e.isDirectory())await walk(p);else{assert(e.isFile(),'Nonregular output');const b=await readFile(`${fixture}/dist/${p}`);files.push({path:p,bytes:b.length,sha256:hash(b)});}}}await walk();
const witnesses=[];for(const f of files.filter(f=>f.path.endsWith('.js'))){const text=await readFile(`${fixture}/dist/${f.path}`,'utf8');if(text.includes(env.SANITY_STUDIO_PREVIEW_ORIGIN))witnesses.push(f);}
assert(witnesses.length>0,'Production origin missing from public bundle');
for(const f of sources)assert(hash(await readFile(`${root}/${f.path}`))===f.sha256,'Studio changed during build');
const result={status:'built_not_deployed',fixture,dist:`${fixture}/dist`,review:'PENDING_current_click_fix_Supervisor',projectId:'zhn2ddaj',dataset:'production',expectedAppId:'xxpedejjvg9va6r4u8t4llzw',expectedAppHost:'ola-studio-zhn2ddaj',previewOrigin:env.SANITY_STUDIO_PREVIEW_ORIGIN,originPublicBundleWitnesses:witnesses,sourceFiles:sources,files:files.sort((a,b)=>a.path.localeCompare(b.path)),command:{node,args,cwd:fixture,...exit},credentialLoaded:false,credentialInBuildEnvironment:false,deploymentExecuted:false};
await writeFile(`${qa}/build-binding.json`,JSON.stringify(result,null,2));console.log(JSON.stringify({status:result.status,sourceFiles:sources.length,files:files.length,originPublicBundleWitnesses:witnesses,code:exit.code}));
