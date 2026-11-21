import {readFile} from 'node:fs/promises';
const r=JSON.parse(await readFile('/workspace/docs/qa/quality/sanity-home-visual-editing-001/browser-results.json','utf8'));
console.log('clickFailure:', JSON.stringify(r.clickFailure, null, 2));
console.log('overlayWorkflow:', JSON.stringify(r.overlayWorkflow, null, 2));
const msgs = r.clickFailure?.frameMessages ?? [];
const fromOverlays = msgs.filter(m=>m.parent===false);
console.log('Messages from overlays:', fromOverlays.length);
fromOverlays.forEach(m=>console.log(' ', m.type, m.dataType||'', m.origin));
