import fs from 'node:fs';
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {createRequire} from 'node:module';
import {gzipSync,gunzipSync} from 'node:zlib';
import {assertSeparateEvidence} from './reuse-guards.mjs';

export const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const tools = path.join(root, '.local-tools/ola-qa');
export const expectedPacket = path.join(root, 'docs/qa/quality/qa-environment-restore-001/current-production');
export let packet = process.env.OLA_QA_EVIDENCE_DIR || expectedPacket;
export const version = '24.22.3';
export const runtime = path.join(tools, `node-v${version}-linux-arm64`);
export const node = path.join(runtime, 'bin/node');
export const npmCli = '/usr/local/lib/node_modules/npm/bin/npm-cli.js';
export const nativeCache = process.env.SWC_NATIVE_BINDING_CACHE || '/ola-native-cache';
export function validateNativeCache() {
  if(!path.isAbsolute(nativeCache) || !fs.existsSync(nativeCache)) throw new Error('Prerequisite: engineer must provision approved executable SWC_NATIVE_BINDING_CACHE (default /ola-native-cache); no automatic root provisioning or temporary fallback');
  const stat=fs.lstatSync(nativeCache);
  if(!stat.isDirectory() || stat.isSymbolicLink() || stat.uid!==process.getuid() || (stat.mode&0o777)!==0o700) throw new Error('Approved SWC cache must be a real private directory, mode0700 owned by current UID');
  let ancestor=path.dirname(nativeCache);
  for(;;) {const s=fs.lstatSync(ancestor);if(s.isSymbolicLink() || ((s.mode&0o022)!==0 && (s.mode&0o1000)===0)) throw new Error(`Untrusted SWC cache ancestor: ${ancestor}`);if(ancestor==='/')break;ancestor=path.dirname(ancestor);}
  fs.mkdirSync(tools,{recursive:true});fs.writeFileSync(path.join(tools,'native-cache.json'),JSON.stringify({path:nativeCache,uid:stat.uid,mode:'0700',lifecycle:'container writable layer; engineer reprovision required after container replacement'}));
}
export const env = {...process.env, SWC_NATIVE_BINDING_CACHE:nativeCache, PATH: `${runtime}/bin:${process.env.PATH}`, HOME: `${tools}/home`, XDG_CACHE_HOME: `${tools}/cache`, XDG_CONFIG_HOME: `${tools}/home/config`, npm_config_cache: `${tools}/cache/npm`, PLAYWRIGHT_BROWSERS_PATH: `${tools}/browsers`, NEXT_TELEMETRY_DISABLED: '1'};
export const requireProject = createRequire(path.join(root, 'package.json'));
export function save(name, value) {fs.mkdirSync(packet, {recursive:true}); fs.writeFileSync(path.join(packet, name), JSON.stringify(value,null,2)+'\n');}
export function run(command, args, label, cwd=root, timeout=600000) {
  const result = spawnSync(command,args,{cwd,env,encoding:'utf8',timeout,maxBuffer:32*1024*1024});
  const text = `$ ${command} ${args.join(' ')}\n${result.stdout || ''}${result.stderr || ''}\nexit=${result.status} signal=${result.signal} error=${result.error || ''}\n`;
  fs.mkdirSync(packet,{recursive:true}); fs.writeFileSync(path.join(packet,`${label}.log`),text); console.log(text);
  if(result.status !== 0) throw new Error(`${label} failed; stop and inspect ${label}.log`);
}
function hash(file) {return createHash('sha256').update(fs.readFileSync(file)).digest('hex');}
export function manifest() {
  const output={};
  function walk(relative) {
    const absolute=path.join(root,relative); if(!fs.existsSync(absolute)) return;
    const stat=fs.lstatSync(absolute);
    if(stat.isSymbolicLink()) output[relative]={link:fs.readlinkSync(absolute)};
    else if(stat.isDirectory()) for(const entry of fs.readdirSync(absolute).sort()) walk(path.join(relative,entry));
    else if(stat.isFile()) output[relative]={size:stat.size,sha256:hash(absolute)};
  }
  for(const relative of ['scripts/model-quality-summary.mjs','src','public','tests','node_modules','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts','eslint.config.mjs','vitest.config.mts','playwright.config.ts','postcss.config.mjs']) walk(relative);
  return output;
}
export function snapshot(name,data=manifest()) { fs.mkdirSync(packet,{recursive:true}); fs.writeFileSync(path.join(packet,`${name}.json.gz.tmp`),gzipSync(JSON.stringify(data)));fs.renameSync(path.join(packet,`${name}.json.gz.tmp`),path.join(packet,`${name}.json.gz`)); return data;}
export function classify(change) {
  if(change.path.startsWith('node_modules/.vite/vitest/') || change.path.startsWith('node_modules/.vitest-cache/')) return 'Vitest run: exact generated result/transform cache path';
  return 'UNCLASSIFIED';
}
export function diff(before,after) {return [...new Set([...Object.keys(before),...Object.keys(after)])].sort().filter(p=>JSON.stringify(before[p])!==JSON.stringify(after[p])).map(p=>({path:p,before:before[p]??null,after:after[p]??null}));}
export async function native() {
  validateNativeCache();
  process.env.SWC_NATIVE_BINDING_CACHE=nativeCache;
  const results=[];
  for(const name of ['@swc/core','@next/swc-linux-arm64-gnu','@parcel/watcher','sharp']) {
    const location=requireProject.resolve(name); const mod=requireProject(name);
    if(name==='@swc/core') {const output=mod.transformSync('const answer: number = 42;', {jsc:{parser:{syntax:'typescript'}},module:{type:'commonjs'}});if(!output.code.includes('42')||output.code.includes(': number')) throw new Error('SWC TypeScript transform witness failed');save('swc-core-transform.json',{version:mod.version,nativeCache,input:'const answer: number = 42;',output:output.code});}
    if(name==='@next/swc-linux-arm64-gnu') mod.transformSync('const x = 1;',false,Buffer.from(JSON.stringify({jsc:{parser:{syntax:'ecmascript'}}})));
    if(name==='@parcel/watcher') await mod.getEventsSince(root,path.join(tools,'nonexistent-watcher-snapshot')).catch(error=>{if(String(error).includes('No prebuild')) throw error;});
    if(name==='sharp') await mod({create:{width:1,height:1,channels:3,background:'red'}}).png().toBuffer();
    results.push({name,location,versions:mod.versions??null});
  }
  save('native.json',{runtime:process.version,execPath:process.execPath,arch:process.arch,modules:results,loadedNativePaths:Object.keys(requireProject.cache).filter(file=>file.endsWith('.node'))}); console.log(results);
}
async function bootstrap() {
  if(process.platform!=='linux'||process.arch!=='arm64') throw new Error('Requires the authorised Linux ARM64 executor');
  for(const p of ['home','home/config','cache','browsers']) fs.mkdirSync(path.join(tools,p),{recursive:true});
  if(!fs.existsSync(node)) {
    const archive=path.join(tools,`node-v${version}-linux-arm64.tar.xz`);
    if(!fs.existsSync(archive)) run('curl',['--fail','--show-error','--location',`https://nodejs.org/dist/v${version}/node-v${version}-linux-arm64.tar.xz`,'--output',archive],'download-node');
    if(hash(archive)!=='6e51a2ada00f0011cc266f65d98922b403d7ad88f809ca2aa615a5fe1ce6e86c') throw new Error('Official Node archive checksum mismatch');
    run('tar',['-xJf',archive,'-C',tools],'extract-node');
  }
  run(node,['--version'],'node-version');
  run(node,[npmCli,'--version'],'npm-version');
  const installedMarker=path.join(tools,'installed-lock.sha256');
  const lockHash=hash(path.join(root,'package-lock.json'));
  const reuse=fs.existsSync(installedMarker)&&fs.readFileSync(installedMarker,'utf8')===lockHash;
  if(!reuse) {
    const initial=snapshot('before-install');
    // Red-capable native probe, intentionally before dependency regeneration.
    const probe=spawnSync(node,[fileURLToPath(import.meta.url),'native-worker'],{cwd:root,env,encoding:'utf8',timeout:30000});
    fs.writeFileSync(path.join(packet,'native-before.log'),`${probe.stdout}${probe.stderr}\nexit=${probe.status}\n`); console.log('Native before install:',probe.status);
    run(node,[npmCli,'ci','--include=optional','--no-audit','--no-fund'],'npm-ci');
    const installed=snapshot('after-install'); save('install-diff.json',diff(initial,installed));
    if(initial['package-lock.json'].sha256!==installed['package-lock.json'].sha256 || initial['package.json'].sha256!==installed['package.json'].sha256) throw new Error('npm ci changed package or lock');
    fs.writeFileSync(installedMarker,lockHash);
  } else console.log('Reusing this bootstrap installation for unchanged lock; validating native modules next.');
  run(node,[fileURLToPath(import.meta.url),'native-worker'],'native-after');
  run(node,[path.join(path.dirname(requireProject.resolve('playwright/package.json')),'cli.js'),'install','chromium'],'install-browser');
  run(node,[path.join(root,'scripts/qa/smoke.mjs'),'probe'],'browser-probe',root,60000);
}
function compact() {
  const base=path.dirname(packet);const seen=new Map();const mapping=fs.existsSync(path.join(packet,'snapshot-deduplication.json'))?JSON.parse(fs.readFileSync(path.join(packet,'snapshot-deduplication.json'),'utf8')):[];
  function walk(directory) {for(const entry of fs.readdirSync(directory,{withFileTypes:true})) {
    const file=path.join(directory,entry.name);if(entry.isDirectory())walk(file);
    else if(entry.isFile()&&entry.name.endsWith('.json.gz')) {
      const content=fs.readFileSync(file);const sha=createHash('sha256').update(content).digest('hex');
      const original=seen.get(sha);
      if(original&&content.equals(fs.readFileSync(original))) {const target=path.relative(path.dirname(file),original);fs.symlinkSync(target,`${file}.dedup`);fs.renameSync(`${file}.dedup`,file);mapping.push({path:path.relative(base,file),target,sha256:sha,bytesPreserved:content.length});}
      else seen.set(sha,file);
    }
  }}
  walk(base);save('snapshot-deduplication.json',mapping);console.log(mapping);
}
function record() {
  const readSnapshot=name=>JSON.parse(gunzipSync(fs.readFileSync(path.join(packet,`${name}.json.gz`))));
  const before=readSnapshot('before-verify'); const installed=before;
  const after=readSnapshot(fs.existsSync(path.join(packet,'after-reuse.json.gz'))?'after-reuse':'after-verify'); const current=snapshot('final-inputs');
  const installChanges=diff(before,installed); const verifyChanges=diff(installed,after);
  save('combined-raw-diff.json',verifyChanges);save('combined-diff-classification.json',verifyChanges.map(change=>({...change,producer:classify(change)})));
  const sourceChanges=diff(before,current).filter(change=>!change.path.startsWith('node_modules/'));
  const original=JSON.parse(gunzipSync(fs.readFileSync(path.join(path.dirname(packet),'before-install.json.gz'))));
  const newBaselineChanges=diff(original,before).filter(change=>change.path.startsWith('src/'));
  save('new-baseline-vs-original-source-diff.json',newBaselineChanges);console.log('Legitimate current source changes since original baseline:',newBaselineChanges.length,'CSS:',newBaselineChanges.filter(change=>change.path.endsWith('.css')).length);
  const unknown=verifyChanges.filter(change=>classify(change)==='UNCLASSIFIED');
  function bytes(directory) {return fs.readdirSync(directory,{withFileTypes:true}).reduce((total,entry)=>{const p=path.join(directory,entry.name);return total+(entry.isDirectory()?bytes(p):entry.isFile()?fs.statSync(p).size:0);},0);}
  const fixture=JSON.parse(fs.readFileSync(path.join(packet,'fixture-inputs.json'),'utf8'));
  const copiedGenerated=[...new Set(Object.keys(fixture.inputs).map(p=>p.match(/^(tests\/.*?\/(?:\.next|node_modules))(?:\/|$)/)?.[1]).filter(Boolean))];
  if(copiedGenerated.length) {
    if(path.dirname(fixture.fixture)!==tools) throw new Error('Unexpected private fixture cleanup target');
    save('copied-test-artifact-cleanup.json',{fixture:fixture.fixture,paths:copiedGenerated,reason:'Remove accidentally copied pre-existing test-fixture generated output, never root/live/old task fixtures',originalInputHashes:'build-artifacts.json sourceInputs; root before-verify manifest preserved',oldCopiedBytes:fixture.copiedBytes});
    for(const relative of copiedGenerated) fs.rmSync(path.join(fixture.fixture,relative),{recursive:true});
    fixture.inputs=Object.fromEntries(Object.entries(fixture.inputs).filter(([p])=>!copiedGenerated.some(parent=>p.startsWith(`${parent}/`))));
    fixture.copiedBytes=Object.values(fixture.inputs).reduce((sum,file)=>sum+file.size,0);save('fixture-inputs.json',fixture);
  }
  const handoffPath=path.join(packet,'reusable-build.json');
  if(fs.existsSync(handoffPath)) {
    const handoff=JSON.parse(fs.readFileSync(handoffPath,'utf8'));const retained={};
    function walkRetained(directory) {for(const entry of fs.readdirSync(directory,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))) {const file=path.join(directory,entry.name);if(entry.isDirectory())walkRetained(file);else if(entry.isFile())retained[path.relative(fixture.fixture,file)]={size:fs.statSync(file).size,sha256:hash(file)};}}
    walkRetained(fixture.fixture);
    handoff.copiedBytes=fixture.copiedBytes;handoff.retained=retained;handoff.fixtureBytes=Object.values(retained).reduce((sum,file)=>sum+file.size,0);handoff.sourcePhase=process.env.OLA_QA_SOURCE_PHASE||handoff.sourcePhase||'source-manifest-bound';handoff.bundler='webpack';save('reusable-build.json',handoff);
    save('retained-emitted-artifacts.json',Object.fromEntries(Object.entries(retained).filter(([p])=>p.startsWith('.next/'))));
  }
  save('restoration-summary.json',{status:fs.existsSync(path.join(packet,'verification.json'))?'technical_ready_awaiting_required_review':'blocked',reason:'See current-production verification.json and phase logs; previous cache failures retained outside this directory',sourceChanges,sourceUnchanged:sourceChanges.length===0,packageUnchanged:before['package.json'].sha256===current['package.json'].sha256,lockUnchanged:before['package-lock.json'].sha256===current['package-lock.json'].sha256,installChangedPaths:installChanges.length,verifyChangedPaths:verifyChanges.length,unclassifiedVerifyChanges:unknown,cachePathClassification:'Explicit .vite/vitest and .vitest-cache only; full raw diff retained',fallbackPathsRemovedByNpmCi:installChanges.filter(change=>change.path.startsWith('node_modules/next/next-swc-fallback/')).length,fixture:fixture.fixture,sourceCopyBytes:fixture.copiedBytes,fixtureBytes:bytes(fixture.fixture),toolsBytes:bytes(tools),packetBytesBeforeSummary:bytes(packet),arch:process.arch,systemNodeUntouched:true});
  if(installed['package-lock.json'].sha256===current['package-lock.json'].sha256) fs.writeFileSync(path.join(tools,'installed-lock.sha256'),current['package-lock.json'].sha256);
  console.log(fs.readFileSync(path.join(packet,'restoration-summary.json'),'utf8'));
}
const command=process.argv[2];
if(process.argv[1]===fileURLToPath(import.meta.url)) {
  try {
    if(['record','compact'].includes(command)&&fs.existsSync(path.join(expectedPacket,'reusable-build.json'))) throw new Error('Sealed verified packets are read-only; historical record/compact maintenance cannot rewrite their baseline');
    if(!['record','compact'].includes(command)&&!process.env.OLA_QA_EVIDENCE_DIR) {
      packet=fs.mkdtempSync(path.join(path.dirname(expectedPacket),'run-'));
      env.OLA_QA_EVIDENCE_DIR=packet;
    }
    assertSeparateEvidence(packet,path.dirname(process.env.OLA_QA_EXPECTED_HANDOFF||path.join(expectedPacket,'reusable-build.json')));
    if(command==='compact') compact();
    else if(command==='record') record();
    else if(command==='bootstrap') await bootstrap();
    else if(command==='probe') run(node,[path.join(root,'scripts/qa/smoke.mjs'),'probe'],'browser-probe',root,60000);
    else if(command==='native') run(node,[fileURLToPath(import.meta.url),'native-worker'],'native-after',root,30000);
    else if(command==='native-worker') await native();
    else if(command==='reuse') run(node,[path.join(root,'scripts/qa/verify.mjs'),'reuse'],'reuse',root,600000);
    else if(command==='verify') {
      if(!fs.existsSync(node)) throw new Error('Run node scripts/qa/local.mjs bootstrap first');
      run(node,[path.join(root,'scripts/qa/verify.mjs')],'verify',root,900000);
    } else throw new Error('Usage: node scripts/qa/local.mjs bootstrap|native|verify');
  } catch(error) {console.error(error); process.exitCode=1;}
}
