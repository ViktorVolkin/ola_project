import fs from 'node:fs';
import path from 'node:path';
import net from 'node:net';
import assert from 'node:assert/strict';
import {spawn} from 'node:child_process';
import {createHash} from 'node:crypto';
import {chromium} from 'playwright';
import {root, node, env} from '../../../../scripts/qa/local.mjs';

const out = path.join(root, 'docs/qa/quality/interaction-widgets-001');
const fixture = path.join(root, '.local-tools/ola-qa/header-fixture-wxM6wf');
const coverage = JSON.parse(fs.readFileSync(path.join(out, 'coverage.json'), 'utf8'));
const result = {buildId: '', cases: [], errors: [], witness: {}, cleanup: {}};
const save = () => fs.writeFileSync(path.join(out, 'integrated-results.json'), JSON.stringify(result, null, 2) + '\n');
const hash = b => createHash('sha256').update(b).digest('hex');
const sourceWitness = () => Object.fromEntries(Object.entries(coverage.source_hashes).map(([file, v]) => {
 const original = hash(fs.readFileSync(path.join(root, file)));
 const copied = hash(fs.readFileSync(path.join(fixture, file)));
 return [file, {expected: v.source_sha256, root: original, fixture: copied, match: original === copied && original === v.source_sha256}];
}));
const start = sourceWitness();
assert.equal(Object.keys(start).length, 14);
assert.ok(Object.values(start).every(v => v.match), 'source checkpoint differs from fixture/root');
result.witness.sourceBefore = start;
result.buildId = fs.readFileSync(path.join(fixture, '.next/BUILD_ID'), 'utf8').trim();
assert.equal(result.buildId, '0RKE00M-JxGMYb9sr8we6');
const port = await new Promise((resolve, reject) => {const s = net.createServer(); s.on('error', reject); s.listen(0, '127.0.0.1', () => {const n = s.address().port; s.close(() => resolve(n));});});
const base = `http://127.0.0.1:${port}`;
const fd = fs.openSync(path.join(out, 'integrated-server.log'), 'w');
const server = spawn(node, [path.join(root, 'node_modules/next/dist/bin/next'), 'start', '--hostname', '127.0.0.1', '--port', String(port)], {cwd: fixture, env, stdio: ['ignore', fd, fd]});
result.witness.server = {pid: server.pid, fixture, base, started: new Date().toISOString()};
let browser;
const check = async (label, meta, fn) => {
 const entry = {label, ...meta, status: 'pass'};
 try {entry.detail = await fn();} catch (e) {entry.status = 'FAIL'; entry.error = e.stack || String(e);}
 result.cases.push(entry); save();
};
const cls = part => `[class*="${part}_"]`;
const style = loc => loc.evaluate(e => {const s = getComputedStyle(e), r = e.getBoundingClientRect(); return {color:s.color, background:s.backgroundColor, border:s.borderColor, outline:s.outlineStyle, outlineWidth:s.outlineWidth, transform:s.transform, transition:s.transitionDuration, rect:{x:r.x,y:r.y,width:r.width,height:r.height}, focusVisible:e.matches(':focus-visible'), disabled:e.matches(':disabled')};});
try {
 let response;
 for (let i = 0; i < 100; i++) {if (server.exitCode !== null) throw Error('server exited'); try {response = await fetch(base + '/en'); if (response.ok) break;} catch {} await new Promise(r => setTimeout(r, 200));}
 assert.ok(response?.ok, 'server not ready');
 result.witness.server.cwd = fs.readlinkSync(`/proc/${server.pid}/cwd`);
 result.witness.server.procStat = fs.readFileSync(`/proc/${server.pid}/stat`, 'utf8');
 const html = await response.text();
 const staticUrl = [...html.matchAll(/(?:src|href)="([^" ]*\/_next\/static\/[^" ]+)"/g)].map(m => m[1]).find(s => s.includes('.css'));
 assert.ok(staticUrl); const asset = await fetch(new URL(staticUrl, base)); assert.equal(asset.status, 200);
 const data = Buffer.from(await asset.arrayBuffer()); const disk = fs.readFileSync(path.join(fixture, '.next', decodeURIComponent(new URL(staticUrl, base).pathname).replace('/_next/', '')));
 assert.deepEqual(data, disk);
 result.witness.served = {status: response.status, htmlSha256: hash(html), staticUrl, assetSha256: hash(data), assetBytes: data.length};
 browser = await chromium.launch({headless:true, env}); result.witness.browser = browser.version();
 const widths = [360, 768, 1440];
 for (const locale of ['en','ru','sr']) for (const width of widths) for (const reducedMotion of ['no-preference','reduce']) {
  const meta = {locale, width, reducedMotion, input: 'keyboard and mouse'};
  const context = await browser.newContext({viewport:{width,height:900}, reducedMotion});
  const p = await context.newPage();
  p.setDefaultTimeout(5000);
  p.on('pageerror', e => result.errors.push({locale,width,reducedMotion,type:'pageerror',message:e.message}));
  p.on('console', msg => {if (msg.type() === 'error') result.errors.push({locale,width,reducedMotion,type:'console',message:msg.text()});});
  const go = async route => {const r = await p.goto(`${base}/${locale}${route}`, {waitUntil:'domcontentloaded'}); assert.equal(r.status(),200); await p.evaluate(() => document.fonts.ready);};
  await check('detail gallery/preferences/disclosure',meta,async()=>{
   await go('/preview/bouquet');
   const thumbs = p.locator(`${cls('BouquetDetailGallery_thumbnail')} `); assert.ok(await thumbs.count() >= 2);
   const second = thumbs.nth(1); const main = p.locator(cls('BouquetDetailGallery_main'));
   const before = await main.getAttribute('src'); await second.focus(); await p.keyboard.press('Enter');
   assert.equal(await second.getAttribute('aria-pressed'),'true'); assert.notEqual(await main.getAttribute('src'),before);
   await second.hover(); await p.waitForTimeout(200); const thumb = await style(second);
   const radio = p.locator('input[type=radio]'); assert.ok(await radio.count()>=2); await radio.nth(1).focus(); await p.keyboard.press('Space'); assert.equal(await radio.nth(1).isChecked(),true);
   const checkboxes=p.locator('input[type=checkbox]'); const checkbox=checkboxes.first(); await checkbox.focus(); await p.keyboard.press('Space'); assert.equal(await checkbox.isChecked(),true);
   const date=p.locator('#preferred-date'); await date.fill('31.02.2025'); await date.blur(); assert.equal(await date.getAttribute('aria-invalid'),'true'); await date.fill('12.05.2026'); assert.equal(await date.getAttribute('aria-invalid'),'false');
   const textarea=p.locator('#card-message'); await textarea.fill('QA'); assert.equal(await textarea.inputValue(),'QA');
   const details=p.locator('details').first(), summary=details.locator('summary'); const old=await details.getAttribute('open'); await summary.focus(); await p.keyboard.press('Enter'); assert.notEqual(await details.getAttribute('open'),old);
   return {thumbnail:thumb, selected:await second.getAttribute('aria-pressed'), imageChanged:true, radioChecked:await radio.nth(1).isChecked(), checkboxChecked:await checkbox.isChecked(), dateInvalidThenValid:true, textarea:'edited', detailsToggled:true, disabledInputs:await p.locator('input:disabled').count()};
  });
  await check('contact FAQ',meta,async()=>{await go('/contact'); const button=p.locator(cls('ContactFaq_trigger')).first(); assert.ok(await button.count()); const old=await button.getAttribute('aria-expanded'); await button.focus(); await p.keyboard.press('Space'); assert.notEqual(await button.getAttribute('aria-expanded'),old); await p.keyboard.press('Enter'); assert.equal(await button.getAttribute('aria-expanded'),old); return {expandedRestored:old,focus:await style(button)};});
  await check('bouquet anchors and disabled actions',meta,async()=>{await go('/bouquets');const anchor=p.locator(cls('BouquetsInspiration_selector')).nth(1);const href=await anchor.getAttribute('href');await anchor.focus();await p.keyboard.press('Enter');assert.equal(new URL(p.url()).hash,href);const disabled=p.locator('button[disabled][aria-describedby="bouquet-card-action-pending"]').first();assert.equal(await disabled.isDisabled(),true);return {fragment:href,disabled:await style(disabled)};});
  await check('home links, scroll region and skip',meta,async()=>{await go('');const service=p.locator(cls('HomeServices_service')).filter({has:p.locator(cls('HomeServices_serviceArrow'))}).first();const mood=p.locator(cls('HomeMood_textLink')).first();const rail=p.locator(cls('HomeMood_moodRail'));assert.ok(await service.count());await service.focus();const a=await style(service);await mood.focus();const b=await style(mood);await rail.focus();const c=await style(rail);return {service:a,mood:b,rail:c,serviceHref:await service.getAttribute('href'),moodHref:await mood.getAttribute('href'),railScrollWidth:await rail.evaluate(e=>({client:e.clientWidth,scroll:e.scrollWidth}))};});
  await check('breadcrumb links and icon actions',meta,async()=>{const collected=[];for(const route of ['/bouquets','/contact','/balloons','/weddings-events','/preview/bouquet']){await go(route);const crumb=p.locator('[class*="_breadcrumb_"] a').first();assert.ok(await crumb.count());await crumb.focus();const before=await style(crumb);if(width===1440){await crumb.hover();await p.waitForTimeout(180);}collected.push({route,href:await crumb.getAttribute('href'),focus:before,hover:await style(crumb)});if(route==='/balloons'||route==='/weddings-events'){const circle=p.locator('[class*="_circle_"]').first();assert.ok(await circle.count());collected.push({route,icon:await style(circle),tag:await circle.evaluate(e=>e.tagName)});}}return collected;});
  if (locale==='en'&&width===1440&&reducedMotion==='no-preference') await p.screenshot({path:path.join(out,'integrated-desktop.png')});
  await context.close();
 }
} catch(e) {result.errors.push({type:'fatal',message:e.stack||String(e)});} finally {
 if(browser) await browser.close();
 if(server.exitCode===null){server.kill('SIGTERM');await new Promise(resolve=>{server.once('exit',resolve);setTimeout(resolve,10000).unref();});}
 fs.closeSync(fd);
 result.cleanup={pid:server.pid,exitCode:server.exitCode,signal:server.signalCode,port,released:await new Promise(resolve=>{const s=net.createServer();s.once('error',()=>resolve(false));s.listen(port,'127.0.0.1',()=>s.close(()=>resolve(true)));})};
 result.witness.sourceAfter=sourceWitness();
 result.witness.sourceUnchanged=Object.values(result.witness.sourceAfter).every(v=>v.match);
 result.summary={total:result.cases.length,pass:result.cases.filter(c=>c.status==='pass').length,fail:result.cases.filter(c=>c.status==='FAIL').length,contexts:new Set(result.cases.map(c=>`${c.locale}/${c.width}/${c.reducedMotion}`)).size};save();
 console.log(JSON.stringify({summary:result.summary,errors:result.errors,cleanup:result.cleanup,sourceUnchanged:result.witness.sourceUnchanged},null,2));
}
