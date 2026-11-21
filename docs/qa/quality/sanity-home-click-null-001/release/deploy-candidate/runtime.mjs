// CANDIDATE ONLY. Missing exact new Supervisor receipt stops BEFORE secret metadata/use.
import {open,readFile,writeFile,readdir,lstat,mkdir,copyFile,symlink} from 'node:fs/promises';
import {constants} from 'node:fs';
import {parseEnv} from 'node:util';
import {spawn} from 'node:child_process';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {TARGET,ORIGIN,WORK,CONFIG,hash,requireThat,safeSerialize,safeErrorMessage,run,verifyBytes} from './core.mjs';
const root='/workspace',qa=fileURLToPath(new URL('.',import.meta.url)).replace(/\/$/,''),hosting=`${root}/docs/qa/quality/sanity-home-click-null-001/release`;
const env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',CI:'true'};
const assert=requireThat;
async function metadata(){const s=await lstat(`${root}/.local-tools/secrets/sanity-deploy.env`);const safe=s.isFile()&&!s.isSymbolicLink()&&(s.mode&0o777)===0o600&&s.uid===1001&&s.gid===1001;assert(safe,'Credential file metadata rejected, no loading');return{regularFile:true,symlink:false,mode:'600',ownerMatchesApproved:true};}
async function loadCredential(){
 await metadata();const file=await open(`${root}/.local-tools/secrets/sanity-deploy.env`,constants.O_RDONLY|constants.O_NOFOLLOW);try{const s=await file.stat();assert(s.isFile()&&(s.mode&0o777)===0o600&&s.uid===1001&&s.gid===1001,'Metadata rejected');const parsed=parseEnv(await file.readFile('utf8'));assert(Object.keys(parsed).every(k=>k==='SANITY_AUTH_TOKEN')&&Object.hasOwn(parsed,'SANITY_AUTH_TOKEN'),'Unexpected credential variable names');assert(typeof parsed.SANITY_AUTH_TOKEN==='string'&&Boolean(parsed.SANITY_AUTH_TOKEN.trim()),'Credential absent');return parsed.SANITY_AUTH_TOKEN;}finally{await file.close();}}
