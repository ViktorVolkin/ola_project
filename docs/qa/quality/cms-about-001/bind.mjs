import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const root='/workspace',qa=`${root}/docs/qa/quality/cms-about-001`,base=`${root}/.local-tools/ola-qa/cms-about-001/before`;
const hash=b=>createHash('sha256').update(b).digest('hex'),paths=[];
async function collect(dir){for(const e of await readdir(`${root}/${dir}`,{withFileTypes:true})){if(e.isDirectory())await collect(`${dir}/${e.name}`);else if(e.isFile())paths.push(`${dir}/${e.name}`);}}
for(const dir of ['src','tests/unit'])await collect(dir);paths.push('studio/sanity.config.js','package.json','package-lock.json','next.config.ts','studio/package.json','studio/package-lock.json');
const binding={runtime:{model:'gpt-6.1-sol',provider:'openai-codex',evidence:'Runtime injection',downstream:null,fallback:null,cost:null,tokens:null,duration:null},files:[],changed:[],preserved:[]};
for(const path of paths.sort()){const current=await readFile(`${root}/${path}`);let before;try{before=await readFile(`${base}/${path}`)}catch{}const row={path,before:before?hash(before):null,after:hash(current)};binding.files.push(row);if(row.before!==row.after){binding.changed.push(path);await mkdir(`${qa}/snapshots`,{recursive:true});const key=path.replaceAll('/','__');await writeFile(`${qa}/snapshots/${key}.after.txt`,current);if(before)await writeFile(`${qa}/snapshots/${key}.before.txt`,before);}else binding.preserved.push(path);}
const assets=[];for(const path of ['public/assets/images/about','public/assets/decorative']){for(const name of await readdir(`${root}/${path}`,{withFileTypes:true})){if(!name.isFile())continue;const p=`${path}/${name.name}`,current=await readFile(`${root}/${p}`),before=await readFile(`${base}/${p}`);assets.push({path:p,sha256:hash(current),unchanged:hash(current)===hash(before)});}}
binding.assets=assets;
const browser=JSON.parse(await readFile(`${qa}/browser-results.json`,'utf8'));binding.browserBuilds=browser.builds;binding.fixtureSubstitutions=browser.substitutions;binding.caseCounts=Object.fromEntries([...new Set(browser.cases.map(c=>c.kind??c.name))].map(k=>[k,browser.cases.filter(c=>(c.kind??c.name)===k).length]));binding.comparisonCount=browser.comparisons.length;binding.comparisonsEqual=browser.comparisons.every(c=>c.domEqual&&c.pngEqual);binding.officialStudio={status:'blocked',error:browser.failure,clicks:browser.clicks.length};binding.fixtureSourceChecks=[];
for(const build of browser.builds){
 const expectedRoot=build.name==='before'?base:root,differences=[];
 for(const row of binding.files.filter(r=>r.path.startsWith('src/'))){
  let expected,actual;try{expected=await readFile(`${expectedRoot}/${row.path}`)}catch{continue}try{actual=await readFile(`${build.dir}/${row.path}`)}catch{throw Error(`Fixture missing ${row.path}`)}
  if(hash(expected)!==hash(actual))differences.push({path:row.path,expected:hash(expected),actual:hash(actual)});
 }
 const documented=browser.substitutions.filter(s=>s.name===build.name);
 if(differences.some(d=>!documented.some(s=>s.path===d.path&&s.before===d.expected&&s.after===d.actual)))throw Error(`Undocumented fixture difference ${build.name}`);
 binding.fixtureSourceChecks.push({name:build.name,buildId:build.id,differences,onlyDocumentedSubstitutions:true});
}
await writeFile(`${qa}/source-binding.json`,JSON.stringify(binding,null,2));console.log(JSON.stringify({changed:binding.changed,caseCounts:binding.caseCounts,comparisons:binding.comparisonCount,officialStudio:binding.officialStudio},null,2));
