import { test as base, expect } from '@playwright/test';
import { spawn, type ChildProcess } from 'node:child_process';
import { mkdirSync, writeFileSync, realpathSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const node = process.execPath;
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
  if (!child.pid || child.exitCode !== null || child.signalCode !== null) return;
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
    if (!run || !evidence || realpathSync(resolve(run,'source')) !== realpathSync(root) || resolve(evidence) !== resolve(run,'migration-evidence')) throw new Error('Use the managed suite runner and its private evidence directory');
    if (workerInfo.parallelIndex > 1) throw new Error('Fixture limit is two workers');
    const fixture = resolve(run, `current-slot${workerInfo.parallelIndex}`);
    if (realpathSync(fixture) !== fixture) throw new Error('Fixture must be a real private slot');
    const basePort = Number(process.env.BD_MIGRATION_PORT);
    const port = basePort + workerInfo.parallelIndex;
    if (!Number.isInteger(basePort) || basePort < 1024 || basePort >= 65535 || [3100,42242,42244].includes(basePort) || [3100,42242,42244].includes(basePort+1)) throw new Error('Invalid private migration ports');
    await assertFree(port);
    mkdirSync(evidence, {recursive:true});
    const tag = `${workerInfo.project.name}-worker-${workerInfo.workerIndex}`;
    const env = {...process.env, PATH:`${resolve(node,'..')}:${process.env.PATH}`};
    const child = spawn(node, [resolve(root,'node_modules/next/dist/bin/next'),'start','--hostname','127.0.0.1','--port',String(port)], {cwd:fixture, env, stdio:['ignore','pipe','pipe']});
    let log = ''; let spawnError: Error | undefined;
    child.on('error', error => {spawnError=error; log += `spawn error ${error.message}\n`;});
    child.stdout?.on('data', b => {log += b.toString();}); child.stderr?.on('data', b => {log += b.toString();});
    try {
      const url = `http://127.0.0.1:${port}`;
      let ready = false;
      for (let i=0; i<60; i++) { if (spawnError) throw spawnError; if (child.exitCode !== null || child.signalCode !== null) throw new Error(`fixture exited: ${log}`); try { const response=await fetch(`${url}/en/fixture/detail?widget=preferences`, {signal:AbortSignal.timeout(3000)}); log += `readiness HTTP ${response.status}\n`; if (response.ok) {ready = true; break;} } catch (error) { log += `readiness ${String(error)}\n`; } await delay(1000); }
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
