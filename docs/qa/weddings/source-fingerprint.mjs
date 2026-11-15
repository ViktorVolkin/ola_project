import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve, relative} from 'node:path';
const files = [];
for (const root of ['src','tests']) {
  const entries = await readdir(root, {recursive:true,withFileTypes:true});
  files.push(...entries.filter(item => item.isFile()).map(item => resolve(item.parentPath,item.name)));
}
files.push(...['package.json','package-lock.json','next.config.ts','tsconfig.json','eslint.config.mjs','playwright.config.ts','vitest.config.mts'].map(file => resolve(file)));
files.sort();
const hash = createHash('sha256');
for (const file of files) hash.update(relative(process.cwd(),file)).update(await readFile(file));
console.log(JSON.stringify({scope:'src + tests + project manifests/config (no secrets or generated files)',files:files.length,sha256:hash.digest('hex')},null,2));
