import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import net from 'node:net';
import {createHash} from 'node:crypto';
import {EventEmitter} from 'node:events';
import {validateExpectedFixture,assertServedHtml,publishAfterCleanup,portIsFree,shutdownOwned,assertSeparateEvidence} from './reuse-guards.mjs';

const digest=bytes=>({size:Buffer.byteLength(bytes),sha256:createHash('sha256').update(bytes).digest('hex')});
function scenario(t) {
  const temp=fs.mkdtempSync(path.join(os.tmpdir(),'ola-qa-guard-test-'));
  t.after(()=>fs.rmSync(temp,{recursive:true,force:true}));
  const fixture=path.join(temp,'fixture');const root=path.join(temp,'root');fs.mkdirSync(root);
  const bytes={'src/page.tsx':'export const page = "expected";','next.config.ts':'export default {};','.next/BUILD_ID':'EXPECTED_BUILD','.next/static/chunk.js':'window.expected = true;'};
  const retained={};
  for(const [p,value] of Object.entries(bytes)) {fs.mkdirSync(path.dirname(path.join(fixture,p)),{recursive:true});fs.writeFileSync(path.join(fixture,p),value);retained[p]=digest(value);}
  const inputs=Object.fromEntries(Object.entries(retained).filter(([p])=>!p.startsWith('.next/')));
  const currentRoot=structuredClone(inputs);const rootBaseline=structuredClone(inputs);
  const stat=fs.statSync(fixture);
  const expected={fixture,buildId:'EXPECTED_BUILD',ownerUid:process.getuid(),fixtureIdentity:{dev:stat.dev,ino:stat.ino},retained};
  const handoff=path.join(temp,'existing-handoff.json');const original=JSON.stringify(expected);fs.writeFileSync(handoff,original);
  return {fixture,root,inputs,currentRoot,rootBaseline,expected,handoff,original,publishCalls:0,failures:[]};
}
function transaction(s,{html='<script>{"b":"EXPECTED_BUILD"}</script>',cleanup={shutdownConfirmed:true,portReleased:true}}={}) {
  validateExpectedFixture(s);
  assertServedHtml(html,s.expected.buildId);
  return publishAfterCleanup({result:s.expected,cleanup,recordFailure:failure=>s.failures.push(failure),publish:()=>{s.publishCalls++;fs.writeFileSync(s.handoff,'NEW PUBLICATION');}});
}
function rejectsPreservingHandoff(s,options) {
  assert.throws(()=>transaction(s,options));
  assert.equal(s.publishCalls,0,'publication must not be called on rejection');
  assert.equal(fs.readFileSync(s.handoff,'utf8'),s.original,'existing handoff bytes must be preserved');
}

test('QAR-R1: unchanged ROOT cannot authorize mutated private source',t=>{
  const s=scenario(t);fs.writeFileSync(path.join(s.fixture,'src/page.tsx'),'MUTATED PRIVATE SOURCE');rejectsPreservingHandoff(s);
});
test('QAR-R1: private config mutation is rejected',t=>{
  const s=scenario(t);fs.writeFileSync(path.join(s.fixture,'next.config.ts'),'MUTATED CONFIG');rejectsPreservingHandoff(s);
});
test('QAR-R1: actual BUILD_ID must equal existing expected ID',t=>{
  const s=scenario(t);fs.writeFileSync(path.join(s.fixture,'.next/BUILD_ID'),'OTHER_BUILD');rejectsPreservingHandoff(s);
});
for(const mode of ['changed','missing','unexpected']) test(`QAR-R1: ${mode} immutable serving asset is rejected`,t=>{
  const s=scenario(t);const asset=path.join(s.fixture,'.next/static/chunk.js');
  if(mode==='changed')fs.writeFileSync(asset,'DIFFERENT ASSET');
  if(mode==='missing')fs.unlinkSync(asset);
  if(mode==='unexpected')fs.writeFileSync(path.join(s.fixture,'.next/static/extra.js'),'UNEXPECTED');
  rejectsPreservingHandoff(s);
});
test('QAR-R1: nonexistent fixture rejected before publication',t=>{
  const s=scenario(t);fs.rmSync(s.fixture,{recursive:true});rejectsPreservingHandoff(s);
});
test('QAR-R1: replaced fixture inode rejected even with identical file bytes',t=>{
  const s=scenario(t);fs.renameSync(s.fixture,`${s.fixture}-old`);fs.cpSync(`${s.fixture}-old`,s.fixture,{recursive:true});rejectsPreservingHandoff(s);
});
test('QAR-R1: symlink replacement fixture rejected',t=>{
  const s=scenario(t);fs.renameSync(s.fixture,`${s.fixture}-old`);fs.symlinkSync(`${s.fixture}-old`,s.fixture);rejectsPreservingHandoff(s);
});
test('QAR-R1: bad served HTML build identity is rejected',t=>{
  const s=scenario(t);rejectsPreservingHandoff(s,{html:'<script>{"b":"OTHER_BUILD"}</script>'});
});
test('QAR-R1: clean expected fixture and matching HTML permit publication',t=>{
  const s=scenario(t);transaction(s);assert.equal(s.publishCalls,1);
});
test('QAR-R1: expected ROOT mismatch also rejects without publication',t=>{
  const s=scenario(t);s.currentRoot['src/page.tsx']=digest('POST-HEADER ROOT');rejectsPreservingHandoff(s);
});
test('QAR-R1: exact image/runtime and Vitest cache exceptions retain full raw before/after records',t=>{
  const s=scenario(t);const relative='.next/cache/images/key/image.webp';s.expected.retained[relative]=digest('OLD IMAGE');
  fs.mkdirSync(path.dirname(path.join(s.fixture,relative)),{recursive:true});fs.writeFileSync(path.join(s.fixture,relative),'NEW IMAGE');
  s.currentRoot['node_modules/.vite/vitest/key/results.json']=digest('NEW RESULT');
  const result=validateExpectedFixture(s);assert.equal(result.cacheDiff.length,1);assert.deepEqual(result.cacheDiff[0].before,digest('OLD IMAGE'));assert.deepEqual(result.cacheDiff[0].after,digest('NEW IMAGE'));assert.equal(result.rootCacheDiff.length,1);assert.equal(result.rootCacheDiff[0].before,null);
});
test('QAR-R1: an arbitrary cache directory is NOT an exception',t=>{
  const s=scenario(t);fs.mkdirSync(path.join(s.fixture,'.next/cache/unknown'),{recursive:true});fs.writeFileSync(path.join(s.fixture,'.next/cache/unknown/file'),'UNKNOWN');rejectsPreservingHandoff(s);
});
test('QAR-R1: bare expected ID in text is not an HTML build marker',t=>{
  const s=scenario(t);rejectsPreservingHandoff(s,{html:'<p>EXPECTED_BUILD</p>'});
});
test('QAR-R1: actual saved pre-header HTML matches its expected ID, read-only',()=>{
  const packet=new URL('../../docs/qa/quality/qa-environment-restore-001/current-production/',import.meta.url);
  const expected=JSON.parse(fs.readFileSync(new URL('reusable-build.json',packet),'utf8'));
  assertServedHtml(fs.readFileSync(new URL('served-en.html.txt',packet),'utf8'),expected.buildId);
});
test('QAR-R1: protected output directory, child and symlink alias are all rejected',t=>{
  const s=scenario(t);const sealed=path.dirname(s.handoff);const alias=`${s.fixture}-alias`;fs.symlinkSync(sealed,alias);
  for(const output of [sealed,path.join(sealed,'child'),path.join(alias,'child')])assert.throws(()=>assertSeparateEvidence(output,sealed));
  assert.doesNotThrow(()=>assertSeparateEvidence(`${sealed}-new`,sealed));
});

