import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gunzipSync} from 'node:zlib';
import {validateExpectedFixture,assertServedHtml,publishAfterCleanup,shutdownOwned,fixtureIdentity,assertSeparateEvidence} from './reuse-guards.mjs';
import {root,tools,packet,expectedPacket,node,env,run,save,snapshot,manifest,diff,native,classify,nativeCache,npmCli} from './local.mjs';

assert.equal(process.versions.node.split('.')[0],'24','Invoke through node scripts/qa/local.mjs verify');
const reuse=process.argv[2]==='reuse';
const expectedPath=process.env.OLA_QA_EXPECTED_HANDOFF||path.join(expectedPacket,'reusable-build.json');
assert.ok(path.isAbsolute(expectedPath),'Expected handoff handle must be absolute');
assertSeparateEvidence(packet,path.dirname(expectedPath));
const expectedBytes=reuse?fs.readFileSync(expectedPath,'utf8'):null;
const expected=reuse?JSON.parse(expectedBytes):null;
const prior=reuse?JSON.parse(fs.readFileSync(path.join(path.dirname(expectedPath),expected.inputsManifest),'utf8')):null;
if(reuse)assert.equal(prior.fixture,expected.fixture,'Expected input and handoff fixture handles differ');
const fixture=expected?.fixture??fs.mkdtempSync(path.join(tools,'fixture-'));
assert.equal(path.dirname(fixture),tools);
const before=manifest();
let copiedBytes=0;
if(!reuse) for(const relative of ['scripts/model-quality-summary.mjs','src','public','tests','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts','eslint.config.mjs','vitest.config.mts','postcss.config.mjs']) {
  const source=path.join(root,relative); if(!fs.existsSync(source)) continue;
  fs.cpSync(source,path.join(fixture,relative),{recursive:true,filter:source=>!['.next','node_modules','.git'].includes(path.basename(source))&&!path.basename(source).startsWith('.env')});
}
function files(directory,base=directory) {
  const result={};
  for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {
    if(entry.name==='node_modules'&&directory===fixture) continue;
    const absolute=path.join(directory,entry.name);
    if(entry.isDirectory()) Object.assign(result,files(absolute,base));
    else if(entry.isFile()) {const bytes=fs.readFileSync(absolute); result[path.relative(base,absolute)]={size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};}
  }
  return result;
}
const inputs=prior?.inputs??files(fixture); copiedBytes=Object.values(inputs).reduce((sum,file)=>sum+file.size,0);
let buildBaseline;
if(reuse) {
  buildBaseline=JSON.parse(gunzipSync(fs.readFileSync(path.join(path.dirname(expectedPath),expected.sourceManifest))));
  save('reuse-guard-before.json',validateExpectedFixture({root,fixture,inputs,expected,rootBaseline:buildBaseline,currentRoot:before}));
}
snapshot(reuse?'before-reuse':'before-verify',before);
assert.ok(copiedBytes<200*1024*1024,'Source export exceeds ceiling');
if(!reuse) fs.symlinkSync(path.join(root,'node_modules'),path.join(fixture,'node_modules'));
save('fixture-inputs.json',{fixture,copiedBytes,inputs});
let server; let log; let verified;let cleanup;let ownedIdentity;
const startTicks=stat=>stat.slice(stat.lastIndexOf(')')+2).trim().split(/\s+/)[19];
try {
  await native();
  run(node,[npmCli,'--version'],'npm-version');
  // Tooling lives in an owner-approved Git-ignored directory, excluded explicitly from project lint only.
  run(node,[path.join(root,'node_modules/eslint/bin/eslint.js'),'--max-warnings=0','--ignore-pattern','.local-tools/**'],'lint');
  run(node,[path.join(root,'node_modules/vitest/vitest.mjs'),'run'],'unit');
  if(!reuse) run(node,[path.join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],'build',fixture,600000);
  run(node,[path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit','--incremental','false'],'typescript',fixture);
  const buildId=reuse?expected.buildId:fs.readFileSync(path.join(fixture,'.next/BUILD_ID'),'utf8').trim();
  save(reuse?'served-build-artifacts.json':'build-artifacts.json',{fixture,buildId,sourceInputs:inputs,artifacts:files(path.join(fixture,'.next'))});
  // Only this newly created, stopped fixture's disposable build cache; retain emitted serving artifacts.
  assert.equal(path.dirname(fixture),tools);
  const cache=path.join(fixture,'.next/cache');
  if(!reuse&&fs.existsSync(cache)) {save('private-cache-cleanup.json',{path:cache,producer:'owned Next production build',reason:'retain serving fixture below 200MiB; artifact hashes recorded first'});fs.rmSync(cache,{recursive:true});}
  const port=await new Promise((resolve,reject)=>{const socket=net.createServer();socket.on('error',reject);socket.listen(0,'127.0.0.1',()=>{const port=socket.address().port;socket.close(()=>resolve(port));});});
  log=fs.openSync(path.join(packet,'server.log'),'w');
  server=spawn(node,[path.join(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)],{cwd:fixture,env,stdio:['ignore',log,log]});
  const processStart=fs.readFileSync(`/proc/${server.pid}/stat`,'utf8');
  ownedIdentity={pid:server.pid,cwd:fs.readlinkSync(`/proc/${server.pid}/cwd`),processStart,startTicks:startTicks(processStart),port,buildId,node,startedAt:new Date().toISOString()};
  save('server-identity.json',ownedIdentity);
  const base=`http://127.0.0.1:${port}`;
  let response;
  for(let count=0;count<100;count++) {
    if(server.exitCode!==null) throw new Error('Owned server exited before readiness');
    try {response=await fetch(`${base}/en`);if(response.ok)break;} catch {}
    await new Promise(resolve=>setTimeout(resolve,200));
  }
  assert.ok(response?.ok,'Private server did not become ready');
  const html=await response.text();
  assertServedHtml(html,buildId);
  fs.writeFileSync(path.join(packet,'served-en.html.txt'),html);
  const staticUrls=[...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(match=>match[1].replaceAll('&amp;','&'));
  assert.ok(staticUrls.length>0);
  const staticIdentity=[];
  for(const url of [...new Set(staticUrls)]) {
    const result=await fetch(new URL(url,base)); assert.equal(result.status,200);
    const bytes=Buffer.from(await result.arrayBuffer());
    const local=path.join(fixture,'.next',decodeURIComponent(new URL(url,base).pathname).replace('/_next/',''));
    assert.ok(fs.existsSync(local)); assert.deepEqual(bytes,fs.readFileSync(local));
    if(reuse) {
      const recorded=expected.retained[path.relative(fixture,local)];
      assert.ok(recorded,'Served static asset is absent from existing expected handoff');
      assert.equal(bytes.length,recorded.size);assert.equal(createHash('sha256').update(bytes).digest('hex'),recorded.sha256,'Served static asset differs from expected verified bytes');
    }
    staticIdentity.push({url,size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});
  }
  save('served-identity.json',{base,buildId,htmlSha256:createHash('sha256').update(html).digest('hex'),staticIdentity});
  run(node,[path.join(root,'scripts/qa/smoke.mjs'),base],'site-smoke',root,300000);
  verified={status:'technical_gates_passed_awaiting_review',fixture,buildId,port,copiedBytes};
} finally {
  try {
    if(server) {
      if(!ownedIdentity) {
        cleanup={pid:server.pid,status:'failed',shutdownConfirmed:false,portReleased:false,error:'Owned child identity was not captured; refusing to signal an unverified process'};
        save('server-cleanup.json',cleanup);throw new Error(cleanup.error);
      }
      cleanup=await shutdownOwned({child:server,identity:ownedIdentity,fixture,record:result=>save('server-cleanup.json',{...result,fixtureRetained:fixture})});
    }
  } finally {if(log!==undefined)fs.closeSync(log);}
  const after=snapshot(reuse?'after-reuse':'after-verify'); const changes=diff(before,after);
  save(reuse?'reuse-raw-diff.json':'verify-raw-diff.json',changes);
  save(reuse?'reuse-diff-classification.json':'verify-diff-classification.json',changes.map(change=>({...change,producer:classify(change)})));
  const sourceChanges=changes.filter(change=>!change.path.startsWith('node_modules/'));
  assert.deepEqual(sourceChanges,[],'Frozen current source/config changed during verification');
  assert.deepEqual(changes.filter(change=>classify(change)==='UNCLASSIFIED'),[],'Unexpected dependency mutation');
  if(reuse&&verified) {
    assert.equal(fs.readFileSync(expectedPath,'utf8'),expectedBytes,'Existing expected handoff changed during verification');
    save('reuse-guard-after.json',validateExpectedFixture({root,fixture,inputs,expected,rootBaseline:buildBaseline,currentRoot:after}));
  }
  publishAfterCleanup({result:verified,cleanup,recordFailure:failure=>save('verification-failure.json',failure),publish:()=>{
    const retained=files(fixture);const fixtureBytes=Object.values(retained).reduce((sum,file)=>sum+file.size,0);
    assert.ok(fixtureBytes<200*1024*1024,'Retained fixture exceeds ceiling');
    const digest=entries=>createHash('sha256').update(JSON.stringify(entries)).digest('hex');
    const source=Object.fromEntries(Object.entries(after).filter(([p])=>!p.startsWith('node_modules/')));
    const dependencies=Object.fromEntries(Object.entries(after).filter(([p])=>p.startsWith('node_modules/')));
    if(reuse)save('reuse-receipt.json',{...verified,expectedHandoff:expectedPath,expectedHandoffSha256:createHash('sha256').update(expectedBytes).digest('hex'),expectedBuildId:expected.buildId});
    else save('reusable-build.json',{...verified,fixtureIdentity:fixtureIdentity(fixture),lifecycle:'retained verified private build; stopped; reuse without rebuild only while source/config/lock/library bytes match manifests; cache changes explicitly classified',fixtureBytes,ownerUid:fs.statSync(fixture).uid,sourceHash:digest(source),dependencyHash:digest(dependencies),sourceManifest:reuse?'after-reuse.json.gz':'after-verify.json.gz',inputsManifest:'fixture-inputs.json',runtime:{node,version:process.version,npmCli,npmVersion:'11.20.0',nativeCache},environment:{PATH:env.PATH,HOME:env.HOME,XDG_CONFIG_HOME:env.XDG_CONFIG_HOME,XDG_CACHE_HOME:env.XDG_CACHE_HOME,PLAYWRIGHT_BROWSERS_PATH:env.PLAYWRIGHT_BROWSERS_PATH,SWC_NATIVE_BINDING_CACHE:nativeCache,NEXT_TELEMETRY_DISABLED:'1'},portPolicy:'Choose a fresh unoccupied loopback port; never 3100; no rebuild while serving',startCommand:`cd ${fixture} && SWC_NATIVE_BINDING_CACHE=${nativeCache} HOME=${env.HOME} ${node} ${root}/node_modules/next/dist/bin/next start --hostname 127.0.0.1 --port <FREE_PORT>`,retained});
    save('verification.json',verified);
  }});
}
