import {readFile,access} from 'node:fs/promises';import {fileURLToPath} from 'node:url';
const root='/workspace/docs/qa/quality/sanity-home-ready-001/seed-import-dry-run.json';
const manifest=JSON.parse(await readFile(root,'utf8'));const doc=JSON.parse((await readFile(`${root}.ndjson`,'utf8')).trim());
if(doc._id!=='drafts.homePage'||doc._type!=='homePage')throw Error('wrong draft identity');let count=0;
for(const field of Object.keys(manifest.imageManifest)){const img=field.split('.').reduce((o,k)=>o[k],doc);if(img._type!=='image'||!img._sanityAsset.startsWith('image@file://'))throw Error(`bad image ${field}`);await access(fileURLToPath(img._sanityAsset.slice(6)));count++;}
if(count!==14)throw Error('wrong asset field count');for(const locale of ['en','ru','sr'])if(!doc.hero.title[locale]||!doc.events.alt[locale]||!doc.labels.shopBouquets[locale])throw Error(`missing ${locale}`);
console.log(`local import draft validated: ${count} image file URIs, EN/RU/SR exemplar fields, no remote writes`);
