import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {createServer} from 'node:net';
const root='/workspace', original=`${root}/docs/qa/quality/sanity-home-visual-editing-001`, qa=`${original}/takeover`;
await mkdir(`${qa}/before`,{recursive:true});
const paths=['package.json','package-lock.json','next.config.ts','eslint.config.mjs','vitest.config.mts','src/app/[locale]/layout.tsx','src/components/pages/HomePage/HomePage.tsx','studio/sanity.config.js','studio/package.json','studio/package-lock.json','docs/qa/model-quality/ledger.json','docs/qa/model-quality/task-routing.md'];
async function collect(dir){for(const e of await readdir(`${root}/${dir}`,{withFileTypes:true})){if(e.isDirectory())await collect(`${dir}/${e.name}`);else if(e.isFile())paths.push(`${dir}/${e.name}`);}}
for(const dir of ['src/content/sanity','src/app/api/draft-mode','src/components/widgets/HomeBlocks'])await collect(dir);
for(const p of ['tests/unit/sanity-preview.test.ts','tests/unit/sanity-preview-config.test.ts','tests/unit/sanity-home.test.ts'])paths.push(p);
const files=[];for(const path of [...new Set(paths)].sort()){const bytes=await readFile(`${root}/${path}`),snapshot=`before/${path.replaceAll('/','__')}.txt`;await writeFile(`${qa}/${snapshot}`,bytes);files.push({path,snapshot,sha256:createHash('sha256').update(bytes).digest('hex')});}
await writeFile(`${qa}/before-manifest.json`,JSON.stringify({time:new Date().toISOString(),runtime:{model:'gpt-6.1-sol',provider:'openai-codex',evidence:'Injected current runtime; no routing changes',role:'delegated implementer'},files},null,2));
let browser=await readFile(`${original}/browser.mjs`,'utf8');browser=browser.replace('const root=\'/workspace\',qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001`;','const root=\'/workspace\',qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`;');
browser=browser.replace("if(locale==='en'){","{");
await writeFile(`${qa}/browser-red.mjs`,browser);
const ports=[];for(const port of [42241,42242,42244,3333]){const server=createServer();try{await new Promise((resolve,reject)=>{server.once('error',reject);server.listen(port,'127.0.0.1',resolve);});await new Promise(resolve=>server.close(resolve));ports.push({port,available:true});}catch(error){ports.push({port,available:false,code:error.code});}}
await writeFile(`${qa}/initial-ports.json`,JSON.stringify(ports,null,2));console.log(JSON.stringify({snapshots:files.length,ports}));
