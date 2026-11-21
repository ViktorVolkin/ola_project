import {readFileSync} from 'node:fs';
const a = JSON.parse(readFileSync('/workspace/package-lock.json', 'utf8'));
const b = JSON.parse(readFileSync('package-lock.json', 'utf8'));
console.log('changed top keys', Object.keys(a).filter(k => k !== 'packages' && JSON.stringify(a[k]) !== JSON.stringify(b[k])));
console.log('changed packages', [...new Set([...Object.keys(a.packages), ...Object.keys(b.packages)])].filter(k => JSON.stringify(a.packages[k]) !== JSON.stringify(b.packages[k])));
