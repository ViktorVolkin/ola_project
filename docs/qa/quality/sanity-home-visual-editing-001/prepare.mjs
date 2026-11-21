import {mkdir, readFile, writeFile, cp, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='/workspace';
const out=`${root}/docs/qa/quality/sanity-home-visual-editing-001`;
const files=['package.json','package-lock.json','next.config.ts','studio/sanity.config.js','studio/package.json','studio/package-lock.json','src/content/sanity/home.ts','src/components/pages/HomePage/HomePage.tsx','src/app/[locale]/page.tsx','docs/qa/model-quality/ledger.json'];
async function collect(dir){for(const item of await readdir(`${root}/${dir}`,{withFileTypes:true})){const path=`${dir}/${item.name}`;if(item.isDirectory())await collect(path);else if(/\.(tsx|ts)$/.test(path))files.push(path);}}
await collect('src/components/widgets/HomeBlocks');
await mkdir(`${out}/before`,{recursive:true});
const manifest=[];
for(const path of files){const bytes=await readFile(`${root}/${path}`);const dest=`${out}/before/${path.replaceAll('/','__')}.txt`;await writeFile(dest,bytes);manifest.push({path,sha256:createHash('sha256').update(bytes).digest('hex')});}
await writeFile(`${out}/before/manifest.json`,JSON.stringify(manifest,null,2));
const isolated=`${root}/.local-tools/ola-qa/visual-editing-install`;
await mkdir(isolated,{recursive:true});
for(const path of ['package.json','package-lock.json'])await cp(`${root}/${path}`,`${isolated}/${path}`);
console.log(`Captured ${manifest.length} source witnesses; isolated lock workspace prepared.`);
