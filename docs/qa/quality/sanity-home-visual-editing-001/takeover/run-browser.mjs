import {copyFile,readFile,writeFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover',stamp=new Date().toISOString().replaceAll(':','-');
for(const file of ['browser-results.json','latest-failure.png','studio-click-failure.png']){try{await copyFile(`${qa}/${file}`,`${qa}/retained-${stamp}-${file}`);}catch(e){if(e.code!=='ENOENT')throw e;}}
const before=await readFile(`${qa}/browser-final.mjs`);await writeFile(`${qa}/browser-executed.mjs.txt`,before);
await import('./browser-final.mjs');
