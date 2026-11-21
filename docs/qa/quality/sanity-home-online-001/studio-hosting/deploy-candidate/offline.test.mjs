// OFFLINE ONLY: synthetic transports/tokens, no runtime/loader import or real network.
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {TARGET,CONFIG,ARGS,run,hash,redact,safeSerialize,safeErrorMessage,verifyBytes} from './core.mjs';
const token='SYNTHETIC/token+only';
function fixture({app=TARGET,validate=async()=>{},readError,writeCode=0,disappear=false}={}){
 const saved=[],writes=[];let reads=0;
 return {saved,writes,options:{token,validate,readApp:async()=>{reads++;if(readError)throw Error(readError);if(disappear&&reads>1)throw Error('404 disappeared');return app;},writeOnce:async p=>{writes.push(p);return {code:disappear?1:writeCode,output:`message ${token} ${encodeURIComponent(token)} ${Buffer.from(token).toString('base64')}`};},persist:async(n,s)=>{for(const variant of [token,encodeURIComponent(token),Buffer.from(token).toString('base64')])assert.ok(!s.includes(variant),'redaction must precede persistence');saved.push({n,s});}}};
}
test('exact existing app writes once with pinned existing-app-only config',async()=>{const f=fixture();await run(f.options);assert.equal(f.writes.length,1);assert.equal(f.writes[0].config,CONFIG);assert.match(CONFIG,/deployment:\{appId:'xxpedejjvg9va6r4u8t4llzw'/);assert.deepEqual(f.writes[0].args,ARGS);assert.ok(!ARGS.includes('--url')&&!ARGS.includes('--create'));});
for(const [name,app] of [['missing',null],['multiple',[TARGET,TARGET]],...['id','projectId','appHost','type','urlType'].map(k=>[`wrong-${k}`,{...TARGET,[k]:'wrong'}])])test(`${name} rejected before any write`,async()=>{const f=fixture({app});await assert.rejects(run(f.options));assert.equal(f.writes.length,0);});
for(const message of ['401 unauthorized','network ambiguity'])test(`${message} fails closed`,async()=>{const f=fixture({readError:message});await assert.rejects(run(f.options));assert.equal(f.writes.length,0);});
test('source/output validation rejection means zero writes',async()=>{const f=fixture({validate:async()=>{throw Error('tampered source/output');}});await assert.rejects(run(f.options));assert.equal(f.writes.length,0);});
test('app disappearance during write is failed attempt with no retry/create',async()=>{const f=fixture({disappear:true});await assert.rejects(run(f.options));assert.equal(f.writes.length,1);assert.ok(f.saved.some(x=>x.n==='operation-error.json'));});
test('provider errors are redacted before persistence',async()=>{const f=fixture({readError:`401 ${token} ${encodeURIComponent(token)} ${Buffer.from(token).toString('base64')}`});await assert.rejects(run(f.options));assert.equal(f.writes.length,0);assert.ok(f.saved[0].s.includes('[REDACTED]'));});
test('redaction raw URI/base64',()=>{for(const s of [token,encodeURIComponent(token),Buffer.from(token).toString('base64')])assert.equal(redact(s,token),'[REDACTED]');});
test('artifact exact set/bytes, stale/tampered/extra/forbidden rejected',()=>{const bytes=Buffer.from('synthetic public');const rows=[{path:'static/a.js',bytes:bytes.length,sha256:hash(bytes)}];verifyBytes(rows,[{path:'static/a.js',bytes}]);for(const actual of [[],[{path:'static/a.js',bytes:Buffer.from('tamper')}],[{path:'.env',bytes}],[{path:'static/a.js',bytes},{path:'extra.js',bytes}]])assert.throws(()=>verifyBytes(rows,actual));});
test('actual installed Studio resolver: pinned appId absent is INVALID, never would-create',async()=>{
 let source=await readFile('/workspace/studio/node_modules/@sanity/cli/dist/actions/deploy/resolveDeployTarget.js','utf8');
 const seam="import { getUserApplication, getUserApplications } from '../../services/userApplications.js';";assert.equal(source.split(seam).length,2);
 source=source.replace(seam,'const getUserApplication=async()=>null;const getUserApplications=async()=>[];');
 source=source.replace(/^import .*;$/gm,'');
 // Other imported bindings are only used by unrelated exported functions.
 const resolver=await import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
 const result=await resolver.resolveStudioDeployTarget({appId:TARGET.id,projectId:TARGET.projectId,isExternal:false,studioHost:TARGET.appHost});
 assert.equal(result.type,'invalid');assert.equal(result.reason,'app-not-found');assert.notEqual(result.type,'would-create');
});

const opaqueCases=[['quote','SYNTHETIC-QUOTE-"-ONLY'],['backslash','SYNTHETIC-BACKSLASH-\\-ONLY'],['newline','SYNTHETIC-LINE-\n-ONLY'],['control','SYNTHETIC-CONTROL-\u0001\t\r-ONLY'],['mixed','SYNTHETIC-"\\\n\u0002-END']];
function variants(secret){return [...new Set([secret,encodeURIComponent(secret),Buffer.from(secret).toString('base64'),JSON.stringify(secret).slice(1,-1)])];}
function assertCleanRoundtrip(text,secret){const parsed=JSON.parse(text);function visit(value){if(typeof value==='string'){for(const variant of variants(secret))assert.ok(!value.includes(variant),'Parsed persistence retains an opaque-token representation');}else if(value&&typeof value==='object'){for(const [key,item]of Object.entries(value)){visit(key);visit(item);}}}visit(parsed);return parsed;}
for(const [name,secret]of opaqueCases){
 test(`HOST-R1 ${name}: actual core error path redacts before JSON persistence, zero writes`,async()=>{let writes=0;const records=[];await assert.rejects(run({token:secret,validate:async()=>{},readApp:async()=>{throw new TypeError('401 '+variants(secret).join(' | '));},writeOnce:async()=>{writes++;return {code:0};},persist:async(n,text)=>{assertCleanRoundtrip(text,secret);records.push({n,text});}}));assert.equal(writes,0);assert.equal(records.length,1);assert.equal(records[0].n,'operation-error.json');assert.ok(records[0].text.includes('[REDACTED]'));});
 test(`HOST-R1 ${name}: result/readback/final-error roundtrips`,async()=>{let writes=0;const records=[];const echo=variants(secret).join(' | ');await run({token:secret,validate:async()=>{},readApp:async()=>TARGET,writeOnce:async()=>{writes++;return {code:0,output:echo,nested:{echo},[secret]:echo};},persist:async(n,text)=>{assertCleanRoundtrip(text,secret);records.push(n);}});assert.equal(writes,1);assert.ok(records.includes('deploy-result.json'));for(const value of [{status:'readback',manifest:{description:echo}},{blocked:true,message:safeErrorMessage(new TypeError(echo))},new TypeError(echo)])assertCleanRoundtrip(safeSerialize(value,secret),secret);});
}
test('serialization failures never interpolate error, cycle, getter or toJSON payload',()=>{const secret='SYNTHETIC-FAILURE-"\\-ONLY';const cycle={message:secret};cycle.self=cycle;const getter={get message(){throw new TypeError(secret);}};const badJSON={toJSON(){throw new TypeError(secret);}};for(const value of [cycle,getter,badJSON]){const text=safeSerialize(value,secret);assert.equal(text,'null');assertCleanRoundtrip(text,secret);}const badString={toString(){throw new TypeError(secret);}};assert.equal(safeErrorMessage(badString),undefined);});
test('runtime readback and final-error use the same safe serializer, no runtime import',async()=>{const source=await readFile(new URL('./runtime.mjs',import.meta.url),'utf8');assert.ok(source.includes("persist('hosting-readback.json',safeSerialize("));assert.ok(source.includes("execution/final-error.json`,safeSerialize("));assert.ok(!source.includes('redact(JSON.stringify('));});
