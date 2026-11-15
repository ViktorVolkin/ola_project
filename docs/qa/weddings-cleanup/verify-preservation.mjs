import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile, readdir, writeFile} from 'node:fs/promises';
import {relative, resolve} from 'node:path';
import postcss from 'postcss';
import ts from 'typescript';

const directory = 'docs/qa/weddings-cleanup';
const before = JSON.parse(await readFile(`${directory}/before-sources.json`, 'utf8'));
const baseline = JSON.parse(
  await readFile('docs/qa/weddings/confirmation-source-handoff.json', 'utf8')
);

function cssTree(text) {
  const visit = node => {
    if (node.type === 'comment') return null;
    const result = {type: node.type};
    for (const key of ['selector', 'name', 'params', 'prop', 'important']) {
      if (node[key] !== undefined) result[key] = node[key];
    }
    // Ignore only formatting: wrapping, comma padding and optional decimal zeroes.
    if (node.value !== undefined) {
      result.value = node.value
        .replace(/\s+/g, ' ')
        .replace(/\s*([(),])\s*/g, '$1')
        .replace(/(^|[^\w.])0\.(\d+)/g, '$1.$2')
        .trim();
    }
    if (node.nodes) result.children = node.nodes.map(visit).filter(Boolean);
    return result;
  };
  return JSON.stringify(visit(postcss.parse(text)));
}

function jsTree(text, fileName) {
  // Compile JSX first so changes to rendered text/whitespace remain detectable.
  const emitted = ts.transpileModule(text, {
    fileName,
    compilerOptions: {
      jsx: ts.JsxEmit.ReactJSX,
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.ESNext,
      removeComments: true
    }
  }).outputText;
  const source = ts.createSourceFile(
    'emitted.js', emitted, ts.ScriptTarget.Latest, true, ts.ScriptKind.JS
  );
  const visit = node => {
    if (ts.isParenthesizedExpression(node)) return visit(node.expression);
    const result = {kind: ts.SyntaxKind[node.kind]};
    if (
      ts.isIdentifier(node) || ts.isStringLiteral(node) ||
      ts.isNumericLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)
    ) result.text = node.text;
    const children = [];
    ts.forEachChild(node, child => { children.push(visit(child)); });
    if (children.length) result.children = children;
    return result;
  };
  return JSON.stringify(visit(source));
}

const checks = [];
for (const [file, original] of Object.entries(before)) {
  const current = await readFile(file, 'utf8');
  const normalize = file.endsWith('.tsx') ? jsTree : cssTree;
  const equivalent = normalize(original, file) === normalize(current, file);
  assert.ok(equivalent, `Semantic change: ${file}`);
  checks.push({file, equivalent, changed: current !== original});
}

// Substitute the saved originals into the full baseline fingerprint. A mismatch
// also catches changes outside the 15 cleanup files, including translations/config.
const files = [];
for (const root of ['src', 'tests']) {
  const entries = await readdir(root, {recursive: true, withFileTypes: true});
  files.push(...entries.filter(item => item.isFile()).map(item => resolve(item.parentPath, item.name)));
}
files.push(...[
  'package.json', 'package-lock.json', 'next.config.ts', 'tsconfig.json',
  'eslint.config.mjs', 'playwright.config.ts', 'vitest.config.mts'
].map(file => resolve(file)));
files.sort();
const restored = createHash('sha256');
const current = createHash('sha256');
for (const file of files) {
  const name = relative(process.cwd(), file);
  const contents = await readFile(file);
  restored.update(name).update(before[name] ?? contents);
  current.update(name).update(contents);
}
assert.equal(files.length, baseline.files);
assert.equal(restored.digest('hex'), baseline.sha256, 'Change outside cleanup scope');
const report = {
  checks,
  baselineScopeRestored: true,
  fingerprintFiles: files.length,
  currentSha256: current.digest('hex')
};
await writeFile(`${directory}/semantic-equivalence.json`, JSON.stringify(report, null, 2) + '\n');
console.log(JSON.stringify(report));
