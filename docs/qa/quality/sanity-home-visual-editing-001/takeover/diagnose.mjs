import {readFile,writeFile} from 'node:fs/promises';
const qa='/workspace/docs/qa/quality/sanity-home-visual-editing-001/takeover';
const r=JSON.parse(await readFile(`${qa}/browser-results.json`,'utf8'));
const d=r.refreshDiagnostics;
console.log(JSON.stringify({workflow:r.overlayWorkflow,frameTypes:d?.frameMessages?.reduce((a,m)=>(a[m.type]=(a[m.type]??0)+1,a),{}),studioTypes:d?.studioMessages?.reduce((a,m)=>(a[m.type]=(a[m.type]??0)+1,a),{}),lastAction:r.lastMockAction,events:r.mockEvents,errors:r.studioConsole},null,2));
await writeFile(`${qa}/red-refresh-summary.json`,JSON.stringify({workflow:r.overlayWorkflow,frame:d?.frameMessages,studio:d?.studioMessages,lastAction:r.lastMockAction,errors:r.studioConsole},null,2));
