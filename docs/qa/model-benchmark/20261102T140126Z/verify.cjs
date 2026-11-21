// Parent verification of captured outputs; no network or provider calls.
/* eslint-disable @typescript-eslint/no-require-imports -- This standalone .cjs runner deliberately uses Node CommonJS. */
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const artifactPath = process.argv[2] || path.join(__dirname, 'benchmark.json');
const artifact = JSON.parse(fs.readFileSync(artifactPath, 'utf8'));
const results = [];
function permutations(values) {
  const result = [[]];
  for (const value of values) {
    for (const tail of permutations(values.filter(item => item !== value))) {
      result.push([value, ...tail]);
    }
  }
  return result;
}
for (const call of artifact.calls) {
  const result = { model: call.requested_model_id, task: call.task, seconds: call.elapsed_seconds, status: call.status };
  if (!call.output) {
    result.assessment = 'No final answer; quality not scored';
    results.push(result);
    continue;
  }
  let parsed;
  try { parsed = JSON.parse(call.output); result.strict_json = true; }
  catch { result.strict_json = false; }
  if (call.task === 'A') {
    // A fenced response is inspected separately, never counted as format-compliant.
    const text = call.output.replace(/^```json\s*/, '').replace(/\s*```$/, '');
    const inspected = parsed || JSON.parse(text);
    result.reported_lines = inspected.findings.map(item => item.line);
    result.required_first_fault_lines = [3, 4];
    result.first_fault_localization_pass = JSON.stringify(result.reported_lines) === '[3,4]';
    result.semantic_review_scope = 'Line numbers checked here; meaning and correctness of English fixes are reviewed independently in manual-comparison.md.';
  } else {
    assert(parsed, 'Task B must be strict JSON');
    assert.deepEqual(Object.keys(parsed).sort(), ['code', 'tests']);
    assert.equal(parsed.tests.length, 3);
    assert.match(parsed.code, /^function toggleSelection\(selected, id, limit\)\s*\{/);
    // This captured implementation was manually reviewed: only array operations,
    // comparisons, and returns. vm adds timeout/isolation, not a security boundary.
    const context = vm.createContext({}, { codeGeneration: { strings: false, wasm: false } });
    vm.runInContext(parsed.code, context, { timeout: 100 });
    let checked = 0;
    function check(selected, id, limit, expected) {
      const original = [...selected];
      context.selected = Object.freeze([...selected]);
      context.id = id;
      context.limit = limit;
      const actual = vm.runInContext('toggleSelection(selected, id, limit)', context, { timeout: 100 });
      assert(Array.isArray(actual));
      assert.notEqual(actual, context.selected, 'Must always return a fresh array');
      assert.deepEqual(Array.from(actual), expected);
      assert.deepEqual(Array.from(context.selected), original, 'Must not mutate input');
      checked++;
    }
    for (const test of parsed.tests) {
      assert.deepEqual(Object.keys(test).sort(), ['expected', 'id', 'limit', 'selected']);
      check(test.selected, test.id, test.limit, test.expected);
    }
    const [removal, zero, append] = parsed.tests;
    assert(removal.selected.includes(removal.id) && removal.selected.length === removal.limit);
    assert(zero.limit === 0 && !zero.selected.includes(zero.id));
    assert(!append.selected.includes(append.id) && append.selected.length < append.limit);
    const suppliedCases = checked;
    for (const selected of permutations(['a', 'b', 'c'])) {
      for (const id of ['a', 'b', 'c', 'z']) {
        for (let limit = 0; limit <= 4; limit++) {
          const expected = selected.includes(id)
            ? selected.filter(item => item !== id)
            : selected.length < limit ? [...selected, id] : [...selected];
          check(selected, id, limit, expected);
        }
      }
    }
    result.format_and_supplied_tests_pass = true;
    result.supplied_cases_passed = suppliedCases;
    result.independent_cases_passed = checked - suppliedCases;
    result.checked_fresh_arrays_and_frozen_input = true;
  }
  results.push(result);
}
const report = { captured_calls: artifact.calls.length, results, limits: 'One captured response per model/task. Timing retains the source measurement scope documented in benchmark.json; delegate child duration is not standalone API latency. Not tokens/sec or time-to-first-token. No ranking inferred from API errors or exhausted output budgets.' };
fs.writeFileSync(path.join(path.dirname(artifactPath), 'parent-verification.json'), JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report, null, 2));
