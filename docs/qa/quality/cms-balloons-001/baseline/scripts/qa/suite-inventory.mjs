import {readdirSync} from 'node:fs';
import {join, relative, resolve} from 'node:path';
import {pathToFileURL} from 'node:url';

const names = `about accessibility-site balloons-hit-area balloons bouquet-detail-preview bouquets contact-faq-keyboard contact-geography contact error-shell fonts home locales motion-scroll-accessibility motion-scroll-lifecycle motion-scroll navigation not-found responsive routing security-next-patch typography-fluid weddings workflow-disclosure`.split(' ');
export const inventory = Object.fromEntries(names.map(name => [`tests/e2e/${name}.spec.ts`, {family:'product', projects:['desktop','mobile']}]));
Object.assign(inventory, {
  'tests/e2e/bouquet-detail-gallery.spec.ts': {family:'gallery', projects:['desktop','mobile']},
  'tests/e2e/bouquet-detail-page.spec.ts': {family:'detail-page', projects:['chromium']},
  'tests/e2e/bouquet-detail-preferences.spec.ts': {family:'migration', projects:['desktop','mobile']},
  'tests/e2e/bouquet-detail-supporting.spec.ts': {family:'migration', projects:['desktop','mobile']},
  'tests/fixtures/action-button/browser-smoke.spec.ts': {family:'action-button', projects:['chromium']}
});
const excluded = new Set(['.next', 'node_modules', 'test-results']);
function discover(root, dir) {
  return readdirSync(dir, {withFileTypes:true}).flatMap(entry => {
    const file = join(dir, entry.name);
    if (entry.isDirectory()) return excluded.has(entry.name) ? [] : discover(root,file);
    return entry.isFile() && /\.(spec|test)\.[cm]?[jt]sx?$/.test(entry.name) ? [relative(root,file).replaceAll('\\','/')] : [];
  });
}
export function listInventory(root) {
  const actual = ['tests/e2e','tests/fixtures'].flatMap(dir => discover(root,join(root,dir))).sort();
  const unknown = actual.filter(path => !Object.hasOwn(inventory,path));
  const missing = Object.keys(inventory).filter(path => !actual.includes(path)).sort();
  const counts = {};
  for (const path of actual) {const family = inventory[path]?.family ?? 'unclassified'; counts[family] = (counts[family] ?? 0) + 1;}
  return {status:unknown.length || missing.length ? 'FAIL' : 'CLASSIFIED_ONLY_NOT_EXECUTED', counts, specs:actual.map(path => ({path,...(inventory[path] ?? {family:'unclassified'})})), unknown, missing};
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const result = listInventory(resolve(process.argv[2] || '.'));
  console.log(JSON.stringify(result,null,2));
  if (result.unknown.length || result.missing.length) process.exitCode = 1;
}
