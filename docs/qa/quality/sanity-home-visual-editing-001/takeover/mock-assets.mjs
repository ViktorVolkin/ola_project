import {readFile,writeFile,copyFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';
await copyFile(`${qa}/browser-results.json`,`${qa}/browser-handwritten-red.json`);
await copyFile(`${qa}/studio-click-failure.png`,`${qa}/handwritten-red.png`);
let source=await readFile(`${qa}/browser-final.mjs`,'utf8');
source=source.replace("const listeners=new Set();",`const listeners=new Set();
function seedAssets(node){if(!node||typeof node!=='object')return;const ref=node.asset?._ref;if(ref){const [,hash,w,h,ext]=/^image-([a-f0-9]+)-(\\d+)x(\\d+)-(\\w+)$/.exec(ref);docs.set(ref,{_id:ref,_type:'sanity.imageAsset',assetId:hash,extension:ext,mimeType:'image/png',originalFilename:'synthetic.png',url:'https://cdn.sanity.io/images/zhn2ddaj/production/'+hash+'-'+w+'x'+h+'.'+ext,path:'images/zhn2ddaj/production/'+hash+'-'+w+'x'+h+'.'+ext,size:1000,metadata:{dimensions:{width:Number(w),height:Number(h),aspectRatio:Number(w)/Number(h)},hasAlpha:false,isOpaque:true}});}for(const value of Object.values(node))seedAssets(value);}
seedAssets(published);`);
source=source.replace("if(url.pathname.includes('/data/history/'))return", "if(url.pathname.includes('/data/history/')&&!url.pathname.includes('/transactions/'))return");
source=source.replace("if(url.pathname.includes('/live/events'))", "if(url.pathname.includes('/live/events'))");
source=source.replace("if(url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events'))return route.fulfill", "if(url.pathname.includes('/data/history/')&&url.pathname.includes('/transactions/'))return route.fulfill({status:200,contentType:'application/x-ndjson',body:''});if(url.hostname==='cdn.sanity.io'&&url.pathname.startsWith('/images/'))return route.fulfill({status:200,contentType:'image/jpeg',body:mockPhoto});if(url.pathname.includes('/data/listen/')||url.pathname.includes('/live/events'))return route.fulfill");
await writeFile(`${qa}/browser-final.mjs`,source);
console.log('Preserved handwritten RED and added required mock asset/document/transaction protocol responses.');
