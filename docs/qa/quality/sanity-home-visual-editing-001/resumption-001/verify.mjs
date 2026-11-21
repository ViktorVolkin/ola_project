import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
const root='/workspace',base=root+'/docs/qa/quality/sanity-home-visual-editing-001',old=base+'/takeover',out=base+'/resumption-001';
const hash=b=>createHash('sha256').update(b).digest('hex');
const json=async p=>JSON.parse(await readFile(p,'utf8'));
const protectedNames=['FINAL.md','OPERATOR.md','audit-results.json','CHECKPOINT.md','changes.json','before-manifest.json','source.diff','checks.json','browser-results.json','public-comparison.json','public-script-budget.json','build-results.json'];
const protectedFiles=[];for(const name of protectedNames)protectedFiles.push({path:'takeover/'+name,sha256:hash(await readFile(old+'/'+name))});
protectedFiles.push({path:'supervisor-review-1.json',sha256:hash(await readFile(base+'/supervisor-review-1.json'))});
if(process.argv.includes('--final')){const initial=await json(out+'/binding.json');assert.deepEqual(protectedFiles,initial.protectedFiles);console.log('Protected historical packet and receipt byte-unchanged');}
const builds=await json(old+'/build-results.json'),bindings=[];
for(const build of builds){
 assert.equal((await readFile(build.fixture+'/.next/BUILD_ID','utf8')).trim(),build.buildId);
 const current=[];
 for(const row of build.files){
  assert(!row.path.startsWith('.env'),'no env access');
  assert.equal(hash(await readFile(build.fixture+'/'+row.path)),row.sha256,'fixture '+row.path);
  let source=await readFile(root+'/'+row.path);
  if(build.kind==='synthetic'){
   if(row.path==='src/content/sanity/home.ts')source=Buffer.from(source.toString().replace('https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production','http://127.0.0.1:42244/data/query/production'));
   if(row.path==='src/content/sanity/preview-client.ts')source=Buffer.from(source.toString().replace('useCdn: false, perspective:', 'apiHost: "http://127.0.0.1:42244", useProjectHostname: false, useCdn: false, perspective:').replace('process.env.NODE_ENV !== "production" && url.hostname', 'url.hostname'));
   if(row.path==='src/content/sanity/preview-policy.ts')source=Buffer.from(source.toString().replace('process.env.NODE_ENV === "development" && origin','origin'));
   if(row.path==='next.config.ts')source=Buffer.from(source.toString().replace('process.env.NODE_ENV === "development" ? " http://localhost:3333" : ""','" http://localhost:3333"'));
  }
  assert.equal(hash(source),row.sha256,'source '+row.path);current.push(row);
 }
 bindings.push({kind:build.kind,fixture:build.fixture,buildId:build.buildId,files:current.length,manifestSha256:hash(JSON.stringify(current)),sourceBound:true});
}
const original=await readFile(base+'/before/src__content__sanity__home.ts.txt','utf8');
assert.equal((await readFile(root+'/src/content/sanity/home.ts','utf8')).replace('export const imagePaths =','const imagePaths ='),original,'strict published adapter changed');
const before=await json(old+'/before-manifest.json'),sourceBindings=[];
for(const row of before.files.filter(r=>r.path.startsWith('studio/')||r.path.startsWith('tests/unit/sanity-'))){sourceBindings.push({path:row.path,sha256:hash(await readFile(root+'/'+row.path)),matchesBefore:hash(await readFile(root+'/'+row.path))===row.sha256});}
assert(sourceBindings.every(x=>x.matchesBefore));
const saved=await json(old+'/browser-results.json'),paths=[...new Set(saved.overlayWorkflow.map(x=>x.path).filter(Boolean))].sort();
const savedSummary={label:'SAVED mixed-route attempt evidence, not fresh tests',checks:saved.checks.length,uniquePaths:paths.length,photoRoles:paths.filter(p=>p.endsWith('.photo')||p==='services.weddingsMobile').length,editRefresh:saved.overlayWorkflow.filter(x=>['edit-refresh','section-edit-refresh'].includes(x.kind)).length,errors:saved.errors,failure:saved.failure??null};
const comparisons=await json(old+'/public-comparison.json');
const publicSaved=comparisons.cases.map(c=>({locale:c.locale,width:c.width,domEqual:c.domEqual,pngEqual:c.pngEqual,hashes:c.pair.map(p=>p.pngHash)}));
assert.deepEqual(await json(old+'/public-script-budget.json'),[]);
const result={time:new Date().toISOString(),runtime:{model:'gpt-6.1-sol',provider:'openai-codex',evidence:'Injected active runtime, not per-call telemetry; no observed fallback so far; completion route requires parent reconciliation',role:'authorized bounded executor, not Supervisor'},bindings,sourceBindings,strictPublishedAdapterOnlyExportChanged:true,savedSummary,publicSaved,jsBudget:{numericClaimWithdrawn:true,newMeasurement:false},protectedFiles};
await writeFile(out+(process.argv.includes('--final')?'/binding-final.json':'/binding.json'),JSON.stringify(result,null,2));
console.log(JSON.stringify(result,null,2));
if(!process.argv.includes('--final')){
 const script=await readFile(old+'/browser-final.mjs','utf8');
 let copy=script.replace('qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`','qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/resumption-001`');
 const start=copy.indexOf('  const allPaths='),end=copy.indexOf("  const image=frame.locator",start);
 assert(start>0&&end>start);copy=copy.slice(0,start)+'  // Bounded representative: hero real save/refresh + description/button click per locale; full mapping remains saved evidence.\n'+copy.slice(end);
 await writeFile(out+'/browser-representative.mjs',copy);
 await writeFile(out+'/browser-scope.json',JSON.stringify({source:'../takeover/browser-final.mjs',sourceSha256:hash(script),executedSha256:hash(copy),changes:'Own output directory; omit exhaustive text/photo/section-edit loops only. Preserve three actual hero save-refresh cycles after locale navigation, mobile wedding all locales and all auth/isolation/exit controls.',synthetic:true},null,2));
}
