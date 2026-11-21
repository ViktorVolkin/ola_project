import {cp,mkdir,readFile,writeFile,symlink,readdir,stat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='/workspace',qa=`${root}/docs/qa/quality/sanity-home-ready-001/takeover`;
const digest=b=>createHash('sha256').update(b).digest('hex');
const source=[];
async function walk(dir){for(const e of await readdir(`${root}/${dir}`,{withFileTypes:true})){const p=`${dir}/${e.name}`;if(e.isDirectory())await walk(p);else if(e.isFile())source.push(p);}}
await walk('src');await walk('public');source.push('package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts');source.sort();
const files=[];for(const path of source){const b=await readFile(`${root}/${path}`);files.push({path,bytes:b.length,sha256:digest(b)});}
const deps=[];for(const path of ['node_modules/.package-lock.json','node_modules/@sanity/image-url/package.json','node_modules/swiper/package.json','node_modules/@swc/wasm/package.json','node_modules/next/package.json']){const b=await readFile(`${root}/${path}`);deps.push({path,bytes:b.length,sha256:digest(b)});}
const seed=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-ready-001/seed-import-dry-run.json`));
const doc=seed.document;doc._id='homePage';
const mark=(node,path='')=>{if(!node||typeof node!=='object')return;if(['en','ru','sr'].every(k=>typeof node[k]==='string')){for(const l of ['en','ru','sr'])node[l]=`SIM ${l} ${path}`;return;}for(const [k,v] of Object.entries(node))mark(v,path?`${path}.${k}`:k);};mark(doc);
const roleMap={};let i=0;
for(const path of Object.keys(seed.imageManifest)){
 const parts=path.split('.');let obj=doc;while(parts.length>1)obj=obj[parts.shift()];
 const id=(++i).toString(16).padStart(40,'0');
 const x=[0.17,0.5,0.88][(i-1)%3],y=[0.15,0.5,0.82][Math.floor((i-1)/3)%3];
 obj[parts[0]]={_type:'image',asset:{_type:'reference',_ref:`image-${id}-1200x800-png`},crop:{left:0.1,right:0.05,top:0.05,bottom:0.1},hotspot:{x,y,width:0.025,height:0.025}};
 roleMap[id]={path,x,y,crop:[120,40,1020,680]};
}
await writeFile(`${qa}/synthetic-document.json`,JSON.stringify(doc,null,2));await writeFile(`${qa}/synthetic-roles.json`,JSON.stringify(roleMap,null,2));
const variants=[];
for(const kind of ['release','synthetic']){
 const fixture=`${root}/.local-tools/ola-qa/sanity-home-sol-${kind}`;await mkdir(fixture);
 for(const name of ['src','public','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts'])await cp(`${root}/${name}`,`${fixture}/${name}`,{recursive:true});
 await symlink(`${root}/node_modules`,`${fixture}/node_modules`);
 if(kind==='synthetic'){
  const path=`${fixture}/src/content/sanity/home.ts`;const before=await readFile(path,'utf8');
  const after=before.replace('https://zhn2ddaj.api.sanity.io/v2025-02-19/data/query/production','http://127.0.0.1:42184/data/query/production');
  if(before===after)throw Error('Expected exactly scoped synthetic endpoint replacement');
  await writeFile(path,after);await writeFile(`${qa}/synthetic-adapter.txt`,after);
 }
 const bindings=[];for(const f of files){const b=await readFile(`${fixture}/${f.path}`);bindings.push({...f,fixtureSha256:digest(b),equal:digest(b)===f.sha256});}
 variants.push({kind,fixture,bindings});
}
await writeFile(`${qa}/source-bindings.json`,JSON.stringify({files,deps,sourceCount:files.length,sourceDigest:digest(Buffer.from(JSON.stringify(files))),variants},null,2));
console.log(JSON.stringify({sourceCount:files.length,variants:variants.map(v=>({kind:v.kind,differences:v.bindings.filter(f=>!f.equal).map(f=>f.path)})),deps},null,2));
// Reading stats ensures paths are real, without touching root .next or existing fixtures.
for(const v of variants)await stat(v.fixture);
