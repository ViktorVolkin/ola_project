import { test as base, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const node = '/home/pn/.npm/_npx/78122db76a76712a/node_modules/node/bin/node';
const root = process.cwd();
const delay = (ms: number) => new Promise(resolveDelay => setTimeout(resolveDelay, ms));
async function assertFree(port: number) {
  await new Promise<void>((done, reject) => {
    const server = createServer();
    server.once('error', reject);
    server.listen(port, '127.0.0.1', () => server.close(error => error ? reject(error) : done()));
  });
}
async function stop(child: ChildProcess) {
  if (child.exitCode !== null || child.signalCode !== null) return;
  const exited = new Promise<void>(done => child.once('exit', () => done()));
  child.kill('SIGTERM');
  await Promise.race([exited, delay(10000)]);
  if (child.exitCode === null && child.signalCode === null) { child.kill('SIGKILL'); await exited; }
}
type WorkerFixtures = { fixtureURL: string };
export const test = base.extend<object, WorkerFixtures>({
  fixtureURL: [async ({}, runFixture, workerInfo) => {
    const run = process.env.BD_MIGRATION_RUN;
    const evidence = process.env.BD_MIGRATION_EVIDENCE;
    if (!run || !evidence) throw new Error('Use migration-run.sh to create and clean the frozen fixtures');
    if (workerInfo.parallelIndex > 1) throw new Error('Fixture limit is two workers');
    const fixture = resolve(run, `fixture-${workerInfo.parallelIndex}`);
    const port = 3310 + workerInfo.parallelIndex;
    await assertFree(port);
    mkdirSync(evidence, {recursive:true});
    const tag = `${workerInfo.project.name}-worker-${workerInfo.workerIndex}`;
    const env = {...process.env, PATH:`${resolve(node,'..')}:${process.env.PATH}`};
    const child = spawn(node, [resolve(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)], {cwd:fixture, env, stdio:['ignore','pipe','pipe']});
    let log = ''; child.stdout?.on('data', b => {log += b.toString();}); child.stderr?.on('data', b => {log += b.toString();});
    try {
      const url = `http://127.0.0.1:${port}`;
      let ready = false;
      for (let i=0; i<60; i++) { if (child.exitCode !== null || child.signalCode !== null) throw new Error(`fixture exited: ${log}`); try { if ((await fetch(`${url}/en/fixture/detail?widget=preferences`)).ok) {ready = true; break;} } catch {} await delay(1000); }
      if (!ready) throw new Error(`fixture not ready: ${log}`);
      await runFixture(url);
    } finally {
      await stop(child);
      writeFileSync(resolve(evidence, `${tag}.log`), log + `\ncleanup pid=${child.pid} exit=${child.exitCode} signal=${child.signalCode}\n`);
      await assertFree(port);
    }
  }, {scope:'worker', timeout: 120000}]
});
export { expect };
