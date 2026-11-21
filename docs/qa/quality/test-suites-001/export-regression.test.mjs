import {test} from 'node:test';
import assert from 'node:assert/strict';
import {mkdtempSync, mkdirSync, writeFileSync, readFileSync, existsSync, cpSync, rmSync} from 'node:fs';
import {tmpdir} from 'node:os';
import path from 'node:path';
import vm from 'node:vm';

// Execute the actual export seam, not a separately implemented copy routine.
const runner = readFileSync(path.resolve('scripts/qa/suites.mjs'), 'utf8');
const start = runner.indexOf('const excluded =');
const end = runner.indexOf('\nfunction manifest(', start);
const inside = runner.match(/try\s*\{\s*(for \(const p of \[[^\n]+\) copy\(p\);)/);
assert.ok(start >= 0 && end > start && inside, 'export seam exists');
const seam = runner.slice(start, end) + '\n' + inside[1];
const list = inside[1].match(/\[([^\]]+)\]/)[1];
const inputs = vm.runInNewContext(`[${list}]`);

test('fresh export copies selected inputs once and refuses existing targets', () => {
  const tmp = mkdtempSync(path.join(tmpdir(), 'ola-export-regression-'));
  try {
    const root = path.join(tmp, 'input'), work = path.join(tmp, 'output');
    mkdirSync(root); mkdirSync(work);
    for (const name of inputs) {
      const dest = path.join(root, name);
      if (['src', 'public', 'tests'].includes(name)) {
        mkdirSync(dest, {recursive:true});
        writeFileSync(path.join(dest, 'sample.txt'), name);
      } else {
        mkdirSync(path.dirname(dest), {recursive:true});
        writeFileSync(dest, name);
      }
    }
    writeFileSync(path.join(root, 'src', '.env.synthetic'), 'synthetic');
    mkdirSync(path.join(root, 'src', 'node_modules'));
    writeFileSync(path.join(root, 'src', 'node_modules', 'synthetic'), 'synthetic');
    const context = vm.createContext({root, work, path, mkdirSync, cpSync});
    vm.runInContext(seam, context);
    for (const name of inputs) {
      const target = path.join(work, name, ...(['src', 'public', 'tests'].includes(name) ? ['sample.txt'] : []));
      assert.equal(readFileSync(target, 'utf8'), name);
    }
    assert.equal(existsSync(path.join(work, 'src', '.env.synthetic')), false);
    assert.equal(existsSync(path.join(work, 'src', 'node_modules')), false);
    assert.throws(() => vm.runInContext("copy('src')", context), {code:'ERR_FS_CP_EEXIST'});
    assert.equal(readFileSync(path.join(work, 'src', 'sample.txt'), 'utf8'), 'src');
  } finally { rmSync(tmp, {recursive:true, force:true}); }
});