test('QAR-R2: failed shutdown blocks success and preserves previous handoff',t=>{
  const s=scenario(t);rejectsPreservingHandoff(s,{cleanup:{shutdownConfirmed:false,portReleased:true}});
});
test('QAR-R2: missing shutdown confirmation blocks success',t=>{
  const s=scenario(t);rejectsPreservingHandoff(s,{cleanup:null});
});
test('QAR-R2: occupied port after shutdown rejects and does not signal replacement listener',async t=>{
  const s=scenario(t);const listener=net.createServer();
  await new Promise((resolve,reject)=>{listener.once('error',reject);listener.listen(0,'127.0.0.1',resolve);});
  try {const port=listener.address().port;const available=await portIsFree(port);assert.equal(available,false);rejectsPreservingHandoff(s,{cleanup:{shutdownConfirmed:true,portReleased:available}});assert.equal(listener.listening,true);} finally {await new Promise(resolve=>listener.close(resolve));}
});
function stubChild(mode='exit') {
  const child=Object.assign(new EventEmitter(),{pid:1234,exitCode:null,signalCode:null,signals:[]});
  child.kill=signal=>{child.signals.push(signal);if(mode==='deny')return false;if(mode==='exit')queueMicrotask(()=>{child.exitCode=143;child.emit('exit',143,null);});return true;};return child;
}
for(const mode of ['deny','timeout','replacement','occupied']) test(`QAR-R2 actual shutdown helper: ${mode} rejects, records failure, preserves handoff`,async t=>{
  const s=scenario(t);const child=stubChild(mode==='replacement'||mode==='occupied'?'exit':mode);const records=[];
  const execute=async()=>{
    const cleanup=await shutdownOwned({child,identity:{pid:1234,startTicks:'100',port:43210},fixture:s.fixture,readCwd:()=>s.fixture,readStart:()=>mode==='replacement'?'REPLACED':'100',probe:async()=>mode!=='occupied',timeoutMs:10,record:result=>records.push(result)});
    publishAfterCleanup({result:s.expected,cleanup,publish:()=>{s.publishCalls++;fs.writeFileSync(s.handoff,'NEW PUBLICATION');}});
  };
  await assert.rejects(execute);assert.equal(s.publishCalls,0);assert.equal(fs.readFileSync(s.handoff,'utf8'),s.original);
  assert.equal(records.length,1,'cleanup failure record must survive');assert.equal(records[0].status,'failed');
  if(mode==='replacement')assert.deepEqual(child.signals,[],'must not signal a replaced process');
});
test('QAR-R2 actual shutdown helper: confirmed exit/free port permits publication',async t=>{
  const s=scenario(t);const child=stubChild();const records=[];
  const cleanup=await shutdownOwned({child,identity:{pid:1234,startTicks:'100',port:43210},fixture:s.fixture,readCwd:()=>s.fixture,readStart:()=> '100',probe:async()=>true,timeoutMs:30,record:result=>records.push(result)});
  publishAfterCleanup({result:s.expected,cleanup,publish:()=>s.publishCalls++});assert.equal(s.publishCalls,1);assert.equal(records[0].status,'complete');assert.deepEqual(child.signals,['SIGTERM']);
});

test('QAR-R2: correctly free port and confirmed shutdown permit publication',async t=>{
  const s=scenario(t);const listener=net.createServer();await new Promise(resolve=>listener.listen(0,'127.0.0.1',resolve));const port=listener.address().port;await new Promise(resolve=>listener.close(resolve));
  const available=await portIsFree(port);assert.equal(available,true);transaction(s,{cleanup:{shutdownConfirmed:true,portReleased:available}});assert.equal(s.publishCalls,1);
});
