// Local-only preparation: no Sanity client, network, credentials or uploads.
import {writeFile, readFile} from 'node:fs/promises';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {getHomeContent, homeImages} from '../../src/content/home.ts';

const output = process.argv[2];
if (!output || process.argv.length !== 3) throw new Error('Usage: node studio/scripts/prepare-seed.mjs OUTPUT.json (must not already exist)');
const locales = ['en','ru','sr'];
const copies = Object.fromEntries(locales.map(locale => [locale,getHomeContent(locale)]));
const pick = (path) => Object.fromEntries(locales.map(locale => [locale,path.reduce((v,k)=>v[k], copies[locale])]));
const editorial = (key, handwritten=false, alt=true) => Object.fromEntries(['eyebrow','title','description',...(handwritten?['handwritten']:[]),...(alt?['alt']:[])].map(field=>[field,pick([key,field])]));
const card = (group,key,description=true) => Object.fromEntries(['title',...(description?['description']:[]),'alt'].map(field=>[field,pick([group,key,field])]));
const labels={};
for (const locale of locales) {
  const messages=JSON.parse(await readFile(new URL(`../../src/i18n/messages/home/${locale}.json`,import.meta.url),'utf8'));
  for (const [key,value] of Object.entries(messages)) if(key!=='viewMoodBouquet') (labels[key]??={})[locale]=value;
}
const doc={_id:'drafts.homePage',_type:'homePage',hero:editorial('hero',true),services:{flowers:card('services','flowers'),balloons:card('services','balloons'),weddings:card('services','weddings')},mood:editorial('mood',false,false),moods:{romantic:card('moods','romantic',false),bright:card('moods','bright',false),natural:card('moods','natural',false)},custom:editorial('custom'),extras:{title:pick(['extras','title']),description:pick(['extras','description']),balloons:{title:pick(['extras','balloons']),alt:pick(['extras','balloonAlt'])},card:{title:pick(['extras','card']),alt:pick(['extras','cardAlt'])},chocolates:{title:pick(['extras','chocolates']),alt:pick(['extras','chocolateAlt'])}},meet:editorial('meet',true),events:editorial('events'),labels};
const images={'hero.photo':homeImages.hero,'services.flowers.photo':homeImages.flowers,'services.balloons.photo':homeImages.balloons,'services.weddings.photo':homeImages.weddings,'services.weddingsMobile':homeImages.events,'moods.romantic.photo':homeImages.flowers,'moods.bright.photo':homeImages.bright,'moods.natural.photo':homeImages.natural,'custom.photo':homeImages.custom,'extras.balloons.photo':homeImages.balloons,'extras.card.photo':homeImages.card,'extras.chocolates.photo':homeImages.chocolates,'meet.photo':homeImages.meet,'events.photo':homeImages.events};
for(const path of Object.values(images)) await readFile(new URL(`../../public${path}`,import.meta.url));
const importDoc = structuredClone(doc);
for (const [field, path] of Object.entries(images)) {
  const parts = field.split('.');
  let parent = importDoc;
  while (parts.length > 1) parent = parent[parts.shift()];
  parent[parts[0]] = {_type:'image', _sanityAsset:`image@${pathToFileURL(fileURLToPath(new URL(`../../public${path}`, import.meta.url))).href}`};
}
await writeFile(output,JSON.stringify({notice:'LOCAL DRAFT PREPARATION ONLY. RU and SR are unapproved translation drafts. Image paths are not Sanity assets; upload and attach them before publishing.',document:doc,imageManifest:images},null,2)+'\n',{flag:'wx'});
await writeFile(`${output}.ndjson`,JSON.stringify(importDoc)+'\n',{flag:'wx'});
console.log(`Wrote ${output} and ${output}.ndjson: ${Object.keys(images).length} image fields, ${locales.length} locales; no network or remote write.`);
