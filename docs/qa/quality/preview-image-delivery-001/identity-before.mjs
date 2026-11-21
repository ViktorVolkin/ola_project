import fs from 'node:fs';
import path from 'node:path';
import {gunzipSync} from 'node:zlib';
import {createHash} from 'node:crypto';
import {manifest, diff} from '../../../..//scripts/qa/local.mjs';
const dir='/workspace/docs/qa/quality/interaction-chrome-001/header-refinement';
const read=n=>JSON.parse(fs.readFileSync(path.join(dir,n)));
const inputs=read('fixture-inputs.json'), build=read('build-result.json'), emitted=read('emitted-artifacts.json');
const baseline=JSON.parse(gunzipSync(fs.readFileSync(path.join(dir,'after-inputs.json.gz'))));
const current=manifest();
const changes=diff(baseline,current);
const testPath='tests/e2e/workflow-disclosure.spec.ts';
const testHash='b7cce698195c8a218fcec7cab5d56ad7520aaea49867ba0ceccd220935e4cb43';
const relevant=changes.filter(x=>!x.path.startsWith('node_modules/.vite/vitest/')&&!x.path.startsWith('node_modules/.vitest-cache/')&&x.path!==testPath);
if(current[testPath]?.sha256!==testHash) throw new Error('Edited test hash mismatch');
const identity=p=>{const b=fs.readFileSync(p);return {size:b.length,sha256:createHash('sha256').update(b).digest('hex')};};
const mismatches=[];
for(const [p,want] of Object.entries(inputs.inputs)) for(const root of ['/workspace',inputs.fixture]) {if(root==='/workspace'&&p===testPath)continue;try{const got=identity(path.join(root,p));if(JSON.stringify(got)!==JSON.stringify(want))mismatches.push({root,p,want,got});}catch(e){mismatches.push({root,p,error:e.message});}}
let artifactErrors=[];
for(const [p,want] of Object.entries(emitted.artifacts)) {try{const got=identity(path.join(inputs.fixture,'.next',p));if(JSON.stringify(got)!==JSON.stringify(want))artifactErrors.push({p,want,got});}catch(e){artifactErrors.push({p,error:e.message});}}
const buildId=fs.readFileSync(path.join(inputs.fixture,'.next/BUILD_ID'),'utf8').trim();
const result={fixture:inputs.fixture,expectedBuildId:build.buildId,buildId,rootDiff:changes,unclassifiedRootDiff:relevant,inputCount:Object.keys(inputs.inputs).length,inputMismatches:mismatches,artifactCount:Object.keys(emitted.artifacts).length,artifactErrors};
fs.writeFileSync('/workspace/docs/qa/quality/preview-image-delivery-001/identity-before.json',JSON.stringify(result,null,2)+'\n');
console.log(JSON.stringify({fixture:result.fixture,buildId,expectedBuildId:build.buildId,rootDiff:changes.length,unclassifiedRootDiff:relevant.length,inputCount:result.inputCount,inputMismatches:mismatches.length,artifactCount:result.artifactCount,artifactErrors:artifactErrors.length},null,2));
if(relevant.length||mismatches.length||artifactErrors.length||buildId!==build.buildId)process.exitCode=1;
