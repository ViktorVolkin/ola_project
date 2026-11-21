import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import {createHash} from 'node:crypto';

const runtimeCache=p=>p.startsWith('.next/cache/images/');
const rootTestCache=p=>p.startsWith('node_modules/.vite/vitest/')||p.startsWith('node_modules/.vitest-cache/');
const identity=file=>{const bytes=fs.readFileSync(file);return {size:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')};};
const equal=(a,b)=>a?.size===b?.size&&a?.sha256===b?.sha256&&a?.link===b?.link;
const delta=(before,after,allowed,producer)=>[...new Set([...Object.keys(before),...Object.keys(after)])].sort().filter(p=>!equal(before[p],after[p])).map(p=>{assert.ok(allowed(p),`Unclassified immutable path change: ${p}`);return {path:p,before:before[p]??null,after:after[p]??null,producer};});

export function assertSeparateEvidence(output,expectedDirectory) {
  function canonical(file) {if(fs.existsSync(file))return fs.realpathSync(file);return path.join(canonical(path.dirname(file)),path.basename(file));}
  const actual=canonical(path.resolve(output));const expected=canonical(path.resolve(expectedDirectory));
  assert.ok(actual!==expected&&!actual.startsWith(`${expected}/`),'Verified expected packet is read-only; choose a separate new output directory');
}

export function fixtureIdentity(fixture) {
  const stat=fs.lstatSync(fixture);
  assert.ok(stat.isDirectory()&&!stat.isSymbolicLink(),'Fixture must be a real existing directory');
  assert.equal(fs.realpathSync(fixture),fixture,'Fixture path must not be replaced by a symlink');
  return {dev:stat.dev,ino:stat.ino};
}

/** Validate saved expectations, never adopt actual fixture hashes as a new baseline. */
export function validateExpectedFixture({root,fixture,inputs,expected,rootBaseline,currentRoot}) {
  assert.ok(expected&&expected.retained&&expected.buildId,'An existing verified handoff is required');
  assert.equal(fixture,expected.fixture,'Fixture handle differs from expected handoff');
  const actualIdentity=fixtureIdentity(fixture);
  assert.equal(fs.statSync(fixture).uid,expected.ownerUid,'Fixture owner mismatch');
  if(expected.fixtureIdentity)assert.deepEqual(actualIdentity,expected.fixtureIdentity,'Fixture directory was replaced');
  for(const [relative,input] of Object.entries(inputs)) {
    assert.deepEqual(currentRoot[relative],input,`Reusable ROOT input mismatch: ${relative}`);
    assert.deepEqual(expected.retained[relative],input,`Input metadata not bound to verified handoff: ${relative}`);
  }
  const rootCacheDiff=delta(rootBaseline,currentRoot,rootTestCache,'Vitest result/transform cache; exact root path exception');
  assert.equal(fs.readFileSync(path.join(fixture,'.next/BUILD_ID'),'utf8').trim(),expected.buildId,'Expected BUILD_ID mismatch');
  const paths=[];
  function walk(directory) {
    for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
      const file=path.join(directory,entry.name);const relative=path.relative(fixture,file);
      if(relative==='node_modules') {
        assert.ok(fs.lstatSync(file).isSymbolicLink(),'Shared dependencies must remain the expected symlink');
        assert.equal(fs.realpathSync(file),fs.realpathSync(path.join(root,'node_modules')),'Shared dependency target mismatch');continue;
      }
      assert.ok(!entry.isSymbolicLink(),`Unexpected fixture symlink: ${relative}`);
      if(entry.isDirectory())walk(file);
      else {assert.ok(entry.isFile(),`Unexpected fixture entry type: ${relative}`);paths.push(relative);}
    }
  }
  walk(fixture);
  const actualCache={};const expectedCache={};
  for(const [relative,recorded] of Object.entries(expected.retained)) {
    assert.ok(!path.isAbsolute(relative)&&!relative.split(/[\\/]/).includes('..'),'Unsafe retained path');
    if(runtimeCache(relative)) {expectedCache[relative]=recorded;continue;}
    assert.ok(paths.includes(relative),`Missing immutable fixture file: ${relative}`);
    assert.deepEqual(identity(path.join(fixture,relative)),recorded,`Immutable fixture bytes mismatch: ${relative}`);
  }
  for(const relative of paths) {
    if(runtimeCache(relative))actualCache[relative]=identity(path.join(fixture,relative));
    else assert.ok(Object.hasOwn(expected.retained,relative),`Unexpected immutable fixture file: ${relative}`);
  }
  const cacheDiff=delta(expectedCache,actualCache,runtimeCache,'Next production image optimizer runtime cache; exact private path exception');
  return {fixtureIdentity:actualIdentity,cacheDiff,rootCacheDiff};
}

export function assertServedHtml(html,buildId) {
  assert.match(buildId,/^[A-Za-z0-9_-]+$/,'Invalid expected build ID');
  const decodedQuotes=html.replaceAll('\\"','"');
  const marker=new RegExp(`"(?:b|buildId)"\\s*:\\s*"${buildId}"`);
  assert.match(decodedQuotes,marker,'Served HTML is not bound to the expected build ID');
}

export async function portIsFree(port) {
  return new Promise(resolve=>{const socket=net.createServer();socket.once('error',()=>resolve(false));socket.listen(port,'127.0.0.1',()=>socket.close(()=>resolve(true)));});
}

function readStartTicks(pid) {const stat=fs.readFileSync(`/proc/${pid}/stat`,'utf8');return stat.slice(stat.lastIndexOf(')')+2).trim().split(/\s+/)[19];}

/** @param {{child:any,identity:any,fixture:string,readCwd?:(pid:number)=>string,readStart?:(pid:number)=>string,probe?:(port:number)=>Promise<boolean>,timeoutMs?:number,record?:(result:any)=>void}} options */
export async function shutdownOwned({child,identity,fixture,readCwd=pid=>fs.readlinkSync(`/proc/${pid}/cwd`),readStart=readStartTicks,probe=portIsFree,timeoutMs=10000,record=()=>{}}) {
  const result={pid:child.pid,status:'failed',shutdownConfirmed:false,exitCode:child.exitCode,signal:child.signalCode,port:identity.port,portReleased:false,error:null};
  try {
    assert.equal(child.pid,identity.pid,'Owned child PID mismatch');
    if(child.exitCode===null&&child.signalCode===null) {
      assert.equal(readCwd(child.pid),fixture,'Owned child cwd mismatch; do not signal replacement');
      assert.equal(readStart(child.pid),identity.startTicks,'Owned child start-time mismatch; do not signal replacement');
      await new Promise((resolve,reject)=>{
        const finish=error=>{clearTimeout(timer);child.removeListener('exit',onExit);child.removeListener('error',onError);if(error)reject(error);else resolve(null);};
        const onExit=()=>finish(null);const onError=error=>finish(error);
        const timer=setTimeout(()=>finish(new Error('Owned child shutdown timeout')),timeoutMs);
        child.once('exit',onExit);child.once('error',onError);
        try {if(!child.kill('SIGTERM'))finish(new Error('Owned child SIGTERM was not delivered'));} catch(error) {finish(error);}
      });
    }
    assert.ok(child.exitCode===0||child.exitCode===143||child.signalCode==='SIGTERM','Owned child did not exit normally');
    result.shutdownConfirmed=true;result.exitCode=child.exitCode;result.signal=child.signalCode;
    result.portReleased=await probe(identity.port);
    assert.equal(result.portReleased,true,'Owned server port remains occupied; replacement listener is not signalled');
    result.status='complete';return result;
  } catch(error) {result.error=error.message;throw error;} finally {record(result);}
}

/**
 * Success publication is reachable only after confirmed owned shutdown AND port release.
 * @param {{result:any,cleanup:any,publish:(result:any)=>any,recordFailure?:(failure:any)=>void}} options
 */
export function publishAfterCleanup({result,cleanup,publish,recordFailure=()=>{}}) {
  try {
    if(result||cleanup) {
      assert.equal(cleanup?.shutdownConfirmed,true,'Owned child shutdown was not confirmed');
      assert.equal(cleanup?.portReleased,true,'Owned server port is not released');
    }
    if(result)return publish(result);
  } catch(error) {recordFailure({status:'failed',reason:error.message,cleanup:cleanup??null});throw error;}
}
