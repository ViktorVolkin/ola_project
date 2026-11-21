import {readFile,writeFile,readdir} from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/takeover`;
const hash=b=>createHash('sha256').update(b).digest('hex');
const binding=JSON.parse(await readFile(`${qa}/source-bindings.json`));const baseline=[];
for(const f of binding.files){
 if(f.path==='src/components/widgets/HomeBlocks/HomeCommon/cmsImageProps.ts')continue;
 let expected=await readFile(`${root}/${f.path}`);
 if(f.path==='src/content/sanity/home.ts')expected=await readFile(`${qa}/before/home.ts.txt`);
 else if(f.path.startsWith('src/components/widgets/HomeBlocks/'))expected=await readFile(`${qa}/before/HomeBlocks/${f.path.slice('src/components/widgets/HomeBlocks/'.length)}.txt`);
 const actual=await readFile(`${root}/.local-tools/ola-qa/sanity-home-fixture/${f.path}`);
 baseline.push({path:f.path,expectedBeforeSha256:hash(expected),baselineSha256:hash(actual),equal:actual.equals(expected)});
}
await writeFile(`${qa}/baseline-binding.json`,JSON.stringify(baseline,null,2));if(baseline.some(f=>!f.equal))throw Error(`baseline is not takeover-before: ${baseline.filter(f=>!f.equal).map(f=>f.path)}`);
const pairs=[['before/home.ts.txt','src/content/sanity/home.ts'],['before/sanity-home.test.ts.txt','tests/unit/sanity-home.test.ts'],['before/studio-README.md.txt','studio/README.md'],['before/ledger.json.txt','docs/qa/model-quality/ledger.json']];
async function walk(dir){for(const e of await readdir(`${qa}/${dir}`,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await walk(p);else if(p.endsWith('.txt'))pairs.push([p,`src/components/widgets/HomeBlocks/${p.slice('before/HomeBlocks/'.length,-4)}`]);}}
await walk('before/HomeBlocks');
let diff='';for(const [old,current] of pairs){const r=spawnSync('diff',['-u','--label',`before/${current}`,'--label',`after/${current}`,`${qa}/${old}`,`${root}/${current}`],{encoding:'utf8'});if(r.status>1)throw Error(r.stderr);diff+=r.stdout;}
const helper='src/components/widgets/HomeBlocks/HomeCommon/cmsImageProps.ts';diff+=spawnSync('diff',['-u','--label','/dev/null','--label',`after/${helper}`,'/dev/null',`${root}/${helper}`],{encoding:'utf8'}).stdout;
await writeFile(`${qa}/takeover-only.diff`,diff);
const studioFiles=['studio/sanity.config.js','studio/sanity.cli.js','studio/package.json','studio/package-lock.json','studio/tsconfig.json','studio/scripts/prepare-seed.mjs','studio/README.md'];let studioPatch='';const studioManifest=[];
for(const p of studioFiles){const b=await readFile(`${root}/${p}`);studioManifest.push({path:p,bytes:b.length,sha256:hash(b)});studioPatch+=spawnSync('diff',['-u','--label','/dev/null','--label',p,'/dev/null',`${root}/${p}`],{encoding:'utf8',maxBuffer:10*1024*1024}).stdout;}
await writeFile(`${qa}/studio-current.patch`,studioPatch);await writeFile(`${qa}/studio-source-manifest.json`,JSON.stringify(studioManifest,null,2));
const before=[];async function snapshot(dir){for(const e of await readdir(`${qa}/${dir}`,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await snapshot(p);else if(e.name!=='manifest.json'){const b=await readFile(`${qa}/${p}`);before.push({path:p,bytes:b.length,sha256:hash(b)});}}}await snapshot('before');await writeFile(`${qa}/before/manifest.json`,JSON.stringify(before,null,2));
const ledger=JSON.parse(await readFile(`${root}/docs/qa/model-quality/ledger.json`));const unit=ledger.units.find(u=>u.id==='OLA-SANITY-HOME-READY-001');if(!unit||unit.delivery_state!=='awaiting_review'||unit.manager_ready!==false||unit.review_status!=='not_requested')throw Error('wrong handoff state');
console.log(JSON.stringify({beforeFiles:before.length,baselineBeforeMatches:baseline.length,takeoverDiffBytes:Buffer.byteLength(diff),studioSourceFiles:studioManifest.length,unit:unit.id,state:unit.delivery_state,managerReady:unit.manager_ready,review:unit.review_status},null,2));
