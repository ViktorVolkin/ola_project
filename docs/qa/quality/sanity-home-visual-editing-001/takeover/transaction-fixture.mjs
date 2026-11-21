import {readFile,writeFile,copyFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';
await copyFile(`${qa}/browser-results.json`,`${qa}/browser-hypothesis-1.json`);
let source=await readFile(`${qa}/browser-red.mjs`,'utf8');
const start=source.indexOf(" if(url.pathname.includes('/data/mutate/')){"),end=source.indexOf("\n if(url.pathname.includes('/features'))",start);
source=source.slice(0,start)+` if(url.pathname.includes('/data/mutate/')){
  const data=JSON.parse(body), transactionId=data.transactionId??crypto.randomUUID(), changed=new Map();
  for(const mutation of data.mutations??[]){
    const created=mutation.create??mutation.createIfNotExists??mutation.createOrReplace;
    if(created)docs.set(created._id,{...created,_rev:transactionId,_updatedAt:new Date().toISOString()});
    if(!mutation.patch)continue;
    const patch=mutation.patch,id=patch.id;
    if(!changed.has(id))changed.set(id,{previous:structuredClone(docs.get(id)),mutations:[]});
    changed.get(id).mutations.push(mutation);
    const doc=structuredClone(docs.get(id)??{_id:id});
    for(const [path,value]of Object.entries(patch.set??{}))setPath(doc,path,value);
    for(const [path,value]of Object.entries(patch.setIfMissing??{}))if(path.split('.').reduce((v,k)=>v?.[k],doc)===undefined)setPath(doc,path,value);
    for(const [path,value]of Object.entries(patch.diffMatchPatch??{})){const prior=path.split('.').reduce((v,k)=>v?.[k],doc);setPath(doc,path,applyPatches(parsePatch(value),prior)[0]);}
    doc._rev=transactionId;doc._updatedAt=new Date().toISOString();docs.set(id,doc);
  }
  for(const [id,{previous,mutations}]of changed){
    const doc=structuredClone(docs.get(id));
    const event={type:'mutation',documentId:id,eventId:transactionId,identity:'synthetic-user',mutations,result:doc,previousRev:previous?._rev,resultRev:doc._rev,transition:'update',transactionId,timestamp:doc._updatedAt,effects:{apply:[0,{...doc,_rev:undefined}]}};
    results.mockEvents??=[];results.mockEvents.push({id,previousRev:previous?._rev,resultRev:doc._rev,mutations:mutations.length});
    const bytes='event: mutation\\ndata: '+JSON.stringify(event)+'\\n\\n';
    setTimeout(()=>{for(const listener of listeners)listener.write(bytes);},50);
  }
  return {transactionId,results:(data.mutations??[]).map(m=>({id:m.patch?.id??m.create?._id??'homePage',operation:'update'}))};
 }
`+source.slice(end);
await writeFile(`${qa}/browser-transaction.mjs`,source);
console.log('Created transaction-consistent mock; production unchanged.');
