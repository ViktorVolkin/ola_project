import { test as base, expect } from '@playwright/test';
import { execFileSync, spawn, type ChildProcess } from 'node:child_process';
import { copyFileSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const root = process.cwd();
const node = '/home/pn/.npm/_npx/78122db76a76712a/node_modules/node/bin/node';
const evidence = resolve(root, 'docs/qa/bouquet-detail/test-migration-001');
const delay = (ms: number) => new Promise(resolveDelay => setTimeout(resolveDelay, ms));
async function assertFree(port: number) {
  await new Promise<void>((resolveFree, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => server.close(error => error ? reject(error) : resolveFree()));
  });
}
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise<void>(resolveExit => child.once('exit', () => resolveExit()));
  child.kill('SIGTERM');
  await Promise.race([exited, delay(10000)]);
  if (child.exitCode === null && child.signalCode === null) { child.kill('SIGKILL'); await exited; }
}

type WorkerFixtures = { fixtureURL: string };
export const test = base.extend<object, WorkerFixtures>({
  fixtureURL: [async ({}, runFixture, workerInfo) => {
    const projectOffset = workerInfo.project.name === 'mobile' ? 100 : 0;
    const port = 3310 + projectOffset + workerInfo.workerIndex;
    // Small delay for worker 0 to avoid race with port cleanup from previous runs
    if (workerInfo.workerIndex === 0 && workerInfo.project.name === 'desktop') {
      await delay(500);
    }
    await assertFree(port);
    mkdirSync(evidence, {recursive:true});
    // prepare.py uses second-resolution names. Stagger workers, then retry only a name collision.
    await delay(workerInfo.parallelIndex * 1100);
    let fixture = '';
    for (let attempt = 0; attempt < 3; attempt++) {
      try { fixture = execFileSync('python3', ['tests/fixtures/bouquet-detail-next/prepare.py'], {cwd:root, encoding:'utf8'}).trim(); break; }
      catch (error) { if (!String(error).includes('File exists') || attempt === 2) throw error; await delay(1100); }
    }
    copyFileSync(resolve(root, 'tests/fixtures/bouquet-detail-next/migration-page.tsx.txt'), resolve(fixture, 'src/app/[locale]/fixture/detail/page.tsx'));
    const tag = `worker-${workerInfo.workerIndex}`;
    const hash = (path: string) => createHash('sha256').update(readFileSync(path)).digest('hex');
    writeFileSync(resolve(evidence, `${tag}-identity.json`), JSON.stringify({fixture, port, node:execFileSync(node,['--version'],{encoding:'utf8'}).trim(), next:JSON.parse(readFileSync(resolve(root,'node_modules/next/package.json'),'utf8')).version, snapshotHash:hash(resolve(fixture,'snapshot.json')), templateHash:hash(resolve(fixture,'src/app/[locale]/fixture/detail/page.tsx')), snapshot:JSON.parse(readFileSync(resolve(fixture,'snapshot.json'),'utf8'))},null,2));
    const env = {...process.env, PATH:`${resolve(node,'..')}:${process.env.PATH}`};
    let output = '';
    try { output = execFileSync(node, [resolve(root,'node_modules/next/dist/bin/next'), 'build', '--webpack'], {cwd:fixture, env, encoding:'utf8', stdio:'pipe', maxBuffer:16*1024*1024}); }
    catch (error) { const e = error as {stdout?: Buffer|string, stderr?: Buffer|string}; writeFileSync(resolve(evidence, `${tag}-build.log`), String(e.stdout ?? '') + String(e.stderr ?? '')); throw error; }
    writeFileSync(resolve(evidence, `${tag}-build.log`), output);
    const child = spawn(node, [resolve(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)], {cwd:fixture, env, stdio:['ignore','pipe','pipe']});
    let serverLog = ''; child.stdout?.on('data', b => {serverLog += b.toString();}); child.stderr?.on('data', b => {serverLog += b.toString();});
    try {
      const url = `http://127.0.0.1:${port}`;
      let ready = false;
      for (let i=0; i<60; i++) { if (child.exitCode !== null) throw new Error(`fixture exited: ${serverLog}`); try { if ((await fetch(`${url}/en/fixture/detail?widget=preferences`)).ok) {ready = true; break;} } catch {} await delay(1000); }
      if (!ready) throw new Error(`fixture not ready: ${serverLog}`);
      await runFixture(url);
    } finally {
      await stop(child);
      writeFileSync(resolve(evidence, `${tag}-server.log`), serverLog + `\ncleanup pid=${child.pid} exit=${child.exitCode} signal=${child.signalCode}\n`);
      await assertFree(port);
    }
  }, {scope:'worker', timeout: 240000}]
});
export { expect };
