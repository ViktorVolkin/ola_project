import fs from 'node:fs/promises';
import path from 'node:path';
import {randomUUID, createHash} from 'node:crypto';

export const hash = value => createHash('sha256').update(value).digest('hex');
export async function confined(root, relative, directory = false) {
  if (path.isAbsolute(relative) || relative.split(/[\\/]/).some(p=>!p || p==='.' || p==='..')) throw Error('Unsafe relative path');
  const base = await fs.realpath(root), target = path.join(base,relative);
  let current = base;
  const parts = relative.split('/');
  for (let i=0;i<parts.length;i++) {
    current = path.join(current,parts[i]);
    const stat = await fs.lstat(current);
    if (stat.isSymbolicLink() || (i < parts.length-1 ? !stat.isDirectory() : directory ? !stat.isDirectory() : !stat.isFile() || stat.nlink !== 1)) throw Error('Symlink or unsafe file target');
  }
  return target;
}
export async function snapshot(root, relative) {
  const target = await confined(root,relative), stat = await fs.stat(target), bytes = await fs.readFile(target);
  return {relative,bytes,sha256:hash(bytes),mode:stat.mode & 0o777,ino:stat.ino,dev:stat.dev};
}
export async function unchanged(root, guards, replacements = new Map()) {
  for (const original of guards) {
    const target = await confined(root,original.relative), bytes = await fs.readFile(target), stat = await fs.stat(target);
    const expected = replacements.get(original.relative);
    if (expected ? !bytes.equals(expected) : hash(bytes)!==original.sha256 || stat.ino!==original.ino || stat.dev!==original.dev) throw Error('Concurrent/stale input: '+original.relative);
  }
}
export async function reportDirectory(root) {
  // Check existing ancestors before creating anything: reports cannot escape via symlink.
  for (const relative of ['reports','reports/content-sync']) {
    try { await confined(root,relative,true); }
    catch (error) {
      if (error.code !== 'ENOENT') throw error;
      await fs.mkdir(path.join(root,relative));
      await confined(root,relative,true);
    }
  }
  return path.join(await fs.realpath(root),'reports/content-sync');
}
export async function noRecovery(root) {
  const dir = path.join(root,'reports/content-sync/.transaction');
  try { await fs.lstat(dir); } catch (error) { if (error.code==='ENOENT') return; throw error; }
  throw Error('Unresolved content-sync transaction; inspect recovery manifest before continuing');
}

