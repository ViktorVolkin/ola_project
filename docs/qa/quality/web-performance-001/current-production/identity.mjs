import fs from 'node:fs';
import path from 'node:path';
import {createHash} from 'node:crypto';
import {gzipSync,gunzipSync} from 'node:zlib';
import {manifest,diff} from '../../../../../scripts/qa/local.mjs';
const root='/workspace', fix=root+'/.local-tools/ola-qa/header-fixture-wxM6wf', out=root+'/docs/qa/quality/web-performance-001/current-production', prior=root+'/docs/qa/quality/interaction-chrome-001/header-refinement';
const hash=p=>createHash('sha256').update(fs.readFileSync(p)).digest('hex');
const save=(name,v)=>fs.writeFileSync(out+'/'+name,JSON.stringify(v,null,2)+'\n');
const current=manifest();const phase=process.argv[2]||'before';fs.writeFileSync(out+'/'+phase+'-inputs.json.gz',gzipSync(JSON.stringify(current)));
const baseline=JSON.parse(gunzipSync(fs.readFileSync(prior+'/after-inputs.json.gz')));const changes=diff(baseline,current);save(phase+'-baseline-diff.json',changes);
const original=JSON.parse(fs.readFileSync(prior+'/fixture-inputs.json')).inputs;
const differences=[];for(const [rel,expected] of Object.entries(original)){for(const [kind,base] of [['root',root],['fixture',fix]]) {const p=path.join(base,rel);let actual=null;try{const s=fs.statSync(p);actual={size:s.size,sha256:hash(p)};}catch{}if(JSON.stringify(expected)!==JSON.stringify(actual))differences.push({kind,path:rel,expected,actual});}}
const built=JSON.parse(fs.readFileSync(prior+'/emitted-artifacts.json'));const artifactChanges=[];for(const [rel,expected] of Object.entries(built.artifacts)){if(rel.startsWith('cache/images/'))continue;const p=path.join(fix,'.next',rel);let actual=null;try{const s=fs.statSync(p);actual={size:s.size,sha256:hash(p)};}catch{}if(JSON.stringify(expected)!==JSON.stringify(actual))artifactChanges.push({path:rel,expected,actual});}
const cacheClass=p=>p.startsWith('node_modules/.vite/vitest/')||p.startsWith('node_modules/.vitest-cache/');
const unclassified=changes.filter(c=>!cacheClass(c.path));
const result={phase,buildId:fs.readFileSync(fix+'/.next/BUILD_ID','utf8').trim(),baselineDiffCount:changes.length,baselineDiffUnclassified:unclassified,fixtureInputDifferences:differences,artifactChanges,artifactExpectedCount:Object.keys(built.artifacts).length,mutableExclusion:'only emitted .next/cache/images entries; baseline diff classifies only exact Vitest paths; raw diffs retained',fixtureNodeModules:fs.readlinkSync(fix+'/node_modules')};save(phase+'-identity.json',result);console.log(JSON.stringify(result,null,2));if(result.buildId!=='0RKE00M-JxGMYb9sr8we6'||unclassified.length||differences.length||artifactChanges.length)process.exitCode=1;
