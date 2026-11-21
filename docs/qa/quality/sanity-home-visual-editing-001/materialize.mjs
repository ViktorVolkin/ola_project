import {readFile,writeFile,mkdir,rename,rm} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {spawnSync} from 'node:child_process';
const root='/workspace', tmp=`${root}/.local-tools/ola-qa/visual-editing-install`;
const old=JSON.parse(await readFile(`${root}/package-lock.json`,'utf8'));
const next=JSON.parse(await readFile(`${tmp}/package-lock.json`,'utf8'));
const original=JSON.parse(await readFile(`${root}/docs/qa/quality/sanity-home-visual-editing-001/before/package-lock.json.txt`,'utf8'));
const additions=[];
for(const [path,pkg] of Object.entries(next.packages)){
 if(!path)continue;
 if(old.packages[path]){if(old.packages[path].version===pkg.version&&old.packages[path].integrity===pkg.integrity)continue;if(original.packages[path])throw Error(`Original dependency drift: ${path}`);}
 if(!pkg.resolved?.startsWith('https://registry.npmjs.org/')||!pkg.integrity?.startsWith('sha512-'))throw Error(`Untrusted package ${path}`);
 additions.push([path,pkg]);
}
for(const [path,pkg] of additions){
 const response=await fetch(pkg.resolved);if(!response.ok)throw Error(`Download failed ${path}`);
 const bytes=Buffer.from(await response.arrayBuffer());
 if(`sha512-${createHash('sha512').update(bytes).digest('base64')}`!==pkg.integrity)throw Error(`Integrity mismatch ${path}`);
 const archive=`${tmp}/package.tgz`,stage=`${tmp}/extract`;
 await writeFile(archive,bytes);await mkdir(stage,{recursive:true});
 const extraction=spawnSync('tar',['-xzf',archive,'--strip-components=1','-C',stage],{encoding:'utf8'});if(extraction.status!==0)throw Error(extraction.stderr);
 await mkdir(`${root}/${path.substring(0,path.lastIndexOf('/'))}`,{recursive:true});
 if(old.packages[path])await rm(`${root}/${path}`,{recursive:true});
 await rename(stage,`${root}/${path}`);
 console.log(`Materialized integrity-verified ${path}@${pkg.version}`);
}
await writeFile(`${root}/package.json`,await readFile(`${tmp}/package.json`));
await writeFile(`${root}/package-lock.json`,await readFile(`${tmp}/package-lock.json`));
await rm(`${tmp}/package.tgz`,{force:true});
await writeFile(`${root}/docs/qa/quality/sanity-home-visual-editing-001/dependency-additions-3.json`,JSON.stringify(additions.map(([path,pkg])=>({path,version:pkg.version,integrity:pkg.integrity})),null,2));
console.log(`Added ${additions.length} packages; existing lock entries unchanged. No pruning or lifecycle scripts.`);
