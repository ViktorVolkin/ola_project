import fs from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {pages, statuses, schemaPaths, technicalIds, compare, commonRecords, counts, csv} from './content-diff/core.mjs';

export function argumentsFor(args) {
  const options = {locale:'ru',page:null,format:'human'};
  const seen = new Set();
  for (let i=0;i<args.length;i++) {
    const k = args[i];
    if (!['--locale','--page','--format'].includes(k) || seen.has(k) || !args[i+1] || args[i+1].startsWith('--')) throw Error('Invalid arguments');
    seen.add(k); options[k.slice(2)] = args[++i];
  }
  if (!['ru','en','sr'].includes(options.locale) || (options.page && !pages.includes(options.page)) || !['human','json'].includes(options.format)) throw Error('Invalid arguments');
  return options;
}
export async function published(config, selected, fetcher = fetch) {
  if (!/^[a-z0-9-]+$/.test(config.projectId || '') || !/^[a-z0-9_-]+$/.test(config.dataset || '')) throw Error('config');
  const query = `*[(_id in [${selected.map(p => `"${p}Page"`).join(',')}]) && _type in [${selected.map(p => `"${p}Page"`).join(',')}]]`;
  const url = new URL(`https://${config.projectId}.api.sanity.io/v2025-02-19/data/query/${config.dataset}`);
  url.searchParams.set('perspective','published'); url.searchParams.set('query',query);
  let response;
  try { response = await fetcher(url, {method:'GET', signal:AbortSignal.timeout(5000)}); } catch { throw Error('network'); }
  if (!response.ok) throw Error('network');
  let body;
  try { body = await response.json(); } catch { throw Error('network'); }
  if (!Array.isArray(body.result)) throw Error('network');
  return body.result;
}
export async function run(options, dependencies = {}) {
  const selected = options.page ? [options.page] : pages;
  const errors = [], records = [], metadata = {};
  let config, schemas;
  try {
    config = dependencies.config || (await import('../studio/sanity.config.js')).default;
    schemas = Object.fromEntries(selected.map(p => [p,schemaPaths(config.schema.types.find(t => t.name === `${p}Page`))]));
  } catch { errors.push({kind:'config',message:'Studio configuration or schema could not be loaded'}); }
  let docs;
  if (!errors.length) try { docs = await published(config,selected,dependencies.fetcher); } catch (error) { errors.push({kind:error.message === 'config'?'config':'network',message:error.message === 'config'?'Invalid public project configuration':'Published content request failed'}); }
  for (const page of selected) {
    if (!docs) {
      let unmappedSchema = [];
      if (schemas?.[page]) try {
        const local = JSON.parse(await fs.readFile(`src/i18n/messages/${page}/${options.locale}.json`,'utf8'));
        unmappedSchema = compare(page,options.locale,local,{},schemas[page],technicalIds(page)).filter(r => r.localPath === null && r.reason === 'Schema text field has no established local correspondence').map(r => r.sanityPath);
      } catch { errors.push({page,kind:'local_or_mapping',message:'Schema coverage could not be established'}); }
      metadata[page] = {complete:false,schemaTextFields:schemas?.[page]?.length ?? null,unmappedSchema}; continue;
    }
    const doc = docs.find(x => x && x._id === `${page}Page` && x._type === `${page}Page`);
    if (!doc) {
      errors.push({page,kind:'absent_document',message:'Published singleton is absent'});
      let unmappedSchema = [];
      try {
        const local = JSON.parse(await fs.readFile(`src/i18n/messages/${page}/${options.locale}.json`,'utf8'));
        unmappedSchema = compare(page,options.locale,local,{},schemas[page],technicalIds(page)).filter(r => r.localPath === null && r.reason === 'Schema text field has no established local correspondence').map(r => r.sanityPath);
      } catch { errors.push({page,kind:'local_or_mapping',message:'Schema coverage could not be established'}); }
      metadata[page] = {complete:false,schemaTextFields:schemas[page].length,unmappedSchema}; continue;
    }
    try {
      const local = JSON.parse(await fs.readFile(`src/i18n/messages/${page}/${options.locale}.json`,'utf8'));
      const result = compare(page,options.locale,local,doc,schemas[page],technicalIds(page));
      records.push(...result);
      metadata[page] = {complete:true,schemaTextFields:schemas[page].length,mappedTextFields:result.filter(r=>r.localPath && r.sanityPath).length,counts:counts(result)};
    } catch { errors.push({page,kind:'local_or_mapping',message:'Local dictionary or mapping could not be read'}); metadata[page]={complete:false,schemaTextFields:schemas[page].length}; }
  }
  try { records.push(...commonRecords(options.locale,JSON.parse(await fs.readFile(`src/i18n/messages/${options.locale}.json`,'utf8')))); }
  catch { errors.push({page:'common',kind:'local',message:'Common dictionary could not be read'}); }
  metadata.common = {complete:!errors.some(e=>e.page==='common'),counts:counts(records.filter(r=>r.page==='common'))};
  return {metadata:{locale:options.locale,selection:selected,perspective:'published',incomplete:errors.length>0},pages:metadata,errors,records,totals:counts(records)};
}
export async function main(args) {
  let options;
  try { options = argumentsFor(args); } catch { console.error('Invalid arguments. Use --locale ru|en|sr --page home|about|weddings|balloons|bouquets|contact --format json'); return 2; }
  const report = await run(options);
  try {
    await fs.mkdir('reports/content-diff',{recursive:true});
    await fs.writeFile(`reports/content-diff/${options.locale}.json`,JSON.stringify(report,null,2)+'\n');
    await fs.writeFile(`reports/content-diff/${options.locale}.csv`,csv(report.records.map(r => ({...r,locale:options.locale,selection:report.metadata.selection.join('|'),incomplete:report.metadata.incomplete}))));
  } catch { console.error('Report output failed'); return 1; }
  if (options.format === 'json') console.log(JSON.stringify(report));
  else {
    console.log(`OLA CONTENT DIFF — ${options.locale.toUpperCase()}`);
    for (const [page,details] of Object.entries(report.pages)) console.log(`${page}: ${details.counts ? statuses.map(s=>`${s}=${details.counts[s]}`).join(' ') : 'INCOMPLETE'}`);
    console.log(`TOTAL: ${statuses.map(s=>`${s}=${report.totals[s]}`).join(' ')}`);
    for (const e of report.errors) console.log(`ERROR ${e.page || 'global'}: ${e.kind} — ${e.message}`);
  }
  return report.metadata.incomplete ? 1 : 0;
}
if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) process.exitCode = await main(process.argv.slice(2));
