import {readFile,writeFile,lstat,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawn} from 'node:child_process';
import net from 'node:net';
const qa='/workspace/docs/qa/quality/sanity-home-ready-001/takeover',root='/workspace';
const digest=b=>createHash('sha256').update(b).digest('hex');
const assert=(ok,msg)=>{if(!ok)throw Error(msg);};
const bindings=JSON.parse(await readFile(`${qa}/source-bindings.json`));
const source=[];
for(const item of bindings.files){const bytes=await readFile(`${root}/${item.path}`);assert(digest(bytes)===item.sha256,`source drift ${item.path}`);source.push(item);}
for(const item of bindings.deps)assert(digest(await readFile(`${root}/${item.path}`))===item.sha256,`dependency drift ${item.path}`);
const fixtures=[];
for(const variant of bindings.variants){const drift=[];for(const item of variant.bindings){const bytes=await readFile(`${variant.fixture}/${item.path}`);if(digest(bytes)!==item.fixtureSha256)drift.push(item.path);}assert(!drift.length,`fixture drift ${drift}`);assert((await lstat(`${variant.fixture}/node_modules`)).isSymbolicLink(),'expected same dependency symlink');fixtures.push({kind:variant.kind,sourceCount:variant.bindings.length,sourceVsReleaseDifferences:variant.bindings.filter(f=>!f.equal).map(f=>f.path),postBuildDrift:drift});}
const result=JSON.parse(await readFile(`${qa}/browser-results.json`));assert(!result.failure&&result.rows.length===36,'browser complete');
const synthetic=result.rows.filter(r=>r.kind==='synthetic'),release=result.rows.filter(r=>r.kind==='release');
const roleIds=new Set(synthetic.flatMap(r=>r.pixels.map(p=>p.id)));
const roiTests=synthetic.flatMap(r=>r.pixels);
for(const r of synthetic){const match=release.find(x=>x.locale===r.locale&&x.width===r.width);assert(JSON.stringify(r.links.map(x=>x.href))===JSON.stringify(match.links.map(x=>x.href)),'CMS changed action destination');assert(r.disabled.length===match.disabled.length,'CMS changed unavailable action state');assert(r.disabled.every(x=>x.startsWith(`SIM ${r.locale} labels.`)),'CMS disabled labels');assert(r.images.every(i=>i.alt.startsWith(`SIM ${r.locale} `)),'CMS alt labels');assert(r.sections===6,'six sections');}
const cache=JSON.parse(await readFile(`${qa}/cache-results.json`));assert(cache.refreshed&&!cache.beforeHadV2,'cache test');
const port=42186,fixture='/workspace/.local-tools/ola-qa/sanity-home-sol-release';
const bind=()=>new Promise((resolve,reject)=>{const s=net.createServer().once('error',reject);s.listen(port,'127.0.0.1',()=>s.close(resolve));});await bind();
const server=spawn('/workspace/.local-tools/ola-qa/node-v24.22.3-linux-arm64/bin/node',['/workspace/node_modules/next/dist/bin/next','start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env:{...process.env,HOME:'/workspace/.local-tools/ola-qa/home',XDG_CACHE_HOME:'/workspace/.local-tools/ola-qa/cache',XDG_CONFIG_HOME:'/workspace/.local-tools/ola-qa/home/config',SWC_NATIVE_BINDING_CACHE:'/ola-native-cache'},stdio:'pipe'});
const serverLog=[];server.stdout.on('data',b=>serverLog.push(b));server.stderr.on('data',b=>serverLog.push(b));
const assets=[];
try{
 let html;for(let i=0;i<100;i++){try{const r=await fetch(`http://127.0.0.1:${port}/en`);if(r.ok){html=await r.text();break;}}catch{}await new Promise(r=>setTimeout(r,100));}assert(html,'server ready');
 const paths=[...new Set([...html.matchAll(/(?:src|href)="(\/_next\/static\/[^" ]+)"/g)].map(m=>m[1]))];
 for(const path of paths){const response=await fetch(`http://127.0.0.1:${port}${path}`);assert(response.ok,`asset status ${path}`);const remote=Buffer.from(await response.arrayBuffer());const local=await readFile(`${fixture}/.next/${decodeURIComponent(path.replace('/_next/',''))}`);assert(local.equals(remote),`served bytes ${path}`);assets.push({path,bytes:remote.length,sha256:digest(remote)});}
 assert(assets.some(a=>a.path.endsWith('.css')),'served CSS binding');
}finally{if(server.exitCode===null){const exit=new Promise(r=>server.once('exit',r));server.kill('SIGTERM');await exit;}await writeFile(`${qa}/server-identity.log`,Buffer.concat(serverLog));await bind();}
async function sizes(dir){let bytes=0,files=0;for(const e of await readdir(dir,{withFileTypes:true})){if(e.isSymbolicLink())continue;const p=`${dir}/${e.name}`;if(e.isDirectory()){const x=await sizes(p);bytes+=x.bytes;files+=x.files;}else{bytes+=(await stat(p)).size;files++;}}return{bytes,files};}
const fixtureSizes=[];for(const v of bindings.variants){const size=await sizes(v.fixture);assert(size.bytes<=200*1024*1024,'size budget');fixtureSizes.push({kind:v.kind,...size});}
const count=JSON.parse(await readFile(`${qa}/public-count.json`));assert(count.result===0,'public homePage count changed');
const summary={sourceCount:source.length,sourceDigest:bindings.sourceDigest,fixtures,fixtureSizes,dependencyWitnesses:bindings.deps,sourceAndDependenciesUnchangedSinceBuildPreparation:true,builds:JSON.parse(await readFile(`${qa}/build-results.json`)),servedAssets:assets,servedPortRebound:port,browserCases:result.rows.length,releaseFallbackCases:release.length,baselinePixelExact:release.every(r=>r.baselinePixelExact),syntheticCases:synthetic.length,syntheticRoleCount:roleIds.size,syntheticRoiPixelChecks:roiTests.length,minFocalYellowPixels:Math.min(...roiTests.map(r=>r.yellow)),mobileMoodScrolledChecks:synthetic.filter(r=>r.width===360).flatMap(r=>r.pixels.filter(p=>p.path.startsWith('moods.'))).length,cache:{last:cache.observations.at(-1),states:[...new Set(cache.observations.map(o=>o.cache))],syntheticOnly:true},realPublishedHomePageCount:count.result,releasePrerender:JSON.parse(await readFile(`${fixture}/.next/prerender-manifest.json`)).routes['/en']};
await writeFile(`${qa}/verification-summary.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify({...summary,servedAssets:assets.map(a=>a.path),dependencyWitnesses:undefined,releasePrerender:undefined},null,2));
