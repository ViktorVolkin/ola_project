import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {gzipSync,gunzipSync} from 'node:zlib';
import {manifest,diff} from './local.mjs';
const root=path.resolve(path.dirname(fileURLToPath(import.meta.url)),'../..');
const dir=path.join(root,'docs/qa/quality/qa-environment-restore-001/guard-correction-001');
const sha=file=>createHash('sha256').update(fs.readFileSync(file)).digest('hex');
const data={source:{},protected:{},dependencyMetadata:{}};
function walk(relative) {
  const file=path.join(root,relative);if(!fs.existsSync(file))return;
  const s=fs.lstatSync(file);if(s.isSymbolicLink())return;
  if(s.isDirectory()) {for(const name of fs.readdirSync(file).sort()) if(!['.next','node_modules','.git'].includes(name)&&!name.startsWith('.env'))walk(path.join(relative,name));}
  else data.source[relative]={size:s.size,sha256:sha(file)};
}
for(const p of ['src','public','package.json','package-lock.json','next.config.ts','tsconfig.json','playwright.config.ts','eslint.config.mjs','vitest.config.mts'])walk(p);
for(const p of ['node_modules/.package-lock.json','node_modules/next/package.json','node_modules/typescript/package.json','node_modules/vitest/package.json'])data.dependencyMetadata[p]=sha(path.join(root,p));
const evidence=path.join(root,'docs/qa/quality/qa-environment-restore-001');
for(const p of ['supervisor-review-1.json','current-production/reusable-build.json','current-production/fixture-inputs.json'])data.protected[p]=sha(path.join(evidence,p));
const handoff=JSON.parse(fs.readFileSync(path.join(evidence,'current-production/reusable-build.json'),'utf8'));
for(const [relative,expected] of Object.entries(handoff.retained)) {
  const file=path.join(handoff.fixture,relative);const actual={size:fs.statSync(file).size,sha256:sha(file)};
  if(JSON.stringify(actual)!==JSON.stringify(expected))throw new Error(`Protected saved artifact mismatch: ${relative}`);
  data.protected[`retained/${relative}`]=actual;
}
const baselinePath=path.join(evidence,'current-production/after-reuse.json.gz');
const baseline=JSON.parse(gunzipSync(fs.readFileSync(baselinePath)));
const current=manifest();
data.fullBaseline={path:'../current-production/after-reuse.json.gz',sha256:sha(baselinePath),entries:Object.keys(baseline).length};
data.fullDelta=diff(baseline,current);
fs.mkdirSync(dir,{recursive:true});
const phase=process.argv[2];if(!['before','after'].includes(phase))throw new Error('Use before|after');
fs.writeFileSync(path.join(dir,`${phase}.json.gz`),gzipSync(JSON.stringify(data)));
if(phase==='after') {
  const before=JSON.parse(gunzipSync(fs.readFileSync(path.join(dir,'before.json.gz'))));
  const changes=[];for(const group of Object.keys(data))for(const p of new Set([...Object.keys(before[group]),...Object.keys(data[group])]))if(JSON.stringify(before[group][p])!==JSON.stringify(data[group][p]))changes.push({group,path:p,before:before[group][p]??null,after:data[group][p]??null});
  fs.writeFileSync(path.join(dir,'preservation-diff.json'),JSON.stringify(changes,null,2)+'\n');
  const fullBefore={...baseline};for(const change of before.fullDelta) {if(change.after===null)delete fullBefore[change.path];else fullBefore[change.path]=change.after;}
  const fullPhaseDiff=diff(fullBefore,current);
  fs.writeFileSync(path.join(dir,'full-phase-diff.json'),JSON.stringify(fullPhaseDiff,null,2)+'\n');
  const summary={runtime:process.version,sourcePaths:Object.keys(data.source).length,protectedPaths:Object.keys(data.protected).length,savedRetainedFiles:Object.keys(handoff.retained).length,savedBuildId:handoff.buildId,fullManifestPaths:Object.keys(current).length,dependencyPaths:Object.keys(current).filter(p=>p.startsWith('node_modules/')).length,phaseChangedPaths:fullPhaseDiff.length,preservationChangedPaths:changes.length,completeManifestFormat:'immutable fullBaseline SHA-bound snapshot plus full per-path fullDelta in before/after.json.gz; reconstruct without dropping caches',finalToolingHashes:Object.fromEntries(['local.mjs','verify.mjs','reuse-guards.mjs','guard-regression.test.mjs','guard-evidence.mjs'].map(p=>[p,sha(path.join(root,'scripts/qa',p))]))};
  fs.writeFileSync(path.join(dir,'preservation-summary.json'),JSON.stringify(summary,null,2)+'\n');
  console.log(JSON.stringify(summary));
  if(changes.length||fullPhaseDiff.length)throw new Error('Source/protected artifact/dependency state changed');
}
console.log(phase,JSON.stringify({sourcePaths:Object.keys(data.source).length,protectedPaths:Object.keys(data.protected).length,dependencyMetadataPaths:Object.keys(data.dependencyMetadata).length,runtime:process.version}));
