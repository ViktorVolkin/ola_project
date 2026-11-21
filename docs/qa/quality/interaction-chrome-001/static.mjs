import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import postcss from 'postcss';
const files=['src/components/shared/ActionLink.module.css','src/components/widgets/Header/Header.module.css','src/components/widgets/Footer/Footer.module.css','src/components/widgets/LanguageSwitcher/LanguageSwitcher.module.css','src/components/widgets/Wordmark/Wordmark.module.css'];
const sha=b=>crypto.createHash('sha256').update(b).digest('hex');let errors=[];const hashes=[];
for(const file of files){const data=fs.readFileSync(file);const before=fs.readFileSync('docs/qa/quality/interaction-chrome-001/before/'+path.basename(file)+'.txt');const root=postcss.parse(data,{from:file});let transitions=0,hover=0,active=0;
 root.walkDecls(d=>{if(d.prop==='transition'){transitions++;if(/(^|[,\s])all([,\s]|$)/.test(d.value))errors.push(file+': transition all');let p=d.parent,ok=false;while(p){if(p.type==='atrule'&&p.name==='media'&&p.params.includes('prefers-reduced-motion: no-preference'))ok=true;p=p.parent;}if(!ok)errors.push(file+': unguarded transition');}});
 root.walkRules(r=>{if(r.selector.includes(':hover')){hover++;let p=r.parent,ok=false;while(p){if(p.type==='atrule'&&p.name==='media'&&p.params.includes('hover: hover'))ok=true;p=p.parent;}if(!ok)errors.push(file+': unguarded hover '+r.selector);}if(r.selector.includes(':active'))active++;});
 if(!transitions||!hover||!active)errors.push(file+': missing transition/hover/active');hashes.push({path:file,before_snapshot:'before/'+path.basename(file)+'.txt',before_sha256:sha(before),after_sha256:sha(data),transitions,hover_rules:hover,active_rules:active});}
const inv=JSON.parse(fs.readFileSync('docs/qa/quality/interaction-chrome-001/inventory.json'));if(inv.summary.unclassified_count)errors.push('unclassified inventory sites');
const required={
 'src/components/shared/ActionLink.module.css':['.action:focus-visible','outline: 2px solid var(--color-wine)','.light:focus-visible','.action:disabled','.primary:not(:disabled):not([aria-disabled="true"]):active','.text:not(:disabled):not([aria-disabled="true"]):active'],
 'src/components/widgets/Header/Header.module.css':['.desktopNav a[aria-current="page"]','.menuButton:not(:disabled):active','.panelClose:not(:disabled):active','.panel nav a:active','transform: translate(-50%, -50%)'],
 'src/components/widgets/Footer/Footer.module.css':['.explore a:active','.studio nav a:active'],
 'src/components/widgets/LanguageSwitcher/LanguageSwitcher.module.css':['.list a[aria-current]','.trigger:not(:disabled):hover','.trigger:not(:disabled):active'],
 'src/components/widgets/Wordmark/Wordmark.module.css':['.wordmark:hover','.wordmark:active']
};
for(const [file,tokens] of Object.entries(required)){const text=fs.readFileSync(file,'utf8');for(const token of tokens)if(!text.includes(token))errors.push(file+': missing expected token '+token);}
const global=fs.readFileSync('src/styles/Application.module.css','utf8');for(const token of ['[tabindex]):focus-visible','.skipLink:focus { transform: translateY(0); }'])if(!global.includes(token))errors.push('global focus cue missing: '+token);
fs.writeFileSync('docs/qa/quality/interaction-chrome-001/hashes.json',JSON.stringify(hashes,null,2)+'\n');console.log(JSON.stringify({files:hashes,inventory:inv.summary,errors},null,2));if(errors.length)process.exitCode=1;
