import {readFile,writeFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover',r=JSON.parse(await readFile(`${qa}/browser-results.json`,'utf8'));
const summary={failure:r.failure??null,editRefresh:r.overlayWorkflow.filter(x=>x.kind==='edit-refresh'),uniquePaths:[...new Set(r.overlayWorkflow.map(x=>x.path).filter(Boolean))].sort(),mobile:r.checks.filter(x=>x.kind==='mobile-source'),studioConsole:r.studioConsole,errors:r.errors,checks:r.checks.length};
await writeFile(`${qa}/browser-summary.json`,JSON.stringify(summary,null,2));console.log(JSON.stringify(summary,null,2));
