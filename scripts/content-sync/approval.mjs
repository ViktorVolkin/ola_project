import path from 'node:path';
import {inspectJSON} from './json.mjs';
import {snapshot, unchanged} from './transaction.mjs';

// Pin the owner's independently supplied byte hash, not a hash recalculated from
// whatever file happens to occupy the path at application time.
export async function readApproval(root, options) {
  const relative = options.approvedReport, sha256 = options.approvedSha256;
  if (typeof relative!=='string' || !/^[a-f0-9]{64}$/.test(sha256 || '')) throw Error('Approval requires --approved-report and exact lowercase --approved-sha256');
  if (relative.startsWith('src/') || relative.startsWith('scripts/') || /\.transaction(?:\/|$)/.test(relative) || relative===`reports/content-sync/${options.locale}.application.json` || relative===`reports/content-sync/${options.locale}.approval-check.json`) throw Error('Unsafe approval path');
  try {
    const original = await snapshot(root,relative);
    if (original.sha256!==sha256) throw Error('Approval SHA256 mismatch');
    // Strict duplicate-key/prototype validation is intentional even for a pinned file.
    const report = inspectJSON(new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(original.bytes)).value;
    if (!report || report.version!==1 || report.dryRun!==true || report.applied!==false || !Array.isArray(report.blockers) || report.blockers.length) throw Error('Approval must be a successful unapplied dry-run');
    await unchanged(root,[original]);
    return {original,report,path:relative,sha256};
  } catch (error) {
    if (error.message==='Approval SHA256 mismatch' || error.message==='Approval must be a successful unapplied dry-run') throw error;
    throw Error('Approval file validation failed');
  }
}

// Compare exact proposal semantics and all captured relevant inputs. Execution
// flags are not content approval. Object-property order is immaterial; array
// order/segment identity and every value remain exact (including skipped text).
export function approvalDifferences(approved, prospective) {
  const differences = [];
  function compare(a,b,at) {
    if (a===b) return;
    if (Array.isArray(a) && Array.isArray(b)) {
      if (a.length!==b.length) differences.push(at+'.length');
      for (let i=0;i<Math.max(a.length,b.length);i++) compare(a[i],b[i],`${at}[${i}]`);
    } else if (a && b && typeof a==='object' && typeof b==='object' && !Array.isArray(a) && !Array.isArray(b)) {
      for (const key of new Set([...Object.keys(a),...Object.keys(b)])) compare(a[key],b[key],`${at}.${key}`);
    } else differences.push(at);
  }
  for (const key of ['version','locale','selection','perspective','changes','skipped','blockers','pages','totals','source']) compare(approved[key],prospective[key],key);
  // A revision-less snapshot cannot attest an approved published singleton.
  if (!Array.isArray(prospective.source.documents) || prospective.source.documents.length!==prospective.selection.length || prospective.source.documents.some(d=>typeof d.revision!=='string' || !d.revision)) differences.push('source.documents.revision-required');
  return differences;
}

export function approvalOutputStem(options) {
  return options.dryRun===false ? `${options.locale}.application` : options.approvedReport ? `${options.locale}.approval-check` : options.locale;
}

export function assertApprovalOutput(root, original, options) {
  const stem = approvalOutputStem(options);
  for (const ext of ['json','txt']) if (path.resolve(root,original.relative)===path.resolve(root,`reports/content-sync/${stem}.${ext}`)) throw Error('Approval cannot be an output target');
}