async function regular(path){assert((await lstat(path)).isFile(),'Expected nonsymlink regular file');return readFile(path);}
async function files(dir,prefix=''){const rows=[];assert((await lstat(dir)).isDirectory(),'Output directory rejected');for(const e of await readdir(dir,{withFileTypes:true})){const p=prefix?`${prefix}/${e.name}`:e.name;assert(!e.isSymbolicLink(),'Symlink rejected');if(e.isDirectory())rows.push(...await files(`${dir}/${e.name}`,p));else{assert(e.isFile(),'Nonregular artifact rejected');rows.push({path:p,bytes:await regular(`${dir}/${e.name}`)});}}return rows;}
let token;let attempted=false;
try{
 const binding=JSON.parse(await regular(`${qa}/candidate-binding.json`));
 const approval=JSON.parse(await regular(`${qa}/supervisor-approved.json`));
 assert(approval.verdict==='PASS'&&approval.reviewer_profile==='supervisor'&&approval.reviewer_model==='gpt-6.1-sol'&&approval.provider==='openai-codex','Actual Supervisor approval required');
 assert(approval.candidateBindingSha256===hash(await regular(`${qa}/candidate-binding.json`)),'Approval does not bind this candidate');
 for(const f of binding.files)assert(hash(await regular(`${root}/${f.path}`))===f.sha256,'Reviewed candidate/dependency changed');
 const b=JSON.parse(await regular(`${hosting}/build-binding.json`));assert(b.files.length===356&&b.previewOrigin===ORIGIN&&b.projectId===TARGET.projectId&&b.dataset===TARGET.dataset&&b.expectedAppId===TARGET.id&&b.expectedAppHost===TARGET.appHost,'Build target rejected');
 const originalDist='/workspace/.local-tools/ola-qa/sanity-home-click-null-production/dist';assert(b.dist===originalDist,'Unapproved dist');
 async function validateOriginal(){for(const s of b.sourceFiles){assert(hash(await regular(`${root}/${s.path}`))===s.sha256,'Reviewed source changed');assert(hash(await regular(`/workspace/.local-tools/ola-qa/sanity-home-click-null-production/${s.path.slice(7)}`))===s.sha256,'Build source changed');}verifyBytes(b.files,await files(originalDist));}
 await validateOriginal();
 // A fresh source/asset allowlist workspace, not an upload of its enclosing directory.
 await mkdir(WORK,{mode:0o700});await mkdir(`${WORK}/dist`);
 for(const s of b.sourceFiles){if(s.path!=='studio/sanity.cli.js')await copyFile(`${root}/${s.path}`,`${WORK}/${s.path.slice(7)}`);}
 await writeFile(`${WORK}/sanity.cli.js`,CONFIG,{flag:'wx'});await symlink(`${root}/studio/node_modules`,`${WORK}/node_modules`,'dir');
 for(const f of b.files){const path=`${WORK}/dist/${f.path}`;await mkdir(path.slice(0,path.lastIndexOf('/')),{recursive:true});await copyFile(`${originalDist}/${f.path}`,path);}
 await mkdir(`${qa}/execution`,{recursive:false});
 const persist=async(name,text)=>writeFile(`${qa}/execution/${name}`,text,{flag:'wx'});
 const validate=async()=>{await validateOriginal();assert((await regular(`${WORK}/sanity.cli.js`)).toString()===CONFIG,'Pinned CLI config changed');for(const s of b.sourceFiles.filter(s=>s.path!=='studio/sanity.cli.js'))assert(hash(await regular(`${WORK}/${s.path.slice(7)}`))===s.sha256,'Deploy workspace source changed');verifyBytes(b.files,await files(`${WORK}/dist`));};
 await validate();token=await loadCredential();
 const require=createRequire(`${root}/studio/package.json`),{createClient}=require('@sanity/client');const client=createClient({projectId:'zhn2ddaj',dataset:'production',apiVersion:'2024-08-01',useCdn:false,useProjectHostname:false,token,maxRetries:0});
 const readApp=()=>client.request({method:'GET',url:`/projects/zhn2ddaj/user-applications/${TARGET.id}`});
 const writeOnce=async plan=>{attempted=true;const child=spawn(plan.node,plan.args,{cwd:plan.cwd,env:{...env,SANITY_STUDIO_PREVIEW_ORIGIN:ORIGIN,SANITY_AUTH_TOKEN:token},stdio:['ignore','pipe','pipe']}),chunks=[];child.stdout.on('data',b=>chunks.push(b));child.stderr.on('data',b=>chunks.push(b));const result=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',(code,signal)=>resolve({code,signal}));});return {...result,output:Buffer.concat(chunks).toString(),args:plan.args,credentialInArguments:false};};
 const result=await run({validate,readApp,writeOnce,persist,token});
 // Verify all post-CLI output bytes, permitting only observed generated manifest/schema/tools roles.
 const after=await files(`${WORK}/dist`),original=new Set(b.files.map(f=>f.path));for(const f of after){assert(!f.bytes.includes(Buffer.from(token)),'Credential in public output');if(!original.has(f.path))assert(/^static\/(create-manifest\.json|[a-zA-Z0-9_-]+\.create-(schema|tools)\.json)$/.test(f.path),'Unexpected CLI-generated output');}
 verifyBytes(b.files,after.filter(f=>original.has(f.path)));
 const publicRoot='https://ola-studio-zhn2ddaj.sanity.studio/',rootRes=await fetch(publicRoot,{redirect:'manual'});assert(rootRes.status===302&&rootRes.headers.get('location')===`https://www.sanity.io/@obdulf8du/studio/${TARGET.id}`,'Unexpected hosting redirect');
 const rows=[];for(const f of after){const res=await fetch(new URL(f.path,publicRoot),{redirect:'manual'});if(f.path==='index.html'){assert(res.status===301&&res.headers.get('location')==='/','Unexpected canonical index');rows.push({path:f.path,status:301,canonical:'/'});continue;}const bytes=Buffer.from(await res.arrayBuffer());assert(!bytes.includes(Buffer.from(token)),'Credential in remote output');assert(res.status===200&&hash(bytes)===hash(f.bytes),'Public asset readback failed');rows.push({path:f.path,status:200,sha256:hash(bytes),bytes:bytes.length});}
 const mf=JSON.parse((after.find(f=>f.path==='static/create-manifest.json')??{}).bytes?.toString()??'null');assert(mf&&mf.studioVersion==='6.24.0'&&mf.workspaces?.length===1&&mf.workspaces[0].projectId===TARGET.projectId&&mf.workspaces[0].dataset===TARGET.dataset&&mf.workspaces[0].name==='default','Public manifest identity rejected');for(const key of ['schema','tools'])assert(after.some(f=>f.path===`static/${mf.workspaces[0][key]}`),'Manifest reference absent');
 const originWitnesses=b.originPublicBundleWitnesses.map(f=>{assert(rows.some(r=>r.path===f.path&&r.sha256===f.sha256),'Origin witness not served');return f;});
 await persist('hosting-readback.json',safeSerialize({...result,status:'deployed_and_read_back_awaiting_review',target:TARGET,previewOrigin:ORIGIN,originWitnesses,publicRoot,files:rows,manifest:mf,uploadedOnlyDist:true,managerReady:false},token));
 console.log('Existing Studio update completed and read back; see sanitized own execution evidence.');
}catch(error){if(token){try{await writeFile(`${qa}/execution/final-error.json`,safeSerialize({blocked:true,writeAttempted:attempted,message:safeErrorMessage(error),noRetry:true},token),{flag:'wx'});}catch{}}console.error('Candidate blocked; no automatic retry. Before credential use: check exact new Supervisor receipt and immutable binding.');process.exitCode=1;}
