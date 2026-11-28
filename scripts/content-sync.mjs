import fs from 'node:fs/promises';
import path from 'node:path';
import {fileURLToPath, pathToFileURL} from 'node:url';
import {published} from './content-diff.mjs';
import {pages, compare, commonRecords, counts, schemaPaths, technicalIds, mappingSource} from './content-diff/core.mjs';
import {inspectJSON, placeholders, validText, replaceTokens} from './content-sync/json.mjs';
import {snapshot, unchanged, commit, noRecovery, reportDirectory, confined, hash} from './content-sync/transaction.mjs';
import {readApproval, approvalDifferences, approvalOutputStem, assertApprovalOutput} from './content-sync/approval.mjs';

/** @typedef {{page:string,localFile:string,localPath:string,sanityPath:string,segments:string[],old:string,new:string}} SyncChange */
/** @typedef {{page:string,localFile:string|null,localPath:string|null,sanityPath:string|null,status:string,reason:string}} SyncSkip */
/** @typedef {{reason:string,page?:string,localFile?:string|null,localPath?:string|null,sanityPath?:string|null}} SyncBlocker */

export function argumentsFor(args) {
  /** @type {{locale:string,page:string|null,dryRun:boolean,approvedReport:string|null,approvedSha256:string|null}} */
  const options = {locale:'ru',page:null,dryRun:true,approvedReport:null,approvedSha256:null};
  const seen = new Set();
  for (let i=0;i<args.length;i++) {
    const key = args[i];
    if (!['--locale','--page','--dry-run','--write','--approved-report','--approved-sha256'].includes(key) || seen.has(key)) throw Error('Invalid arguments');
    seen.add(key);
    if (['--write','--dry-run'].includes(key)) options.dryRun = key !== '--write';
    else {
      const value = args[++i];
      if (!value || value.startsWith('--')) throw Error('Missing argument');
      options[({'--approved-report':'approvedReport','--approved-sha256':'approvedSha256'})[key] || key.slice(2)] = value;
    }
  }
  if (seen.has('--write') && seen.has('--dry-run') || !['ru','en','sr'].includes(options.locale) || options.page !== null && !pages.includes(options.page)) throw Error('Invalid arguments');
  if (!!options.approvedReport !== !!options.approvedSha256 || options.approvedSha256 && !/^[a-f0-9]{64}$/.test(options.approvedSha256)) throw Error('Invalid approval arguments');
  return options;
}

export function assertMapping(mapping, selected) {
  const safe = p => typeof p==='string' && p.split('.').every(s=>s && !['__proto__','prototype','constructor'].includes(s) && !/[\\/]/.test(s));
  for (const page of selected) {
    if (!mapping[page] || typeof mapping[page] !== 'object') throw Error('Invalid mapping');
    const sources = new Set();
    for (const [local,cms] of Object.entries(mapping[page])) {
      if (!safe(local) || !safe(cms) || sources.has(cms)) throw Error('Ambiguous or unsafe mapping');
      sources.add(cms);
    }
  }
}

