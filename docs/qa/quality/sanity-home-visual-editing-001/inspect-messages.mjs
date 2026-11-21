import {readFile} from 'node:fs/promises';
const result=JSON.parse(await readFile('/workspace/docs/qa/quality/sanity-home-visual-editing-001/browser-results.json','utf8'));
const messages=result.clickFailure?.frameMessages??result.refreshDiagnostics?.frameMessages??[];
const counts=new Map();
for(const message of messages){const key=JSON.stringify(message);counts.set(key,(counts.get(key)??0)+1);}
console.log([...counts].map(([key,count])=>({...JSON.parse(key),count})));
console.log('LAST',messages.slice(-12));
