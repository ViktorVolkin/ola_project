import fs from 'node:fs';
import path from 'node:path';
import ts from 'typescript';

const [beforeDir, afterDir] = process.argv.slice(2);
if (!beforeDir || !afterDir) throw new Error('usage: node compare-emitted-ast.mjs BEFORE_DIR AFTER_DIR');
const names = fs.readdirSync(beforeDir).filter((name) => name.endsWith('.tsx.txt')).map((name) => name.slice(0, -4)).sort();

// TS printer-only metadata and source-location fields that carry no semantics.
const ignored = new Set([
  'pos', 'end', 'flags', 'modifierFlagsCache', 'transformFlags', 'parent', 'emitNode',
  'symbol', 'locals', 'nextContainer', 'flowNode', 'jsDoc', 'commentRange',
  'sourceMapRange', 'fileName', 'multiLine', 'singleLine', 'line', 'nodeCount', 'identifierCount', 'symbolCount',
]);
// Composite containers whose `text` is pure printing (spacing, trailing commas,
// line breaks) are compared through their children instead of their `text`.
function isScalarTextKind(kind) {
  switch (kind) {
    case ts.SyntaxKind.Identifier:
    case ts.SyntaxKind.StringLiteral:
    case ts.SyntaxKind.NumericLiteral:
    case ts.SyntaxKind.BigIntLiteral:
    case ts.SyntaxKind.RegularExpressionLiteral:
    case ts.SyntaxKind.NoSubstitutionTemplateLiteral:
    case ts.SyntaxKind.JsxText:
    case ts.SyntaxKind.TrueKeyword:
    case ts.SyntaxKind.FalseKeyword:
    case ts.SyntaxKind.NullKeyword:
      return true;
    default:
      return false;
  }
}
function clean(value) {
  if (Array.isArray(value)) return value.map(clean);
  if (!value || typeof value !== 'object') return value;
  // Grouping parentheses carry no semantics; unwrap them.
  if (value.kind === ts.SyntaxKind.ParenthesizedExpression) return clean(value.expression);
  const out = {};
  const kind = value.kind;
  for (const key of Object.keys(value).sort()) {
    if (ignored.has(key) || key.startsWith('_')) continue;
    const item = value[key];
    if (typeof item === 'function' || item === undefined) continue;
    // Trailing commas are delimiter-only printing; drop them from list syntax lists.
    if (kind === ts.SyntaxKind.SyntaxList && /^\d+$/.test(key) && item.kind === ts.SyntaxKind.CommaListToken) continue;
    if (key === 'kind') { out[key] = item; continue; }
    if (key === 'text') {
      if (kind !== undefined && !isScalarTextKind(kind)) continue;
      out[key] = item;
      continue;
    }
    out[key] = clean(item);
  }
  return out;
}
function emittedAst(file) {
  const source = fs.readFileSync(file, 'utf8');
  const result = ts.transpileModule(source, {
    fileName: path.basename(file).replace(/\.txt$/, ''),
    compilerOptions: { jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2020, module: ts.ModuleKind.ESNext },
    reportDiagnostics: true,
  });
  if (result.diagnostics?.length) throw new Error(`${file}: ${result.diagnostics.map(d => d.messageText).join('; ')}`);
  const js = ts.createSourceFile(file + '.js', result.outputText, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS);
  return JSON.stringify(clean(js));
}
const results = names.map((name) => {
  const left = emittedAst(path.join(beforeDir, `${name}.txt`));
  const right = emittedAst(path.join(afterDir, `${name}.txt`));
  return { file: name, equal: left === right };
});
console.log(JSON.stringify({ count: results.length, equal: results.every(x => x.equal), results }, null, 2));
if (!results.every(x => x.equal)) process.exitCode = 1;