export async function planSync(options, dependencies = {}) {
  // Validate even programmatic callers before filesystem/network operations.
  argumentsFor(['--locale',options.locale,...(options.page ? ['--page',options.page] : [])]);
  const root = await fs.realpath(dependencies.root || process.cwd());
  const selected = options.page ? [options.page] : [...pages];
  const report = {version:1,locale:options.locale,selection:selected,perspective:'published',dryRun:options.dryRun !== false,applied:false,approval:/** @type {{path:string,sha256:string,matched:boolean,differences:string[]}|null} */ (null),changes:/** @type {SyncChange[]} */ ([]),skipped:/** @type {SyncSkip[]} */ ([]),blockers:/** @type {SyncBlocker[]} */ ([]),pages:{},totals:{proposed:0,files:0,skipped:0,blockers:0,diff:counts([])},source:{dictionaries:/** @type {Record<string,string>} */ ({}),documents:/** @type {{id:string,type:string,revision:string|null,sha256:string}[]} */ ([]),mappingHash:/** @type {string|null} */ (null)}};
  const guards = [], locals = new Map(), records = [], files = [];
  const block = (reason, details = {}) => report.blockers.push({reason,...details});
  try {
    await noRecovery(root);
    for (const page of selected) {
      const original = await snapshot(root,`src/i18n/messages/${page}/${options.locale}.json`);
      const text = new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(original.bytes);
      const parsed = inspectJSON(text);
      guards.push(original); locals.set(page,{original,text,parsed});
      report.source.dictionaries[original.relative] = original.sha256;
    }
    const common = await snapshot(root,`src/i18n/messages/${options.locale}.json`);
    guards.push(common);
    report.source.dictionaries[common.relative] = common.sha256;
    const shared = commonRecords(options.locale,inspectJSON(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(common.bytes)).value);
    records.push(...shared);
    report.skipped.push(...shared.map(r=>({page:r.page,localFile:r.localFile,localPath:r.localPath,sanityPath:null,status:r.status,reason:r.reason})));
    report.pages.common = {counts:counts(shared)};
    // Bind code-owned ordering as well as every dictionary before the request.
    const ids = {};
    for (const page of selected) {
      if (['weddings','balloons'].includes(page)) guards.push(await snapshot(root,`src/content/${page}.ts`));
      ids[page] = technicalIds(page,root);
    }
    const mappingFile = fileURLToPath(new URL('./content-diff/mapping.json',import.meta.url));
    const mappingBytes = await fs.readFile(mappingFile);
    if (!mappingBytes.equals(Buffer.from(mappingSource))) throw Error('Mapping changed since module load');
    assertMapping(inspectJSON(mappingSource).value,selected);
    // The shared compare module owns the sole mapping; this hash binds evidence only.
    report.source.mappingHash = hash(mappingBytes);
    if (path.resolve(root,'scripts/content-diff/mapping.json') === mappingFile) guards.push(await snapshot(root,'scripts/content-diff/mapping.json'));
    if (!dependencies.config) guards.push(await snapshot(root,'studio/sanity.config.js'));
    const config = dependencies.config || (await import('../studio/sanity.config.js')).default;
    const schemas = Object.fromEntries(selected.map(page=>[page,schemaPaths(config.schema.types.find(t=>t.name===`${page}Page`))]));
    for (const fields of Object.values(schemas)) if (new Set(fields).size!==fields.length || fields.some(p=>p.split('.').some(k=>!k || ['__proto__','prototype','constructor'].includes(k)))) throw Error('Ambiguous schema');
    const docs = await published(config,selected,dependencies.fetcher);
    // Duplicate, wrong-type, draft or unsolicited results cannot become a guessed singleton.
    const seen = new Set();
    for (const doc of docs) {
      if (!doc || !selected.some(p=>doc._id===`${p}Page` && doc._type===`${p}Page`) || seen.has(doc._id)) throw Error('Ambiguous published singleton result');
      function checkKeys(value) {
        if (!value || typeof value!=='object') return;
        for (const [key,child] of Object.entries(value)) {
          if (key.includes('.') || ['__proto__','prototype','constructor'].includes(key)) throw Error('Ambiguous published singleton result');
          checkKeys(child);
        }
      }
      checkKeys(doc);
      seen.add(doc._id);
    }
    for (const page of selected) if (!seen.has(`${page}Page`)) block('Published singleton absent',{page});
    report.source.documents = docs.map(doc=>({id:doc._id,type:doc._type,revision:doc._rev || null,sha256:hash(JSON.stringify(doc))}));
    const destinations = new Set(), sources = new Set();
    for (const page of selected) {
      const doc = docs.find(d=>d._id===`${page}Page`);
      if (!doc) continue;
      const {original,parsed,text} = locals.get(page);
      const result = compare(page,options.locale,parsed.value,doc,schemas[page],ids[page]);
      records.push(...result);
      report.pages[page] = {counts:counts(result)};
      const changes = [];
      for (const record of result) {
        const details = {page,localFile:record.localFile,localPath:record.localPath,sanityPath:record.sanityPath};
        if (record.localPath && record.sanityPath) {
          const target = `${record.localFile}:${record.localPath}`, source = `${page}:${record.sanityPath}`;
          if (destinations.has(target) || sources.has(source)) block('Ambiguous duplicate mapping',details);
          destinations.add(target); sources.add(source);
        }
        if (record.status === 'UNMAPPED' && typeof record.sanityValue === 'string' && record.sanityValue.trim()) {
          block('Nonempty CMS text has no unambiguous string destination',details);
        }
        if (record.status !== 'DIFFERENT') {
          report.skipped.push({...details,status:record.status,reason:record.reason || record.status}); continue;
        }
        if (!validText(record.sanityValue)) {
          report.skipped.push({...details,status:'INVALID_CMS',reason:'CMS string exceeds 10000 characters or contains angle brackets'}); continue;
        }
        if (record.localFile !== original.relative) { block('Unsafe mapped file',details); continue; }
        const segments = parsed.dotted.get(record.localPath);
        const token = segments && parsed.strings.get(JSON.stringify(segments));
        if (!token || token.value !== record.localValue) { block('Missing or non-string destination',details); continue; }
        try {
          if (JSON.stringify(placeholders(record.localValue)) !== JSON.stringify(placeholders(record.sanityValue))) throw Error('Interpolation names/counts differ');
        } catch (error) { block(error.message,details); continue; }
        const change = {...details,segments,old:record.localValue,new:record.sanityValue};
        changes.push(change); report.changes.push(change);
      }
      if (changes.length) files.push({original,bytes:Buffer.from(replaceTokens(text,changes),'utf8')});
    }
    await unchanged(root,guards);
    if (hash(await fs.readFile(mappingFile))!==report.source.mappingHash) throw Error('Mapping changed during planning');
  } catch (error) {
    // Do not persist remote exception contents (request URLs, credentials, etc.).
    const safe = ['network','config','Ambiguous published singleton result','Duplicate JSON key','Protected JSON key','Ambiguous dotted JSON path'];
    block(safe.includes(error.message) ? error.message : 'Local/configuration/JSON validation or stale-input failure');
  }
  for (const page of [...selected,'common']) report.pages[page] = {...report.pages[page],proposed:report.changes.filter(c=>c.page===page).length,skipped:report.skipped.filter(c=>c.page===page).length,blockers:report.blockers.filter(c=>c.page===page).length};
  report.totals = {proposed:report.changes.length,files:files.length,skipped:report.skipped.length,blockers:report.blockers.length,diff:counts(records)};
  return {root,report,guards,files};
}
export async function execute(options, dependencies = {}) {
  // Read/hash/strict-parse approval BEFORE fetching prospective CMS content.
  const root = await fs.realpath(dependencies.root || process.cwd());
  const approval = options.approvedReport || options.approvedSha256 ? await readApproval(root,options) : null;
  if (approval) assertApprovalOutput(root,approval.original,options);
  const plan = await planSync(options,dependencies);
  if (approval) {
    const differences = approvalDifferences(approval.report,plan.report);
    plan.report.approval = {path:approval.path,sha256:approval.sha256,matched:!differences.length,differences};
    if (differences.length) plan.report.blockers.push({reason:'Approval mismatch: '+differences.join(', ')});
    // The same pinned file must survive every existing transaction guard check.
    plan.guards.push(approval.original);
    try { await unchanged(root,[approval.original]); }
    catch { plan.report.blockers.push({reason:'Approval file changed during planning'}); plan.report.approval.matched=false; }
  } else if (!plan.report.dryRun) plan.report.blockers.push({reason:'Approval required: supply --approved-report and --approved-sha256'});
  plan.report.totals.blockers=plan.report.blockers.length;
  if (!plan.report.dryRun && !plan.report.blockers.length) {
    // Commit THIS captured plan. No hidden second fetch or replan.
    try { await commit(plan.root,plan,dependencies.hooks); plan.report.applied=true; }
    catch (error) {
      plan.report.blockers.push({reason:error.message.startsWith('Recovery required') ? error.message : 'Commit/preflight failed; owned changes rolled back where safe; inspect transaction state'});
      plan.report.totals.blockers=plan.report.blockers.length;
    }
  }
  return plan.report;
}
export async function main(args) {
  let options;
  try { options = argumentsFor(args); }
  catch { console.error('Use content:sync -- --locale ru|en|sr [--page home|about|weddings|balloons|bouquets|contact] [--dry-run | --write] [--approved-report relative/path.json --approved-sha256 64-lowercase-hex]. Write requires pinned approval. Default: dry-run.'); return 2; }
  let report;
  try { report = await execute(options); }
  catch (error) { console.error(error.message); return 1; }
  try {
    const dir = await reportDirectory(process.cwd());
    const stem = approvalOutputStem(options);
    // Existing report files must also be regular, confined files.
    for (const ext of ['json','txt']) {
      const relative = `reports/content-sync/${stem}.${ext}`;
      try { await confined(process.cwd(),relative); } catch (error) { if (error.code!=='ENOENT') throw error; }
    }
    await fs.writeFile(path.join(dir,`${stem}.json`),JSON.stringify(report,null,2)+'\n');
    const lines = [`OLA CONTENT SYNC ${options.locale}: dryRun=${report.dryRun} applied=${report.applied}`,JSON.stringify(report.totals),...(report.approval ? ['APPROVAL '+JSON.stringify(report.approval)] : []),...report.changes.map(c=>`${c.localFile} :: ${c.localPath} <- ${c.sanityPath}\nOLD ${JSON.stringify(c.old)}\nNEW ${JSON.stringify(c.new)}`),...report.blockers.map(b=>'BLOCKER '+JSON.stringify(b))];
    await fs.writeFile(path.join(dir,`${stem}.txt`),lines.join('\n\n')+'\n');
    console.log(lines.join('\n\n'));
    console.log(`Full report: reports/content-sync/${stem}.json; reports/content-sync/${stem}.txt`);
  } catch { console.error('Report output failed'); return 1; }
  return report.blockers.length ? 1 : 0;
}
if (process.argv[1] && import.meta.url===pathToFileURL(process.argv[1]).href) process.exitCode=await main(process.argv.slice(2));
