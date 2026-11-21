// Luna only: one isolated fixed Studio build, no Next rebuild/tests/deploy/credentials.
import {mkdir,copyFile,symlink,readFile,writeFile} from 'node:fs/promises';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-click-null-001`,dir=`${root}/.local-tools/ola-qa/sanity-home-click-null-001/studio`;
const digest=b=>createHash('sha256').update(b).digest('hex');
const before=await readFile(`${qa}/sanity.config.before.js.txt`),baseline=await readFile(`${root}/.local-tools/ola-qa/sanity-home-online-001/studio/sanity.config.js`);if(digest(before)!==digest(baseline))throw Error('Old official Studio source does not match before snapshot');
await mkdir(dir,{recursive:true});
const names=['sanity.config.js','sanity.cli.js','package.json','package-lock.json','tsconfig.json'],sources=[];
for(const name of names){const bytes=await readFile(`${root}/studio/${name}`);await copyFile(`${root}/studio/${name}`,`${dir}/${name}`);sources.push({path:'studio/'+name,sha256:digest(bytes)});}
await symlink(`${root}/studio/node_modules`,`${dir}/node_modules`,'dir');
const node=`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node`,env={PATH:`${root}/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin:/usr/local/bin:/usr/bin:/bin`,HOME:`${root}/.local-tools/ola-qa/home`,XDG_CACHE_HOME:`${root}/.local-tools/ola-qa/cache`,XDG_CONFIG_HOME:`${root}/.local-tools/ola-qa/home/config`,npm_config_cache:`${root}/.local-tools/ola-qa/cache/npm`,SHELL:'/bin/bash',CI:'true',SANITY_STUDIO_PREVIEW_ORIGIN:'http://localhost:42242'};
const child=spawn(node,['node_modules/sanity/bin/sanity','build','--no-auto-updates','--yes'],{cwd:dir,env,stdio:['ignore','pipe','pipe']}),chunks=[];child.stdout.on('data',b=>chunks.push(b));child.stderr.on('data',b=>chunks.push(b));const code=await new Promise((resolve,reject)=>{child.once('error',reject);child.once('close',resolve);});await writeFile(`${qa}/studio-build.log`,Buffer.concat(chunks),{flag:'wx'});await writeFile(`${qa}/studio-build-binding.json`,JSON.stringify({code,dir,sources,origin:env.SANITY_STUDIO_PREVIEW_ORIGIN,localTestOnly:true},null,2),{flag:'wx'});if(code!==0)throw Error('Fixed isolated Studio build failed');console.log('Fixed test Studio built; no deployment.');
