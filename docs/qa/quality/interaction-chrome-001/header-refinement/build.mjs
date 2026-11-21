import fs from 'node:fs';
import path from 'node:path';
import {spawnSync} from 'node:child_process';
import {createHash} from 'node:crypto';
import {gzipSync} from 'node:zlib';
import {root, tools, node, env, manifest, diff} from '../../../../../scripts/qa/local.mjs';

const out=path.join(root,'docs/qa/quality/interaction-chrome-001/header-refinement');
const save=(n,v)=>fs.writeFileSync(path.join(out,n),JSON.stringify(v,null,2)+'\n');
const hash=b=>createHash('sha256').update(b).digest('hex');
function run(name,args,cwd=root){const r=spawnSync(node,args,{cwd,env,encoding:'utf8',timeout:600000,maxBuffer:32000000});const text=`$ ${node} ${args.join(' ')}\ncwd=${cwd}\n${r.stdout||''}${r.stderr||''}\nexit=${r.status} signal=${r.signal} error=${r.error||''}\n`;fs.writeFileSync(path.join(out,name+'.log'),text);console.log(text);if(r.status!==0)throw new Error(name+' failed');}
function files(dir,base=dir){const result={};for(const e of fs.readdirSync(dir,{withFileTypes:true}).sort((a,b)=>a.name.localeCompare(b.name))){const f=path.join(dir,e.name);if(e.isDirectory())Object.assign(result,files(f,base));else if(e.isFile()){const b=fs.readFileSync(f);result[path.relative(base,f)]={size:b.length,sha256:hash(b)};}}return result;}
const before=manifest();fs.writeFileSync(path.join(out,'before-inputs.json.gz'),gzipSync(JSON.stringify(before)));
const fixture=fs.mkdtempSync(path.join(tools,'header-fixture-'));let inputs;
try {
 for(const rel of ['scripts/model-quality-summary.mjs','src','public','tests','package.json','package-lock.json','next.config.ts','tsconfig.json','next-env.d.ts','eslint.config.mjs','vitest.config.mts','postcss.config.mjs']){const src=path.join(root,rel);if(fs.existsSync(src))fs.cpSync(src,path.join(fixture,rel),{recursive:true,filter:p=>!['.next','node_modules','.git','test-results','playwright-report'].includes(path.basename(p))&&!path.basename(p).startsWith('.env')});}
 inputs=files(fixture);const copiedBytes=Object.values(inputs).reduce((n,x)=>n+x.size,0);if(copiedBytes>200*1024*1024)throw new Error('source copy too large');fs.symlinkSync(path.join(root,'node_modules'),path.join(fixture,'node_modules'));save('fixture-inputs.json',{fixture,copiedBytes,inputs});
 run('lint',[path.join(root,'node_modules/eslint/bin/eslint.js'),'--max-warnings=0','--ignore-pattern','.local-tools/**']);
 run('unit',[path.join(root,'node_modules/vitest/vitest.mjs'),'run']);
 run('build',[path.join(root,'node_modules/next/dist/bin/next'),'build','--webpack'],fixture);
 run('typescript',[path.join(root,'node_modules/typescript/bin/tsc'),'--noEmit','--incremental','false'],fixture);
 const buildId=fs.readFileSync(path.join(fixture,'.next/BUILD_ID'),'utf8').trim();const artifacts=files(path.join(fixture,'.next'));save('emitted-artifacts.json',{buildId,artifacts});
 const total=Object.values(files(fixture)).reduce((n,x)=>n+x.size,0);save('build-result.json',{status:'built_browser_pending',fixture,buildId,copiedBytes,fixtureBytes:total,buildCommand:`${node} ${root}/node_modules/next/dist/bin/next build --webpack`,buildExit:0,node:process.version,environment:{HOME:env.HOME,XDG_CONFIG_HOME:env.XDG_CONFIG_HOME,XDG_CACHE_HOME:env.XDG_CACHE_HOME,PLAYWRIGHT_BROWSERS_PATH:env.PLAYWRIGHT_BROWSERS_PATH,SWC_NATIVE_BINDING_CACHE:env.SWC_NATIVE_BINDING_CACHE}});if(total>200*1024*1024)throw new Error('fixture exceeds 200MiB; retained for investigation');
} finally {
 const after=manifest();fs.writeFileSync(path.join(out,'after-inputs.json.gz'),gzipSync(JSON.stringify(after)));const changes=diff(before,after);save('raw-input-diff.json',changes);const classified=changes.map(x=>({...x,producer:x.path==='node_modules/.vite/vitest/da39a3ee5e6b4b0d3255bfef95601890afd80709/results.json'?'Vitest results file':'UNCLASSIFIED'}));save('input-diff-classification.json',classified);console.log('Input changes:',JSON.stringify(classified));if(classified.some(x=>x.producer==='UNCLASSIFIED'))throw new Error('Unexpected input mutation');
}