// Runtime rollback, NOT crash-atomic multi-file publication. A retained transaction
// includes exact originals, proposed bytes and a manifest for manual recovery.
export async function commit(root, plan, hooks = {}) {
  if (plan.report.blockers.length) throw Error('Plan has blockers');
  const allowed = new Set(plan.report.selection.map(page=>`src/i18n/messages/${page}/${plan.report.locale}.json`));
  const seen = new Set();
  for (const file of plan.files) {
    if (!/^src\/i18n\/messages\/(home|about|weddings|balloons|bouquets|contact)\/(ru|en|sr)\.json$/.test(file.original.relative) || !allowed.has(file.original.relative) || seen.has(file.original.relative) || !plan.guards.some(g=>g.relative===file.original.relative && g.sha256===file.original.sha256)) throw Error('Unsafe or duplicate transaction target');
    seen.add(file.original.relative);
  }
  await noRecovery(root);
  await unchanged(root,plan.guards);
  if (!plan.files.length) return;
  const dir = await reportDirectory(root), journal = path.join(dir,'.transaction');
  await fs.mkdir(journal); // Exclusive lock across locales/pages; never remove another run's lock.
  const stages = [], ownedStages = new Map(), committed = new Map();
  const ownedJournal = new Map();
  let retain = false;
  async function journalFile(name, bytes) {
    await fs.writeFile(path.join(journal,name),bytes,{flag:'wx',mode:0o600});
    ownedJournal.set(name,hash(bytes));
  }
  try {
    for (const [i,file] of plan.files.entries()) {
      await journalFile(`${i}.original`,file.original.bytes);
      await journalFile(`${i}.proposed`,file.bytes);
    }
    await journalFile('manifest.json',JSON.stringify({version:1,crashAtomic:false,files:plan.files.map((f,i)=>({file:f.original.relative,original:`${i}.original`,proposed:`${i}.proposed`,oldHash:f.original.sha256,newHash:hash(f.bytes)}))},null,2)+'\n');
    for (const [i,file] of plan.files.entries()) {
      const target = await confined(root,file.original.relative);
      const stage = path.join(path.dirname(target),`.content-sync-${randomUUID()}.tmp`);
      const handle = await fs.open(stage,'wx',file.original.mode);
      stages.push(stage);
      try {
        await handle.writeFile(file.bytes); await handle.chmod(file.original.mode); await handle.sync();
        const stat = await handle.stat(); ownedStages.set(stage,{ino:stat.ino,dev:stat.dev,sha256:hash(file.bytes)});
      } finally { await handle.close(); }
      await hooks.afterStage?.(i);
    }
    await hooks.beforeCommit?.();
    await unchanged(root,plan.guards);
    for (const [i,file] of plan.files.entries()) {
      await hooks.beforeRename?.(i);
      await unchanged(root,plan.guards,committed);
      const target = await confined(root,file.original.relative);
      const stageStat = await fs.lstat(stages[i]), owned = ownedStages.get(stages[i]);
      if (stageStat.isSymbolicLink() || stageStat.ino!==owned.ino || stageStat.dev!==owned.dev || hash(await fs.readFile(stages[i]))!==owned.sha256) throw Error('Staged file changed');
      await fs.rename(stages[i],target);
      committed.set(file.original.relative,file.bytes);
    }
    await unchanged(root,plan.guards,committed); // Read back every exact target.
  } catch (error) {
    const failures = [];
    for (const [i,file] of [...plan.files.entries()].reverse()) {
      if (!committed.has(file.original.relative)) continue;
      try {
        const target = await confined(root,file.original.relative);
        if (!(await fs.readFile(target)).equals(file.bytes)) throw Error('Owner changed committed destination');
        await hooks.beforeRollback?.(i);
        if (!(await fs.readFile(target)).equals(file.bytes)) throw Error('Owner changed committed destination');
        // Reuse our same-directory stage path for rollback, not an unknown file.
        const rollback = await fs.open(stages[i],'wx',file.original.mode);
        try {
          await rollback.writeFile(file.original.bytes); await rollback.chmod(file.original.mode); await rollback.sync();
          const stat = await rollback.stat(); ownedStages.set(stages[i],{ino:stat.ino,dev:stat.dev,sha256:file.original.sha256});
        } finally { await rollback.close(); }
        await fs.rename(stages[i],target);
        if (!(await fs.readFile(target)).equals(file.original.bytes)) throw Error('Rollback readback mismatch');
      } catch { failures.push(file.original.relative); }
    }
    if (failures.length) { retain=true; throw Error('Recovery required; transaction retained; conflicts: '+failures.join(', ')); }
    throw error;
  } finally {
    let cleanupFailure = false;
    for (const stage of stages) {
      try {
        const stat = await fs.lstat(stage), owned = ownedStages.get(stage);
        if (!owned || stat.isSymbolicLink() || stat.ino!==owned.ino || stat.dev!==owned.dev || hash(await fs.readFile(stage))!==owned.sha256) throw Error('Unknown stage replacement');
        await fs.unlink(stage);
      } catch (error) { if(error.code!=='ENOENT') cleanupFailure=true; }
    }
    if (!retain && !cleanupFailure) {
      try {
        const names = await fs.readdir(journal);
        if (names.length!==ownedJournal.size || names.some(n=>!ownedJournal.has(n))) throw Error('Unknown journal files');
        for (const name of names) {
          const target = path.join(journal,name), stat = await fs.lstat(target);
          if (!stat.isFile() || stat.isSymbolicLink() || hash(await fs.readFile(target))!==ownedJournal.get(name)) throw Error('Journal changed');
        }
        for (const name of names) await fs.unlink(path.join(journal,name));
        await fs.rmdir(journal);
      } catch { cleanupFailure=true; }
    }
    if (cleanupFailure && !retain) throw Error('Recovery required; inspect retained transaction and staged files; cleanup ownership check failed');
  }
}
