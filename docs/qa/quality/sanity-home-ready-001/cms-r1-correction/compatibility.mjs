import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {createHash} from 'node:crypto';
import ts from 'typescript';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/cms-r1-correction`;
const require=createRequire(`${root}/package.json`),hash=b=>createHash('sha256').update(b).digest('hex');
function moduleFrom(text,home){const result={};const code=ts.transpileModule(text,{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2022,esModuleInterop:true}}).outputText;new Function('require','exports',code)(id=>id==='@/content/home'?home:require(id),result);return result;}
const home=moduleFrom(await readFile(`${root}/src/content/home.ts`,'utf8'));
const beforeText=await readFile(`${qa}/before/home.ts.txt`,'utf8'),afterText=await readFile(`${root}/src/content/sanity/home.ts`,'utf8');
const before=moduleFrom(beforeText,home),after=moduleFrom(afterText,home);
const doc=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/takeover/synthetic-document.json`));
const cases=[{name:'retained synthetic published document, all fourteen roles',doc}];
let index=0;
for(const format of ['jpg','png','webp'])for(const crop of [undefined,{left:0.1,right:0.05,top:0.05,bottom:0.1},{left:0.1234,right:0.0567,top:0.0234,bottom:0.1345},{left:0.8,right:0.05,top:0.1,bottom:0.2}])for(const [x,y] of [[0.11,0.06],[0.25,0.3],[0.5,0.5],[0.8,0.7],[0.94,0.89]]){
 const copy=structuredClone(doc);copy.hero.photo={_type:'image',_key:`case-${index}`,asset:{_type:'reference',_ref:`image-${'a'.repeat(40)}-1200x800-${format}`},...(crop?{crop:{_type:'sanity.imageCrop',...crop}}:{}),hotspot:{_type:'sanity.imageHotspot',x,y,width:0.01,height:0.01}};cases.push({name:`valid crop/focus ${++index}`,doc:copy});
}
const old=[],fresh=[];
for(const c of cases)for(const locale of ['en','ru','sr']){
 const a=before.parseHome(c.doc,locale),b=after.parseHome(c.doc,locale);
 if(!a||!b)throw Error(`valid document rejected ${c.name} ${locale}`);
 const oldUrls=[before.imageUrl(c.doc.hero.photo,600),before.imageUrl(c.doc.hero.photo)],newUrls=[after.imageUrl(c.doc.hero.photo,600),after.imageUrl(c.doc.hero.photo)];
 const left=JSON.stringify({name:c.name,locale,parsed:a,urls:oldUrls}),right=JSON.stringify({name:c.name,locale,parsed:b,urls:newUrls});if(left!==right)throw Error(`canonical output changed ${c.name} ${locale}`);old.push(JSON.parse(left));fresh.push(JSON.parse(right));
}
const oldBytes=Buffer.from(JSON.stringify(old)),newBytes=Buffer.from(JSON.stringify(fresh));
await writeFile(`${qa}/valid-before.json`,oldBytes);await writeFile(`${qa}/valid-after.json`,newBytes);
const review=await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/supervisor-review-1.json`);
const result={actualModules:true,inMemoryTranspileOnly:true,installedSDK:require('@sanity/image-url/package.json').version,canonicalHomeModule:'src/content/home.ts (actual)',beforeAdapterSha256:hash(beforeText),afterAdapterSha256:hash(afterText),review1Sha256:hash(review),cases:cases.length,localeDocumentComparisons:old.length,byteEqual:oldBytes.equals(newBytes),bytes:oldBytes.length,beforeOutputSha256:hash(oldBytes),afterOutputSha256:hash(newBytes),retainedRoles:Object.keys(old[0].parsed.images).length,remoteAccess:false};await writeFile(`${qa}/compatibility.json`,JSON.stringify(result,null,2));console.log(JSON.stringify(result,null,2));
