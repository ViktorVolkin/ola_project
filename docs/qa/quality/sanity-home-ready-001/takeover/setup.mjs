import {readdir,rename,readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const base='/workspace/docs/qa/quality/sanity-home-ready-001/takeover/before';
const rows=[];
async function walk(dir){for(const entry of await readdir(dir,{withFileTypes:true})){const path=`${dir}/${entry.name}`;if(entry.isDirectory())await walk(path);else {const dest=/\.(tsx?|css)$/.test(path)?`${path}.txt`:path;if(dest!==path)await rename(path,dest);const bytes=await readFile(dest);rows.push({path:dest,bytes:bytes.length,sha256:createHash('sha256').update(bytes).digest('hex')});}}}
await walk(base);await writeFile(`${base}/manifest.json`,JSON.stringify(rows,null,2));console.log(`Preserved ${rows.length} inert takeover snapshots`);
