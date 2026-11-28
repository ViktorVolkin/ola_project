import {describe, it, expect} from 'vitest';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import {execute, argumentsFor, planSync, assertMapping} from '../../scripts/content-sync.mjs';
import {inspectJSON, replaceTokens, placeholders} from '../../scripts/content-sync/json.mjs';
import {commit} from '../../scripts/content-sync/transaction.mjs';
import {approvalDifferences, approvalOutputStem} from '../../scripts/content-sync/approval.mjs';
import {pages, compare} from '../../scripts/content-diff/core.mjs';
import {createHash} from 'node:crypto';
// Test oracle only: already installed transitively; production adds no dependency.
import {IntlMessageFormat} from 'intl-messageformat';
const digest = (bytes: string | Buffer) => createHash('sha256').update(bytes).digest('hex');
async function freezeApproval(root:string, report:unknown) {
  const bytes = JSON.stringify(report);
  await fs.writeFile(path.join(root,'approved.json'),bytes);
  return {approvedReport:'approved.json',approvedSha256:digest(bytes)};
}
// Legacy positive execution tests explicitly approve their isolated dry-run.
// Negative tests call the real execute API, never bypassing its guard.
async function applyApproved(opts:ReturnType<typeof argumentsFor>, dep:{root:string,config:unknown,fetcher:unknown}) {
  const dry = await execute({...opts,dryRun:true},dep);
  expect(dry.blockers).toEqual([]);
  const approval = await freezeApproval(dep.root,dry);
  return execute({...opts,...approval},dep);
}

