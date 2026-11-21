import {readFile} from 'node:fs/promises';
const r=JSON.parse(await readFile(process.argv[2],'utf8'));
const msgs=r.refreshDiagnostics.frameMessages;
const fromOverlays=msgs.filter(m=>m.parent===false);
console.log('Messages from overlays to presentation:', fromOverlays.length);
fromOverlays.forEach(m=>console.log(m.type, m.dataType||'', m.origin));
const overlaysFocus=msgs.filter(m=>m.type==='overlay/focus');
console.log('overlay/focus count:', overlaysFocus.length);
