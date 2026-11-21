import {readFile,writeFile} from 'node:fs/promises';import sharp from 'sharp';
const root='/workspace/docs/qa/quality/sanity-home-ready-001';
const result=JSON.parse(await readFile(`${root}/simulated-results.json`,'utf8'));
const rows=[];
for(const row of result.rows){const file=`${root}/simulated-${row.locale}-${row.width}.png`;const image=sharp(file);const meta=await image.metadata();const data=[];
for(const entry of row.images){const p=entry.parent;const left=Math.max(0,Math.floor(p.x)),top=Math.max(0,Math.floor(p.y)),width=Math.min(meta.width-left,Math.floor(p.width)),height=Math.min(meta.height-top,Math.floor(p.height));if(width<=0||height<=0){data.push({alt:entry.alt,yellow:0,reason:'outside screenshot'});continue;}const {data:raw,info}=await sharp(file).extract({left,top,width,height}).removeAlpha().raw().toBuffer({resolveWithObject:true});let yellow=0;for(let i=0;i<raw.length;i+=info.channels)if(raw[i]>220&&raw[i+1]>220&&raw[i+2]<60)yellow++;data.push({alt:entry.alt,yellow,parent:p,src:entry.src});}
rows.push({locale:row.locale,width:row.width,images:data});}
await writeFile(`${root}/simulated-hotspot-pixels.json`,JSON.stringify(rows,null,2));console.log(JSON.stringify(rows.map(r=>({locale:r.locale,width:r.width,missing:r.images.filter(i=>i.yellow===0).map(i=>i.alt)})),null,2));if(rows.some(r=>r.images.some(i=>i.yellow===0)))process.exitCode=1;
