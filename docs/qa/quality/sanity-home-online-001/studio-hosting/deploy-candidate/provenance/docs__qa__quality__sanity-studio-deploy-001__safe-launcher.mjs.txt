import {spawn} from 'node:child_process';
import {lstat,readFile,writeFile,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
export const root='/workspace',qa=`${root}/docs/qa/quality/sanity-studio-deploy-001`,node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`;
export const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',CI:'true'};
export const hash=b=>createHash('sha256').update(b).digest('hex');
export const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
export async function metadata(){const s=await lstat(`${root}/.local-tools/secrets/sanity-deploy.env`);const safe=s.isFile()&&!s.isSymbolicLink()&&(s.mode&0o777)===0o600&&s.uid===1001&&s.gid===1001;assert(safe,'Credential file metadata rejected, no loading');return{regularFile:true,symlink:false,mode:'600',ownerMatchesApproved:true};}
export async function execute(name,args,{token,childEnv=env,cwd=`${root}/studio`}={}){
 const redact=text=>{if(!token)return text;for(const secret of [token,encodeURIComponent(token),Buffer.from(token).toString('base64')])text=text.split(secret).join('[REDACTED]');return text;};
 const p=spawn(node,args,{cwd,env:childEnv,stdio:['ignore','pipe','pipe']}),chunks=[];p.stdout.on('data',b=>chunks.push(b));p.stderr.on('data',b=>chunks.push(b));
 const exit=await new Promise((resolve,reject)=>{p.once('error',reject);p.once('exit',(code,signal)=>resolve({code,signal}));});const output=redact(Buffer.concat(chunks).toString());await writeFile(`${qa}/${name}.log`,output);const result={name,executable:node,args,cwd,...exit,credentialInArgs:false,outputRedactedBeforePersistence:true};await writeFile(`${qa}/${name}-result.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result));return{...result,output};
}
export async function identity(){
 const packet=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/cms-r1-correction/source-bindings.json`));const rows=[];
 for(const f of [...packet.files,...packet.dependencies,...packet.studioUnchanged]){const b=await readFile(`${root}/${f.path}`);assert(hash(b)===f.sha256,`Reviewed identity mismatch: ${f.path}`);rows.push({path:f.path,sha256:hash(b)});}
 const review=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/supervisor-review-2.json`));assert(review.verdict==='PASS'&&review.source_identity.after_adapter_sha256===hash(await readFile(`${root}/src/content/sanity/home.ts`)),'Local technical PASS source mismatch');
 const files=[];async function walk(dir){for(const e of await readdir(`${root}/studio/dist/${dir}`,{withFileTypes:true})){const path=dir?`${dir}/${e.name}`:e.name;if(e.isDirectory())await walk(path);else if(e.isFile()){const b=await readFile(`${root}/studio/dist/${path}`);files.push({path,bytes:b.length,sha256:hash(b)});}else throw Error('Unexpected symlink in deploy output');}}await walk('');
 const result={review2:'PASS',projectId:'zhn2ddaj',dataset:'production',reviewedWitnesses:rows,distFiles:files};await writeFile(`${qa}/identity-before.json`,JSON.stringify(result,null,2));return result;
}
if(process.argv[1]?.endsWith('/safe-launcher.mjs')){try{await metadata();await identity();const args=process.argv.slice(2);assert(args.length===1&&['deploy','build'].includes(args[0]),'Only installed command help allowed in public launcher');await execute(`help-${args[0]}`,['node_modules/sanity/bin/sanity',args[0],'--help']);}catch{console.error('Prerequisite/helper failed; no credential loaded and no deployment attempted');process.exitCode=1;}}