describe('Supervisor correction negative controls', () => {
  it('CONTENT-SYNC-R1 refuses actual six-page publication when ICU quoting loses an argument', async () => {
    const old = 'Hi {name}', replacement = "Hi '{name}'";
    expect(new IntlMessageFormat(old,'en').format({name:'Alice'})).toBe('Hi Alice');
    expect(new IntlMessageFormat(replacement,'en').format({name:'Alice'})).toBe('Hi {name}');
    await fixture(async root=>{
      await fs.writeFile(local(root,'bouquets'),JSON.stringify({title:'Old bouquet'}));
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      const docs = pages.map(p=>p==='contact'?doc(p,replacement):p==='bouquets'?doc(p,'Safe bouquet change'):{_id:`${p}Page`,_type:`${p}Page`});
      const result = await execute(options(true,null),{root,config:configFor(pages),fetcher:fetchDocs(docs)});
      console.info('ICU actual temp transaction',JSON.stringify({applied:result.applied,blockers:result.blockers,stored:JSON.parse(await fs.readFile(local(root),'utf8')).heroTitle}));
      expect(result.blockers.some(b=>/ICU|Interpolation/.test(b.reason))).toBe(true);
      expect(result.applied).toBe(false);
      // Verify the interpolation blocker itself forbids commit, independently of
      // the new approval requirement (so the latter cannot mask regression).
      const plan = await planSync(options(true,null),{root,config:configFor(pages),fetcher:fetchDocs(docs)});
      expect(plan.files).toHaveLength(1); // A safe sibling page still cannot publish.
      await expect(commit(root,plan)).rejects.toThrow('Plan has blockers');
      for (const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    },pages,JSON.stringify({heroTitle:old}));
  });
  it('refuses Unapproved B/r2 after frozen Approved A/r1 rather than renewing approval by count', async () => {
    await fixture(async root=>{
      const docs = (value:string,revision:string) => pages.map(p=>({...p==='contact'?doc(p,value):{_id:`${p}Page`,_type:`${p}Page`},_rev:revision}));
      const dep = {root,config:configFor(pages)};
      const dry = await execute(options(false,null),{...dep,fetcher:fetchDocs(docs('Approved A','r1'))});
      const approval = await freezeApproval(root,dry);
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      const result = await execute({...options(true,null),...approval},{...dep,fetcher:fetchDocs(docs('Unapproved B','r2'))});
      console.info('Approval actual temp transaction',JSON.stringify({applied:result.applied,blockers:result.blockers,stored:JSON.parse(await fs.readFile(local(root),'utf8')).heroTitle}));
      expect(result.applied).toBe(false);
      expect(result.blockers.some(b=>/Approval/.test(b.reason))).toBe(true);
      for (const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    },pages);
  });
});

const localized = (name:string) => ({name,type:'object',fields:['ru','en','sr'].map(name=>({name,type:'string'}))});
const configFor = (selected = ['contact']) => ({projectId:'test-project',dataset:'production',schema:{types:selected.map(page=>({name:`${page}Page`,fields:[localized(page==='bouquets'?'title':'heroTitle'),localized('heroBody')]}))}});
const doc = (page = 'contact', title:unknown = 'Новое') => ({_id:`${page}Page`,_type:`${page}Page`,_rev:'r1',[page==='bouquets'?'title':'heroTitle']:{ru:title}});
const options = (write = false, page:string | null = 'contact') => argumentsFor([...(page ? ['--page',page]:[]),...(write ? ['--write']:[])]);
async function fixture(action:(root:string)=>Promise<void>, selected = ['contact'], text = '{\r\n  "heroTitle": "Старое", "heroBody": "stay", "local": "stay"\r\n}\r\n') {
  const root = await fs.mkdtemp(path.join(os.tmpdir(),'ola-content-sync-'));
  try {
    for (const page of selected) for (const locale of ['ru','en','sr']) {
      const file = path.join(root,`src/i18n/messages/${page}/${locale}.json`);
      await fs.mkdir(path.dirname(file),{recursive:true}); await fs.writeFile(file,page==='bouquets'?text.replace('"heroTitle"','"title"'):text);
    }
    await fs.writeFile(path.join(root,'src/i18n/messages/ru.json'),'{}\n');
    if (selected.some(p=>['weddings','balloons'].includes(p))) {
      await fs.mkdir(path.join(root,'src/content'),{recursive:true});
      // Synthetic technical order declarations; no production dictionaries are copied.
      for (const page of ['weddings','balloons']) await fs.writeFile(path.join(root,`src/content/${page}.ts`),"const categoryIds = ['x']; const inspirationIds = ['x']; const favouriteIds = ['x']; const extraIds = ['x'];");
    }
    await action(root);
  } finally { await fs.rm(root,{recursive:true,force:true}); }
}
const local = (root:string,page = 'contact',locale = 'ru') => path.join(root,`src/i18n/messages/${page}/${locale}.json`);
const fetchDocs = (docs:unknown[]) => async () => ({ok:true,json:async()=>({result:docs})});

describe('content sync CLI / published read-only collection', () => {
  it('defaults to dry-run; validates all input before network', () => {
    expect(argumentsFor([])).toMatchObject({locale:'ru',dryRun:true,page:null});
    expect(argumentsFor(['--write'])).toMatchObject({dryRun:false});
    for (const args of [['--write','--dry-run'],['--locale','fr'],['--page','../home'],['--write','--write'],['--root','/'],['--locale'],['--dry-run','true']]) expect(()=>argumentsFor(args)).toThrow();
  });
  it('performs exactly one published GET for the selected six raw docs, without auth or mutations', async () => {
    await fixture(async root=>{
      const calls:unknown[] = [];
      const docs = pages.map(p=>({_id:`${p}Page`,_type:`${p}Page`}));
      const before = JSON.stringify(docs);
      const report = await execute(options(false,null),{root,config:configFor(pages),fetcher:async (url:URL,init:RequestInit)=>{
        calls.push(url.toString()); expect(init.method).toBe('GET'); expect(init.headers).toBeUndefined();
        expect(url.searchParams.get('perspective')).toBe('published');
        const query = url.searchParams.get('query')!;
        for (const p of pages) expect(query).toContain(`"${p}Page"`);
        expect(query).not.toMatch(/drafts|preview/);
        return {ok:true,json:async()=>({result:docs})};
      }});
      expect(calls).toHaveLength(1); expect(report.blockers).toEqual([]); expect(report.selection).toEqual(pages);
      expect(JSON.stringify(docs)).toBe(before); expect(report.applied).toBe(false);
    },pages);
  });
  it('plans exact old/new, writes only RU mapped strings, then becomes idempotent MATCH', async () => {
    await fixture(async root=>{
      const before = await fs.readFile(local(root),'utf8');
      const docs = [doc()]; const dep = {root,config:configFor(),fetcher:fetchDocs(docs)};
      const planned = await execute(options(),dep);
      expect(planned.blockers).toEqual([]); expect(planned.changes).toHaveLength(1);
      expect(planned.changes[0]).toMatchObject({old:'Старое',new:'Новое',localPath:'heroTitle'});
      expect(await fs.readFile(local(root),'utf8')).toBe(before);
      const written = await applyApproved(options(true),dep);
      expect(written.applied).toBe(true); expect(written.blockers).toEqual([]);
      expect(await fs.readFile(local(root),'utf8')).toBe(before.replace('Старое','Новое'));
      for (const locale of ['en','sr']) expect(await fs.readFile(local(root,'contact',locale),'utf8')).toBe(before);
      expect(await fs.readFile(path.join(root,'src/i18n/messages/ru.json'),'utf8')).toBe('{}\n');
      const second = await applyApproved(options(true),dep);
      expect(second.applied).toBe(true); expect(second.changes).toHaveLength(0); expect(second.totals.diff.MATCH).toBe(1);
      const after = JSON.parse(await fs.readFile(local(root),'utf8'));
      expect(compare('contact','ru',after,docs[0],['heroTitle','heroBody']).find(r=>r.localPath==='heroTitle')?.status).toBe('MATCH');
    });
  });
  it.each([undefined,null,'','   ',42,{},['x'], '<script>', 'x'.repeat(10001)])('does not erase local on empty/invalid raw CMS value %#', async value=>{
    await fixture(async root=>{
      const before = await fs.readFile(local(root));
      const dep = {root,config:configFor(),fetcher:fetchDocs([{...doc(),heroTitle:{ru:value}}])};
      // A nonempty string nested inside an unexpected array is UNMAPPED, not
      // an empty/invalid scalar to skip. Preserve that existing stricter rule.
      const report = Array.isArray(value) ? await execute(options(true),dep) : await applyApproved(options(true),dep);
      if (Array.isArray(value)) {
        expect(report.applied).toBe(false);
        expect(report.blockers.some(b=>b.reason==='Nonempty CMS text has no unambiguous string destination')).toBe(true);
      } else { expect(report.applied).toBe(true); expect(report.blockers).toEqual([]); }
      expect(report.changes).toHaveLength(0); expect(await fs.readFile(local(root))).toEqual(before);
    });
  });
  it('accepts partial docs without fallback; leaves absent fields and local-only strings untouched', async () => {
    await fixture(async root=>{
      const report = await applyApproved(options(true),{root,config:configFor(),fetcher:fetchDocs([doc()])});
      expect(report.applied).toBe(true);
      expect(JSON.parse(await fs.readFile(local(root),'utf8'))).toEqual({heroTitle:'Новое',heroBody:'stay',local:'stay'});
      expect(report.skipped.some((r:{status:string})=>r.status==='SANITY_EMPTY')).toBe(true);
    });
  });
  it.each(['missing','duplicate','draft','wrongtype','unknown','missinglocal','literalCMSkey','network','malformedresponse'])('blocks entire write for %s', async kind=>{
    await fixture(async root=>{
      const before = await fs.readFile(local(root));
      let docs:unknown[] = [doc()];
      if (kind==='missing') docs=[];
      if (kind==='duplicate') docs=[doc(),doc()];
      if (kind==='draft') docs=[{...doc(),_id:'drafts.contactPage'}];
      if (kind==='wrongtype') docs=[{...doc(),_type:'homePage'}];
      if (kind==='unknown') docs=[{...doc(),mystery:{ru:'unmapped'}}];
      if (kind==='missinglocal') docs=[{...doc(),heroAction:{ru:'orphan'}}];
      if (kind==='literalCMSkey') docs=[{...doc(),'heroTitle.ru':'unmapped'}];
      const config = configFor();
      if (kind==='missinglocal') config.schema.types[0].fields.push(localized('heroAction'));
      const fetcher = kind==='network' ? async()=>{throw Error('secret credential URL');} : kind==='malformedresponse' ? async()=>({ok:true,json:async()=>({result:null})}) : fetchDocs(docs);
      const report = await execute(options(true),{root,config,fetcher});
      expect(report.blockers.length).toBeGreaterThan(0); expect(report.applied).toBe(false);
      expect(await fs.readFile(local(root))).toEqual(before); expect(JSON.stringify(report)).not.toContain('secret');
    });
  });
  it.each(['{broken','{"heroTitle":"a","heroTitle":"b"}','{"__proto__":{"x":"v"}}','{"a.b":"literal","a":{"b":"nested"}}'])('rejects invalid/ambiguous local JSON before requesting CMS: %s', async text=>{
    await fixture(async root=>{
      let requests=0;
      const report = await execute(options(true),{root,config:configFor(),fetcher:async()=>{requests++; return {ok:true,json:async()=>({result:[doc()]})};}});
      expect(report.blockers.length).toBeGreaterThan(0); expect(requests).toBe(0);
      expect(await fs.readFile(local(root),'utf8')).toBe(text);
    },['contact'],text);
  });
  it('rejects duplicate/unsafe mapping and duplicate schema', async () => {
    for (const mapping of [{contact:{a:'same',b:'same'}},{contact:{'../../bad':'heroTitle'}},{contact:{a:'__proto__.x'}}]) expect(()=>assertMapping(mapping,['contact'])).toThrow();
    await fixture(async root=>{
      const config = configFor(); config.schema.types[0].fields.push(localized('heroTitle'));
      let requests=0;
      const result = await execute(options(true),{root,config,fetcher:async()=>{requests++;return {ok:true,json:async()=>({result:[doc()]})};}});
      expect(result.blockers.length).toBeGreaterThan(0); expect(requests).toBe(0);
    });
  });
  it('never updates deliberate LOCAL_ONLY home interpolation or asset/other-language strings', async () => {
    await fixture(async root=>{
      const config = {projectId:'test',dataset:'production',schema:{types:[{name:'homePage',fields:[]}]}};
      const result = await applyApproved(options(true,'home'),{root,config,fetcher:fetchDocs([{_id:'homePage',_type:'homePage',_rev:'r1',asset:{_ref:'asset-secret'},photo:{asset:{_ref:'photo'}},extra:{en:'other'}}])});
      expect(result.changes).toEqual([]); expect(result.blockers).toEqual([]);
      expect(result.skipped.find(r=>r.localPath==='viewMoodBouquet')?.status).toBe('LOCAL_ONLY');
    },['home'],'{"viewMoodBouquet":"View {mood}"}');
  });
});

describe('token editing and interpolation', () => {
  it('preserves BOM/CRLF/indentation/key order/duplicate values/nested arrays/Unicode/quotes exactly outside target tokens', async () => {
    const old = '\uFEFF{\r\n "content": {"story": {"paragraphs": ["same", "same"]}}, "other":"same"\r\n}\r\n';
    await fixture(async root=>{
      const config = {projectId:'test',dataset:'production',schema:{types:[{name:'aboutPage',fields:[{name:'story',type:'object',fields:[localized('paragraph1'),localized('paragraph2')]}]}]}};
      const value = '  Привет "мир"\nстрока 🌸  ';
      const document = {_id:'aboutPage',_type:'aboutPage',_rev:'r1',story:{paragraph2:{ru:value}}};
      const result = await applyApproved(options(true,'about'),{root,config,fetcher:fetchDocs([document])});
      expect(result.blockers).toEqual([]); expect(result.applied).toBe(true);
      expect(await fs.readFile(local(root,'about'),'utf8')).toBe(old.replace('["same", "same"]','["same", '+JSON.stringify(value)+']'));
    },['about'],old);
  });
  it('uses segment paths instead of confusing literal dots, and never searches by old string', () => {
    const text = '{"a.b":"old", "a":{"b":"different"}, "array":["old","old"]}';
    expect(()=>inspectJSON(text)).toThrow('Ambiguous');
    const safe = '{"a.b":"old", "array":["old","old"]}';
    expect(replaceTokens(safe,[{segments:['array','1'],old:'old',new:'new'}])).toBe('{"a.b":"old", "array":["old","new"]}');
    expect(()=>replaceTokens(safe,[{segments:['array','2'],old:'old',new:'new'}])).toThrow();
  });
  it.each(['Hello {other}','Hello {name} {name}','Hello','{count, plural, one {x} other {y}}','Hello {name'])('blocks changed or unsupported ICU contracts %s', async title=>{
    await fixture(async root=>{
      const before = await fs.readFile(local(root));
      const report = await execute(options(true),{root,config:configFor(),fetcher:fetchDocs([doc('contact',title)])});
      expect(report.blockers.some(b=>/ICU|Interpolation/.test(b.reason))).toBe(true); expect(report.applied).toBe(false); expect(await fs.readFile(local(root))).toEqual(before);
    },['contact'],'{"heroTitle":"Hi {name}"}');
  });
  it('preserves exact repeated named placeholders', async () => {
    expect(placeholders('{name}, {name}')).toEqual(['name','name']);
    await fixture(async root=>{
      const result = await applyApproved(options(true),{root,config:configFor(),fetcher:fetchDocs([doc('contact','Привет {name}, {name}')])});
      expect(result.applied).toBe(true); expect(result.blockers).toEqual([]);
    },['contact'],'{"heroTitle":"Hi {name} {name}"}');
  });
});

describe('ICU apostrophe safety', () => {
  it.each(["Hi '{name}'", "Hi '{name}", "Hi '}' {name}", "Hi '''{name}'''", "'{'name'}'"])('fails closed on quoted braces: %s', value=>{
    expect(()=>placeholders(value)).toThrow('Quoted ICU');
  });
  it.each([
    ["Don't forget {name}","Don't forget Alice"],
    ["L'amour, {name}","L'amour, Alice"],
    ["O'Brien: {name}","O'Brien: Alice"],
    ["Hi ''{name}''","Hi 'Alice'"],
    ["Hi ''''{name}''''","Hi ''Alice''"],
    ["Hi {name}'","Hi Alice'"],
  ])('retains actual substitutions with ordinary/doubled apostrophes: %s', (value,formatted)=>{
    expect(placeholders(value)).toEqual(['name']);
    expect(new IntlMessageFormat(value,'en').format({name:'Alice'})).toBe(formatted);
  });
  it('allows legitimate prose apostrophes and doubled apostrophes through a real temp application', async ()=>{
    await fixture(async root=>{
      const result = await applyApproved(options(true),{root,config:configFor(),fetcher:fetchDocs([doc('contact',"Don't forget ''{name}''")])});
      expect(result.applied).toBe(true);
      expect(JSON.parse(await fs.readFile(local(root),'utf8')).heroTitle).toBe("Don't forget ''{name}''");
    },['contact'],JSON.stringify({heroTitle:'Hi {name}'}));
  });
});

describe('pinned approved-report application guard', () => {
  const fullDocs = () => pages.map(p=>p==='contact' || p==='bouquets'?doc(p,'Approved A'):{_id:`${p}Page`,_type:`${p}Page`,_rev:'r1'});
  async function approvedFixture(action:(root:string, approval:Awaited<ReturnType<typeof freezeApproval>>, dry:Awaited<ReturnType<typeof execute>>)=>Promise<void>) {
    await fixture(async root=>{
      const dry = await execute(options(false,null),{root,config:configFor(pages),fetcher:fetchDocs(fullDocs())});
      expect(dry.blockers).toEqual([]); expect(dry.changes).toHaveLength(2);
      const approval = await freezeApproval(root,dry);
      await action(root,approval,dry);
    },pages);
  }
  it('parses explicit pinned approval flags, rejects incomplete/nonliteral hashes, and uses distinct output names', ()=>{
    const sha = 'a'.repeat(64);
    expect(argumentsFor(['--write','--approved-report','docs/approved.json','--approved-sha256',sha])).toMatchObject({approvedReport:'docs/approved.json',approvedSha256:sha});
    for (const args of [ ['--approved-report','a.json'], ['--approved-sha256',sha], ['--approved-report','a.json','--approved-sha256','A'.repeat(64)], ['--approved-report','a.json','--approved-sha256','0x'+sha], ['--approved-report','a.json','--approved-report','b.json'] ]) expect(()=>argumentsFor(args)).toThrow();
    expect(approvalOutputStem(options(true))).toBe('ru.application');
    expect(approvalOutputStem({...options(),approvedReport:'approved.json'})).toBe('ru.approval-check');
    expect(approvalOutputStem(options())).toBe('ru');
  });
  it('plain --write cannot apply even a fully valid cohort without explicit pinned approval', async ()=>{
    await approvedFixture(async(root)=>{
      const before = await fs.readFile(local(root));
      const result = await execute(options(true,null),{root,config:configFor(pages),fetcher:fetchDocs(fullDocs())});
      expect(result.applied).toBe(false); expect(result.blockers.some(b=>b.reason.startsWith('Approval required'))).toBe(true);
      expect(await fs.readFile(local(root))).toEqual(before);
    });
  });
  it('commits exactly the approved same captured six-page plan with ONE prospective fetch and immutable approval', async ()=>{
    await approvedFixture(async(root,approval)=>{
      const originalApproval = await fs.readFile(path.join(root,approval.approvedReport));
      const otherLocales = await Promise.all(pages.flatMap(p=>['en','sr'].map(l=>fs.readFile(local(root,p,l)))));
      let fetches=0;
      const result = await execute({...options(true,null),...approval},{root,config:configFor(pages),fetcher:async()=>{
        fetches++; return {ok:true,json:async()=>({result:fetches===1?fullDocs():fullDocs().map(d=>({...d,_rev:'UNAPPROVED'}))})};
      }});
      expect(fetches).toBe(1); expect(result.applied).toBe(true); expect(result.blockers).toEqual([]);
      expect(result.approval).toMatchObject({path:approval.approvedReport,sha256:approval.approvedSha256,matched:true,differences:[]});
      expect(await fs.readFile(path.join(root,approval.approvedReport))).toEqual(originalApproval);
      for(const p of ['contact','bouquets']) expect(JSON.parse(await fs.readFile(local(root,p),'utf8'))[p==='bouquets'?'title':'heroTitle']).toBe('Approved A');
      expect(await Promise.all(pages.flatMap(p=>['en','sr'].map(l=>fs.readFile(local(root,p,l)))))).toEqual(otherLocales);
    });
  });
  it('read-only approval reconciliation performs one fetch and never publishes', async ()=>{
    await approvedFixture(async(root,approval)=>{
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p)))); let fetches=0;
      const result = await execute({...options(false,null),...approval},{root,config:configFor(pages),fetcher:async()=>{fetches++;return {ok:true,json:async()=>({result:fullDocs()})};}});
      expect(fetches).toBe(1); expect(result.approval?.matched).toBe(true); expect(result.applied).toBe(false); expect(result.blockers).toEqual([]);
      for(const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    });
  });
  it.each(['locale','selection','old','new','segments','sanityPath','localPath','localFile','page','dictionaryHash','dictionarySet','mappingHash','docId','docType','revision','docHash','docSet','totals'])('refuses exact approval %s mismatch with zero dictionary changes', async kind=>{
    await approvedFixture(async(root,_approval,dry)=>{
      const forged = structuredClone(dry);
      if(kind==='locale') forged.locale='en';
      if(kind==='selection') forged.selection=['contact'];
      for(const key of ['old','new','sanityPath','localPath','localFile','page'] as const) if(kind===key) forged.changes[0][key]='unapproved';
      if(kind==='segments') forged.changes[0].segments=['different'];
      const file = Object.keys(forged.source.dictionaries)[0];
      if(kind==='dictionaryHash') forged.source.dictionaries[file]='0'.repeat(64);
      if(kind==='dictionarySet') delete forged.source.dictionaries[file];
      if(kind==='mappingHash') forged.source.mappingHash='0'.repeat(64);
      if(kind==='docId') forged.source.documents[0].id='otherPage';
      if(kind==='docType') forged.source.documents[0].type='otherPage';
      if(kind==='revision') forged.source.documents[0].revision='r2';
      if(kind==='docHash') forged.source.documents[0].sha256='0'.repeat(64);
      if(kind==='docSet') forged.source.documents.pop();
      if(kind==='totals') forged.totals.proposed++;
      // Even if an operator supplies a matching new file hash, semantic drift is
      // detected against the actual prospective plan; count equality is irrelevant.
      const approval = await freezeApproval(root,forged);
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      const result = await execute({...options(true,null),...approval},{root,config:configFor(pages),fetcher:fetchDocs(fullDocs())});
      expect(result.applied).toBe(false); expect(result.approval?.matched).toBe(false); expect(result.approval?.differences.length).toBeGreaterThan(0);
      for(const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    });
  });
  it.each(['value','revision-only','common','local','selection','locale','unmapped','empty','missing-revision'])('refuses prospective %s drift without partial publication', async kind=>{
    await approvedFixture(async(root,approval)=>{
      const docs = fullDocs(); const opts = {...options(true,null),...approval};
      if(kind==='value') docs[docs.findIndex(d=>d._id==='contactPage')]=doc('contact','Unapproved B');
      if(kind==='revision-only') docs[0]._rev='r2';
      if(kind==='common') await fs.writeFile(path.join(root,'src/i18n/messages/ru.json'),'{"owner":"edit"}');
      if(kind==='local') await fs.appendFile(local(root),' ');
      if(kind==='selection') opts.page='contact';
      if(kind==='locale') {opts.locale='en';await fs.writeFile(path.join(root,'src/i18n/messages/en.json'),'{}');}
      if(kind==='unmapped') docs[0]={...docs[0],unknown:{ru:'not mapped'}};
      if(kind==='empty') docs.splice(docs.findIndex(d=>d._id==='contactPage'),1,{...doc('contact',''),_rev:'r2'});
      if(kind==='missing-revision') docs[0]._rev='';
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      const result = await execute(opts,{root,config:configFor(pages),fetcher:fetchDocs(docs)});
      expect(result.applied).toBe(false); expect(result.approval?.matched).toBe(false);
      for(const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    });
  });
  it.each(['wrong-hash','invalid-hash','replacement','duplicate-properties','symlink','ancestor-symlink','hardlink','traversal','absolute','output-alias','not-dry-run'])('rejects approval %s BEFORE requesting CMS', async kind=>{
    await approvedFixture(async(root,approval,dry)=>{
      let fetches=0;
      if(kind==='wrong-hash') approval.approvedSha256='0'.repeat(64);
      if(kind==='invalid-hash') approval.approvedSha256='0x'+approval.approvedSha256;
      if(kind==='replacement') await fs.writeFile(path.join(root,'approved.json'),JSON.stringify({...dry,locale:'en'}));
      if(kind==='duplicate-properties') {
        const bytes = JSON.stringify(dry).replace('{','{"locale":"en",');
        await fs.writeFile(path.join(root,'approved.json'),bytes); approval.approvedSha256=digest(bytes);
      }
      if(kind==='not-dry-run') Object.assign(approval,await freezeApproval(root,{...dry,dryRun:false}));
      if(kind==='symlink') {await fs.rename(path.join(root,'approved.json'),path.join(root,'original.json'));await fs.symlink(path.join(root,'original.json'),path.join(root,'approved.json'));}
      if(kind==='ancestor-symlink') {await fs.mkdir(path.join(root,'real'));await fs.rename(path.join(root,'approved.json'),path.join(root,'real/approved.json'));await fs.symlink(path.join(root,'real'),path.join(root,'link'));approval.approvedReport='link/approved.json';}
      if(kind==='hardlink') await fs.link(path.join(root,'approved.json'),path.join(root,'linked.json'));
      if(kind==='traversal') approval.approvedReport='sub/../approved.json';
      if(kind==='absolute') approval.approvedReport=path.join(root,'approved.json');
      if(kind==='output-alias') {await fs.mkdir(path.join(root,'reports/content-sync'),{recursive:true});approval.approvedReport='reports/content-sync/ru.application.json';await fs.rename(path.join(root,'approved.json'),path.join(root,approval.approvedReport));}
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      await expect(execute({...options(true,null),...approval},{root,config:configFor(pages),fetcher:async()=>{fetches++;return {ok:true,json:async()=>({result:fullDocs()})};}})).rejects.toThrow(/Approval|approval/);
      expect(fetches).toBe(0);
      for(const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    });
  });
  it.each(['during-fetch','before-commit','before-second-rename'])('refuses approval replacement %s, with runtime rollback where needed', async kind=>{
    await approvedFixture(async(root,approval)=>{
      const target=path.join(root,approval.approvedReport), bytes=await fs.readFile(target);
      const replace = async()=>{await fs.rename(target,target+'.old');await fs.writeFile(target,bytes);};
      const before = await Promise.all(pages.map(p=>fs.readFile(local(root,p))));
      const result = await execute({...options(true,null),...approval},{root,config:configFor(pages),fetcher:async()=>{if(kind==='during-fetch') await replace();return {ok:true,json:async()=>({result:fullDocs()})};},hooks:{
        beforeCommit:async()=>{if(kind==='before-commit')await replace();},
        beforeRename:async(i:number)=>{if(kind==='before-second-rename' && i===1)await replace();},
      }});
      expect(result.applied).toBe(false); expect(result.blockers.length).toBeGreaterThan(0);
      for(const [i,p] of pages.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    });
  });
  it('comparison is key-order independent but never ignores exact segment arrays or argument values', async ()=>{
    await approvedFixture(async(_root,_approval,dry)=>{
      const reordered = JSON.parse(JSON.stringify(dry),(_k,v)=>v && !Array.isArray(v) && typeof v==='object'?Object.fromEntries(Object.entries(v).reverse()):v);
      expect(approvalDifferences(reordered,dry)).toEqual([]);
      reordered.changes[0].segments.reverse();
      // A flat path has one segment; actually change it rather than assume nesting.
      reordered.changes[0].segments.push('unexpected');
      expect(approvalDifferences(reordered,dry)).toContain('changes[0].segments.length');
    });
  });
});

describe('isolated multi-file transaction failure model', () => {
  const selected = ['bouquets','contact'];
  const deps = (root:string) => ({root,config:configFor(pages),fetcher:fetchDocs(selected.map(p=>doc(p)))});
  it('collects all requested documents before writing any valid-page changes when another page is absent', async ()=>{
    await fixture(async root=>{
      const before = await Promise.all(selected.map(p=>fs.readFile(local(root,p))));
      const result = await execute(options(true,null),deps(root));
      expect(result.applied).toBe(false); expect(result.blockers.some((b:{reason:string})=>b.reason==='Published singleton absent')).toBe(true);
      for (const [i,p] of selected.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
    },pages);
  });
  // Direct plan narrowing is not a public CLI option: create a complete six-page
  // synthetic set, whose valid changes live on the two flat-key page mappings.
  async function transactionFixture(action:(root:string,plan:Awaited<ReturnType<typeof planSync>>)=>Promise<void>) {
    await fixture(async root=>{
      const config = configFor(pages);
      const plan = await planSync(options(true,null),{root,config,fetcher:fetchDocs(pages.map(p=>selected.includes(p)?doc(p):{_id:`${p}Page`,_type:`${p}Page`}))});
      expect(plan.report.blockers).toEqual([]); expect(plan.files).toHaveLength(2);
      await action(root,plan);
    },pages);
  }
  it.each(['stage','commit'])('exercises actual %s failure and removes its own recovery state after successful rollback', async kind=>{
    await transactionFixture(async (root,plan)=>{
      const before = await Promise.all(selected.map(p=>fs.readFile(local(root,p))));
      await expect(commit(root,plan,kind==='stage'?{afterStage:(i:number)=>{if(i===1)throw Error('stage');}}:{beforeRename:(i:number)=>{if(i===1)throw Error('commit');}})).rejects.toThrow(kind);
      for (const [i,p] of selected.entries()) expect(await fs.readFile(local(root,p))).toEqual(before[i]);
      await expect(fs.stat(path.join(root,'reports/content-sync/.transaction'))).rejects.toThrow();
    });
  });
  it('aborts on stale planned local data before any change', async () => {
    await transactionFixture(async (root,plan)=>{
      const original = await fs.readFile(local(root,'bouquets'));
      await fs.writeFile(local(root),'owner data');
      await expect(commit(root,plan)).rejects.toThrow('stale');
      expect(await fs.readFile(local(root,'bouquets'))).toEqual(original); expect(await fs.readFile(local(root),'utf8')).toBe('owner data');
    });
  });
  it('checks all files again after staging, and preserves owner edits rather than replacing them', async () => {
    await transactionFixture(async (root,plan)=>{
      const original = await fs.readFile(local(root,'bouquets'));
      await expect(commit(root,plan,{beforeCommit:async()=>fs.writeFile(local(root),'owner data')})).rejects.toThrow('stale');
      expect(await fs.readFile(local(root,'bouquets'))).toEqual(original); expect(await fs.readFile(local(root),'utf8')).toBe('owner data');
    });
  });
  it('rolls back first file when a later concurrent edit is detected, without touching owner bytes', async () => {
    await transactionFixture(async (root,plan)=>{
      const original = await fs.readFile(local(root,'bouquets'));
      await expect(commit(root,plan,{beforeRename:async(i:number)=>{if(i===1)await fs.writeFile(local(root),'owner data');}})).rejects.toThrow('stale');
      expect(await fs.readFile(local(root,'bouquets'))).toEqual(original); expect(await fs.readFile(local(root),'utf8')).toBe('owner data');
    });
  });
  it('retains recovery originals and refuses further runs when rollback fails', async () => {
    await transactionFixture(async (root,plan)=>{
      const original = await fs.readFile(local(root,'bouquets'));
      await expect(commit(root,plan,{beforeRename:(i:number)=>{if(i===1)throw Error('commit');},beforeRollback:()=>{throw Error('rollback');}})).rejects.toThrow('Recovery required');
      const journal = path.join(root,'reports/content-sync/.transaction');
      expect(await fs.readFile(path.join(journal,'0.original'))).toEqual(original);
      const manifest = JSON.parse(await fs.readFile(path.join(journal,'manifest.json'),'utf8'));
      expect(manifest.crashAtomic).toBe(false);
      const result = await execute(options(true),{root,config:configFor(),fetcher:fetchDocs([doc()])});
      expect(result.applied).toBe(false); expect(result.blockers.length).toBeGreaterThan(0);
    });
  });
  it('never rolls back over an owner edit to an already-committed destination', async () => {
    await transactionFixture(async (root,plan)=>{
      await expect(commit(root,plan,{beforeRename:async(i:number)=>{if(i===1){await fs.writeFile(local(root,'bouquets'),'owner wins');throw Error('commit');}}})).rejects.toThrow('Recovery required');
      expect(await fs.readFile(local(root,'bouquets'),'utf8')).toBe('owner wins');
    });
  });
  it.each(['file','ancestor'])('refuses %s symlinks and leaves external bytes unchanged', async kind=>{
    await fixture(async root=>{
      const outside = path.join(root,'outside.json'); await fs.writeFile(outside,'{"heroTitle":"outside"}');
      if (kind==='file') {await fs.unlink(local(root));await fs.symlink(outside,local(root));}
      else {const dir=path.dirname(local(root));await fs.rename(dir,path.join(root,'old-contact'));await fs.symlink(path.join(root,'old-contact'),dir);}
      const result = await execute(options(true),{root,config:configFor(),fetcher:fetchDocs([doc()])});
      expect(result.blockers.length).toBeGreaterThan(0); expect(await fs.readFile(outside,'utf8')).toBe('{"heroTitle":"outside"}');
    });
  });
  it('commits and reads back both synthetic files; another cooperating transaction is excluded', async () => {
    await transactionFixture(async (root,plan)=>{
      await commit(root,plan,{beforeCommit:async()=>{await expect(commit(root,plan)).rejects.toThrow('Unresolved');}});
      for (const file of plan.files) expect(await fs.readFile(path.join(root,file.original.relative))).toEqual(file.bytes);
      for (const p of selected) for (const locale of ['en','sr']) expect((await fs.readFile(local(root,p,locale),'utf8'))).toContain('Старое');
    });
  });
  it('detects changes to code-owned order before committing dictionaries', async () => {
    await transactionFixture(async (root,plan)=>{
      await fs.appendFile(path.join(root,'src/content/weddings.ts'),'\n// owner edit');
      await expect(commit(root,plan)).rejects.toThrow('stale');
      for (const p of selected) expect(await fs.readFile(local(root,p),'utf8')).toContain('Старое');
    });
  });
  it('does not publish or clean up a modified stage owned by someone else', async () => {
    await transactionFixture(async (root,plan)=>{
      let changed = '';
      await expect(commit(root,plan,{afterStage:async(i:number)=>{
        if(i===0){const dir=path.dirname(local(root,'bouquets'));changed=path.join(dir,(await fs.readdir(dir)).find(n=>n.startsWith('.content-sync-'))!);await fs.writeFile(changed,'owner stage');}
      }})).rejects.toThrow('Recovery required');
      expect(await fs.readFile(changed,'utf8')).toBe('owner stage');
      for (const p of selected) expect(await fs.readFile(local(root,p),'utf8')).toContain('Старое');
    });
  });
  it('preserves unknown recovery entries instead of recursively deleting them', async () => {
    await transactionFixture(async (root,plan)=>{
      const unknown=path.join(root,'reports/content-sync/.transaction/owner-note');
      await expect(commit(root,plan,{beforeCommit:async()=>{await fs.writeFile(unknown,'keep');throw Error('cancel');}})).rejects.toThrow('Recovery required');
      expect(await fs.readFile(unknown,'utf8')).toBe('keep');
      for (const p of selected) expect(await fs.readFile(local(root,p),'utf8')).toContain('Старое');
    });
  });
  it('rejects hardlinked destinations and report-directory symlink escape', async () => {
    await fixture(async root=>{
      await fs.link(local(root),path.join(root,'hardlink.json'));
      const result=await execute(options(true),{root,config:configFor(),fetcher:fetchDocs([doc()])});
      expect(result.blockers.length).toBeGreaterThan(0);
    });
    await transactionFixture(async (root,plan)=>{
      await fs.mkdir(path.join(root,'elsewhere'));
      await fs.symlink(path.join(root,'elsewhere'),path.join(root,'reports'));
      await expect(commit(root,plan)).rejects.toThrow('Symlink');
      for (const p of selected) expect(await fs.readFile(local(root,p),'utf8')).toContain('Старое');
    });
  });
  it('refuses forged out-of-scope / duplicate destination plans', async () => {
    await transactionFixture(async (root,plan)=>{
      plan.files[0].original.relative='package.json';
      await expect(commit(root,plan)).rejects.toThrow('Unsafe');
    });
    await transactionFixture(async (root,plan)=>{
      plan.files.push(plan.files[0]); await expect(commit(root,plan)).rejects.toThrow('duplicate');
    });
  });
});
