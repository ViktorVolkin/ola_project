import {describe, it, expect} from 'vitest';
import {compare, commonRecords, csv, schemaPaths, technicalIds} from '../../scripts/content-diff/core.mjs';
import {argumentsFor, published, run} from '../../scripts/content-diff.mjs';

describe('raw diagnostics', () => {
  it('preserves exact values, distinguishes empties and enumerates unknown paths', () => {
    const local = {content:{hero:{title:'a\nb',body:'local',handwritten:'x'},story:{paragraphs:['one']}}};
    const doc = {hero:{title:{ru:'a b'},body:{ru:'  '},handwritten:{ru:null}},story:{paragraph1:{ru:'one'}},extra:{ru:'text'},asset:{_ref:'asset-hash'}};
    const before = JSON.stringify([local,doc]);
    const schema = ['hero.title','hero.body','hero.handwritten','story.paragraph1','unknown'];
    const r = compare('about','ru',local,doc,schema,{});
    const at = (p: string) => r.find((x: {sanityPath:string | null}) => x.sanityPath === p);
    expect(at('hero.title.ru')).toMatchObject({status:'DIFFERENT',localValue:'a\nb',sanityValue:'a b'});
    expect(at('hero.body.ru')).toMatchObject({status:'SANITY_EMPTY',sanityValue:'  ',sanityPresent:true});
    expect(at('hero.handwritten.ru')).toMatchObject({status:'SANITY_EMPTY',sanityValue:null,sanityPresent:true});
    expect(at('story.paragraph1.ru')).toMatchObject({status:'MATCH',provenance:'index-based fixed schema slot'});
    expect(at('unknown.ru')).toMatchObject({status:'UNMAPPED',sanityPresent:false});
    expect(at('extra.ru')).toMatchObject({status:'UNMAPPED',sanityValue:'text'});
    expect(JSON.stringify(r)).not.toContain('asset-hash'); expect(JSON.stringify([local,doc])).toBe(before);
    expect(compare('about','ru',local,{},schema,{}).find((x:{sanityPath:string | null})=>x.sanityPath==='hero.title.ru')).toMatchObject({status:'SANITY_EMPTY',sanityPresent:false,sanityValue:null});
  });
  it('uses technical IDs and diagnoses malformed values', () => {
    const r = compare('weddings','ru',{content:{categories:[{title:'one'}],process:{steps:[{title:'step'}]}}},{categories:{weddings:{title:{ru:42}}},process:{step1:{title:{ru:'step'}}}},['categories.weddings.title','process.step1.title'],technicalIds('weddings'));
    expect(r[0]).toMatchObject({status:'UNMAPPED',sanityValue:42,provenance:'technical ID weddings from weddings.ts order'});
    expect(r[1]).toMatchObject({status:'MATCH',provenance:'index-based fixed schema slot'});
  });
  it('reports shared and deliberately local-only text', () => {
    expect(commonRecords('ru',{key:'value'})[0].status).toBe('LOCAL_ONLY');
    expect(compare('home','ru',{viewMoodBouquet:'x'}, {},[],{})[0].status).toBe('LOCAL_ONLY');
  });
  it('enumerates schema without a document and rejects unsupported types', () => {
    expect(schemaPaths({fields:[{name:'hero',type:'object',fields:[{name:'title',type:'object',fields:['en','ru','sr'].map(name=>({name,type:'string'}))}]}]})).toEqual(['hero.title']);
    expect(()=>schemaPaths({fields:[{name:'new',type:'array'}]})).toThrow();
  });
  it('roundtrips CSV commas, quotes, Unicode and newlines', () => {
    const value = 'Привет, "мир"\nстрока';
    const output = csv([{page:'home',localValue:value}]);
    const parsed = output.match(/"(?:[^"]|"")*"/g)!.map((s:string)=>s.slice(1,-1).replaceAll('""','"'));
    expect(parsed).toContain(value);
  });
});
describe('boundary', () => {
  it('validates arguments', () => {
    expect(argumentsFor(['--page','home','--locale','en','--format','json'])).toMatchObject({page:'home',locale:'en',format:'json'});
    for (const a of [['--locale','fr'],['--page','x'],['--page'],['--format','xml'],['--locale','ru','--locale','ru']]) expect(()=>argumentsFor(a)).toThrow();
  });
  it('uses published GET only', async () => {
    let captured = '';
    await published({projectId:'public-project',dataset:'production'},['home'],(async (url:URL,init:RequestInit)=>{captured=url.toString(); expect(init.method).toBe('GET'); return {ok:true,json:async()=>({result:[]})};}) as typeof fetch);
    expect(captured).toContain('perspective=published'); expect(decodeURIComponent(captured)).toContain('homePage'); expect(captured).not.toContain('drafts');
  });
  it('distinguishes singleton, network, config and missing field errors', async () => {
    const opts = {locale:'ru',page:'home',format:'json'};
    const config = {projectId:'public-project',dataset:'production',schema:{types:[{name:'homePage',fields:[{name:'unknown',type:'object',fields:['en','ru','sr'].map(name=>({name,type:'string'}))}]}]}};
    const absent = await run(opts,{config,fetcher:async()=>({ok:true,json:async()=>({result:[]})})});
    expect(absent.errors[0].kind).toBe('absent_document'); expect(absent.records.filter((r:{page:string})=>r.page==='home')).toEqual([]); expect((absent.pages as unknown as Record<string, {unmappedSchema?: string[]}>).home.unmappedSchema).toEqual(['unknown.ru']);
    const failed = await run(opts,{config,fetcher:async()=>{throw Error('secret URL token');}});
    expect(failed.errors[0].kind).toBe('network'); expect(JSON.stringify(failed)).not.toContain('secret'); expect(failed.metadata.incomplete).toBe(true);
    expect((await run(opts,{config:{}})).errors[0].kind).toBe('config');
  });
});
