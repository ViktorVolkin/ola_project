import path from 'node:path';
import {inventory} from './suite-inventory.mjs';

export const families = Object.freeze(['product','gallery','detail-page','migration','action-button']);
export function selection(argv) {
  const args = [...argv], mode = args.shift(), options = {};
  while (args.length) {
    const key = args.shift();
    if (['--list','--dry-run'].includes(key)) { options[key] = true; continue; }
    if (!['--file','--project','--grep'].includes(key) || !args.length || Object.hasOwn(options,key)) throw new Error(`Invalid argument ${key}`);
    options[key] = args.shift();
  }
  if (!['inventory','full','smoke',...families].includes(mode)) throw new Error('Use full, smoke, product, gallery, detail-page, migration, action-button, or inventory');
  if (mode === 'full' && ['--file','--project','--grep'].some(key => Object.hasOwn(options,key))) throw new Error('full does not accept filters: use a named family instead');
  const selected = mode === 'full' ? [...families] : [mode === 'smoke' ? 'product' : mode];
  if (options['--file']) {
    const entry = inventory[options['--file']];
    if (!entry || !selected.includes(entry.family)) throw new Error('File must be an exact inventory path belonging to selected family');
    if (options['--project'] && !entry.projects.includes(options['--project'])) throw new Error('Project is not configured for file');
  }
  if (mode === 'smoke') {
    if (options['--file'] || options['--grep']) throw new Error('Smoke has a fixed bounded selection; use product for filters');
    options['--file']='tests/e2e/locales.spec.ts';
    options['--grep']='document, metadata and self-hosted fonts';
    options['--project'] ??= 'desktop';
  }
  return {mode,options,selected};
}
export function playwrightArgs(work, options) {
  const cli=['test','--config',path.join(work,'tests/suites.config.mjs'),'--reporter=list,json'];
  if (options['--file']) cli.push(path.basename(options['--file']));
  if (options['--project']) cli.push('--project',options['--project']);
  if (Object.hasOwn(options,'--grep')) cli.push('--grep',options['--grep']);
  return cli;
}
// Runtime calls only with real unit/family functions; doubles belong to tests.
export function runGroups(mode, selected, runUnit, runFamily, report) {
  const results=[];
  if (mode === 'full') results.push(runUnit());
  for (const family of selected) {
    let result;
    try { result=runFamily(family); }
    catch (error) { result={suite:family,status:'BLOCKED',error:String(error)}; }
    results.push(result);
    report(result);
  }
  return {results, exitCode:results.some(result=>result.status!=='PASS') ? 1 : 0};
}
