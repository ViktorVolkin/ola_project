import {readFile,writeFile} from 'node:fs/promises';
const base='/workspace/docs/qa/quality/sanity-home-visual-editing-001';
let source=await readFile(`${base}/build.mjs`,'utf8');
source=source.replace('qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001`','qa=`${root}/docs/qa/quality/sanity-home-visual-editing-001/takeover`');
// Existing task-private fixtures, source copied afresh; no root .next or port3100.
await writeFile(`${base}/takeover/build-execute.mjs`,source);
await import('./build-execute.mjs');
