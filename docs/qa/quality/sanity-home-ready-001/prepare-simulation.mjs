import {readFile,writeFile} from 'node:fs/promises';
const seed=JSON.parse(await readFile('/workspace/docs/qa/quality/sanity-home-ready-001/seed-final-dry-run.json','utf8'));
const doc=seed.document; doc._id='homePage';
const mark=(node,path='')=>{if(!node||typeof node!=='object')return; if(['en','ru','sr'].every(k=>typeof node[k]==='string')) {for(const locale of ['en','ru','sr'])node[locale]=`SIM ${locale} ${path}`;return;} for(const [key,value] of Object.entries(node))mark(value,path?`${path}.${key}`:key);};mark(doc);
for (const path of Object.keys(seed.imageManifest)) {
 const parts=path.split('.');let obj=doc;while(parts.length>1)obj=obj[parts.shift()];
 obj[parts[0]]={_type:'image',asset:{_type:'reference',_ref:`image-${'a'.repeat(40)}-1200x800-jpg`},crop:{left:0.1,right:0.05,top:0.05,bottom:0.1},hotspot:{x:0.7,y:0.5,width:0.2,height:0.2}};
}
await writeFile('/workspace/.local-tools/ola-qa/sanity-home-simulated/src/content/sanity/simulated.json',JSON.stringify(doc,null,2)+'\n');
console.log('SIMULATED fixture: 14 synthetic asset references, 3 locales; no network or Sanity data writes');
