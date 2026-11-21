import fs from 'node:fs';
import path from 'node:path';
import {root} from '../../../../../scripts/qa/local.mjs';
const dir=path.join(root,'docs/qa/quality/interaction-chrome-001/header-refinement');
const source=JSON.parse(fs.readFileSync(path.join(dir,'additional-proof.json')));
const probe=JSON.parse(fs.readFileSync(path.join(dir,'finite-results-full.json'))).checks[2].detail.syntheticProbe;
const parse=s=>s.match(/[\d.]+/g).map(Number).slice(0,3);
const l=rgb=>{const c=rgb.map(n=>{const v=n/255;return v<=0.04045?v/12.92:((v+0.055)/1.055)**2.4;});return .2126*c[0]+.7152*c[1]+.0722*c[2];};
const contrast=(a,b)=>{const x=l(parse(a)),y=l(parse(b));return (Math.max(x,y)+.05)/(Math.min(x,y)+.05);};
const cases=[];
for(const variant of ['primary','secondary'])for(const state of ['hover','active']){const v=source.actionStates[`${variant}-enabled`][state];cases.push({variant,state,color:v.color,background:v.bg,contrast:contrast(v.color,v.bg),origin:'real app'});}
for(const state of ['normal','hover','active']){const v=probe[state];cases.push({variant:'light',state,color:v.color,background:v.bg,contrast:contrast(v.color,v.bg),origin:'synthetic CSS probe'});}
fs.writeFileSync(path.join(dir,'finite-color-ratios.json'),JSON.stringify({algorithm:'WCAG sRGB relative luminance, opaque computed colors',cases},null,2)+'\n');
console.log(JSON.stringify(cases,null,2));
