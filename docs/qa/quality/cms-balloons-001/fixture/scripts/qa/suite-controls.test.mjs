import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync,mkdirSync,writeFileSync,rmSync,readFileSync,unlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {families,selection,playwrightArgs,runGroups} from './suite-controls.mjs';
import {inventory,listInventory} from './suite-inventory.mjs';

const all=['unit','product','gallery','detail-page','migration','action-button'];
function simulate(failure) {
  const seen=[], emitted=[];
  const {mode,selected}=selection(['full']);
  const result=runGroups(mode,selected,()=>{seen.push('unit'); return {suite:'unit',status:'PASS'};},family=>{
    seen.push(family);
    if (family === failure && failure === 'detail-page') throw new Error('fixture setup');
    return {suite:family,status:family === failure ? 'FAIL' : 'PASS'};
  }, item=>emitted.push(item));
  return {...result,seen,emitted};
}
test('full success includes units and all five families once',()=>{
  const result=simulate();
  assert.deepEqual(result.seen,all);
  assert.deepEqual(result.results.map(x=>x.suite),all);
  assert.deepEqual(result.emitted.map(x=>x.suite),families);
  assert.equal(result.exitCode,0);
});
test('failed and blocked groups cannot pass and later groups still run',()=>{
  for (const family of ['gallery','detail-page']) {
    const result=simulate(family);
    assert.deepEqual(result.seen,all);
    assert.equal(result.exitCode,1);
    assert.equal(result.results.find(x=>x.suite===family).status,family==='gallery'?'FAIL':'BLOCKED');
  }
});
test('literal file/project/grep forwarding and invalid selections',()=>{
  const regex='server-rendered without JavaScript$';
  const plan=selection(['detail-page','--file','tests/e2e/bouquet-detail-page.spec.ts','--project','chromium','--grep',regex]);
  assert.deepEqual(playwrightArgs('/private source',plan.options).slice(-5),['bouquet-detail-page.spec.ts','--project','chromium','--grep',regex]);
  assert.throws(()=>selection(['product','--file','tests/e2e/bouquet-detail-page.spec.ts']),/belonging/);
  assert.throws(()=>selection(['full','--project','mobile']),/full does not accept filters/);
  assert.throws(()=>selection(['full','--grep','']),/full does not accept filters/);
});
test('inventory rejects unknown and missing specs in isolated synthetic tree',()=>{
  const tmp=mkdtempSync(path.join(tmpdir(),'ola-inventory-'));
  try {
    for (const spec of Object.keys(inventory)) {const file=path.join(tmp,spec); mkdirSync(path.dirname(file),{recursive:true}); writeFileSync(file,'');}
    assert.equal(listInventory(tmp).status,'CLASSIFIED_ONLY_NOT_EXECUTED');
    const unknown=path.join(tmp,'tests/e2e/unclassified.spec.ts'); writeFileSync(unknown,'');
    const removed=Object.keys(inventory)[0]; unlinkSync(path.join(tmp,removed));
    const found=listInventory(tmp); assert.deepEqual(found.unknown,['tests/e2e/unclassified.spec.ts']); assert.deepEqual(found.missing,[removed]);
    const cli=spawnSync(process.execPath,[path.resolve('scripts/qa/suite-inventory.mjs'),tmp],{encoding:'utf8'});
    assert.equal(cli.status,1);
    assert.equal(JSON.parse(cli.stdout).status,'FAIL');
  } finally {rmSync(tmp,{recursive:true,force:true});}
});
test('package commands explicitly distinguish product and full',()=>{
  const scripts=JSON.parse(readFileSync('package.json','utf8')).scripts;
  assert.equal(scripts['test:e2e'],'node scripts/qa/suites.mjs product');
  assert.equal(scripts['test:full'],'node scripts/qa/suites.mjs full');
  assert.match(scripts.check,/npm run test:full/);
});
