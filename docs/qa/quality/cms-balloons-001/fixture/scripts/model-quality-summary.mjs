import {readFileSync} from 'node:fs';
import {resolve} from 'node:path';
const states = ['accepted', 'rejected', 'pending', 'blocked', 'unknown'];
const stateOf = value => {
  if (typeof value !== 'string') return 'unknown';
  const s = value.toLowerCase();
  if (/reject|fail|declin/.test(s)) return 'rejected';
  if (/block/.test(s)) return 'blocked';
  if (/pending|await|progress|review|ready|interrupt/.test(s)) return 'pending';
  if (/accept|complete|passed|delivered/.test(s)) return 'accepted';
  return 'unknown';
};
const blank = () => Object.fromEntries(states.map(s => [s, 0]));
const unique = (rows, conflicts) => {
  const out = [];
  for (const row of rows ?? []) {
    if (!row?.id) continue;
    const previous = out.find(x => x.id === row.id);
    if (previous) { if (JSON.stringify(previous) !== JSON.stringify(row)) conflicts.push(row.id); }
    else out.push(row);
  }
  return out;
};
export function summarize(ledger) {
  const conflicts = [], units = unique(ledger.units, conflicts), attempts = unique(ledger.attempts, conflicts);
  const delivery = units.filter(u => u.count_as_delivery_unit === true && !u.parent_id);
  const deliveryState = blank();
  for (const u of delivery) deliveryState[stateOf(u.delivery_state)]++;
  const eligible = delivery.filter(u => ['accepted', 'rejected'].includes(stateOf(u.first_submission_disposition)));
  const firstExcluded = delivery.filter(u => !eligible.includes(u));
  const firstExcludedByDisposition = blank(); for (const u of firstExcluded) firstExcludedByDisposition[stateOf(u.first_submission_disposition)]++;
  const firstExcludedIds = Object.fromEntries(states.map(s => [s, firstExcluded.filter(u => stateOf(u.first_submission_disposition) === s).map(u => u.id)]));
  const firstCounts = blank(); for (const u of eligible) firstCounts[stateOf(u.first_submission_disposition)]++;
  const complete = eligible.filter(u => u.correction_history_complete === true);
  const corrections = ledger.corrections ?? [];
  const completeIds = new Set(complete.map(u => u.id));
  const confirmed = corrections.filter(c => c.confirmed === true && c.implementation_changed === true && ['implementation_defect', 'instruction_miss'].includes(c.cause) && completeIds.has(c.unit_id));
  const modelRole = {};
  for (const a of attempts) {
    const key = `${a.actual_model ?? 'unknown'} / ${a.role ?? 'unknown'}`;
    modelRole[key] ??= {attempts: 0, statusCounts: blank(), deliveryUnits: []};
    modelRole[key].attempts++;
    modelRole[key].statusCounts[stateOf(a.status)]++;
    if (delivery.some(u => u.id === a.unit_id) && !modelRole[key].deliveryUnits.includes(a.unit_id)) modelRole[key].deliveryUnits.push(a.unit_id);
  }
  const mixed = delivery.filter(u => new Set(attempts.filter(a => a.unit_id === u.id && a.role !== 'reviewer').map(a => a.actual_model).filter(Boolean)).size > 1).map(u => u.id);
  const causes = {}; for (const c of corrections) { const cause = c.cause ?? 'unknown'; causes[cause] = (causes[cause] ?? 0) + 1; }
  const denominator = eligible.length, reworkDenom = complete.length;
  const coverage = Object.fromEntries(['actual_model', 'provider', 'route', 'role'].map(k => [k, {known: attempts.filter(a => a[k] != null).length, total: attempts.length}]));
  return {notice: 'Ledger-only; not fresh acceptance verification.', unitCounts: {all: units.length, deliveryEligible: delivery.length, deliveryState}, firstSubmission: {eligibleUnits: denominator, excludedUnknown: firstExcludedByDisposition.unknown, excludedByDisposition: firstExcludedByDisposition, excludedIds: firstExcludedIds, counts: firstCounts, acceptanceRate: {numerator: firstCounts.accepted, denominator, value: denominator ? firstCounts.accepted / denominator : null}, reworkRate: {numerator: confirmed.length, denominator: reworkDenom, value: reworkDenom ? confirmed.length / reworkDenom : null, excludedIncompleteHistory: eligible.length - reworkDenom}}, correctionsByCause: causes, attempts: {unique: attempts.length, statusCounts: Object.fromEntries(states.map(s => [s, attempts.filter(a => stateOf(a.status) === s).length]))}, modelRole, mixedImplementationUnits: mixed, metadataCoverage: coverage, duplicateConflicts: [...new Set(conflicts)].sort()};
}
if (process.argv[1] && resolve(process.argv[1]) === resolve(new URL(import.meta.url).pathname)) {
  const file = resolve(process.argv[2] ?? 'docs/qa/model-quality/ledger.json');
  try { console.log(JSON.stringify(summarize(JSON.parse(readFileSync(file, 'utf8'))), null, 2)); }
  catch (error) { console.error(`Unable to summarize ${file}: ${error}`); process.exitCode = 1; }
}
