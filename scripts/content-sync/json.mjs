import ts from 'typescript';

// JSON.parse establishes strict JSON; the AST supplies exact string token offsets.
// Paths are segment arrays, never source searches or dotted-path reconstruction.
export function inspectJSON(text) {
  const value = JSON.parse(text.replace(/^\uFEFF/, ''));
  const source = ts.parseJsonText('dictionary.json', text);
  if (source.parseDiagnostics.length || source.statements.length !== 1) throw Error('Invalid JSON AST');
  const strings = new Map(), dotted = new Map();
  function visit(node, parts) {
    if (ts.isObjectLiteralExpression(node)) {
      const keys = new Set();
      for (const prop of node.properties) {
        if (!ts.isPropertyAssignment(prop) || !ts.isStringLiteral(prop.name)) throw Error('Invalid JSON property');
        const key = prop.name.text;
        if (keys.has(key)) throw Error('Duplicate JSON key');
        if (['__proto__','prototype','constructor'].includes(key)) throw Error('Protected JSON key');
        keys.add(key); visit(prop.initializer, [...parts,key]);
      }
    } else if (ts.isArrayLiteralExpression(node)) node.elements.forEach((item,i)=>visit(item,[...parts,String(i)]));
    else {
      const name = parts.join('.');
      if (dotted.has(name)) throw Error('Ambiguous dotted JSON path');
      dotted.set(name, parts);
      if (ts.isStringLiteral(node)) strings.set(JSON.stringify(parts), {start:node.getStart(source),end:node.end,value:node.text,parts});
    }
  }
  visit(source.statements[0].expression, []);
  return {value,strings,dotted};
}

// Conservative interpolation contract. Plain named ICU arguments (with repeats)
// must match exactly; complex ICU grammar is deliberately blocked, not rewritten.
export function placeholders(value) {
  const result = [];
  // ICU treats a single apostrophe immediately before a brace as quoting syntax,
  // but doubled apostrophes as a literal apostrophe. Fail closed on brace quoting
  // rather than pretending that arguments inside the quoted text are substituted.
  // Ordinary prose apostrophes (don't / l'amour / O'Brien) remain supported.
  for (let i=0;i<value.length;i++) {
    if (value[i]!=="'") continue;
    if (value[i+1]==="'") { i++; continue; }
    if (/[{}]/.test(value[i+1] || '')) throw Error('Quoted ICU braces require manual review');
  }
  const rest = value.replace(/\{([A-Za-z_][A-Za-z0-9_]*)\}/g, (_,name)=>{result.push(name); return '';});
  if (/[{}]/.test(rest)) throw Error('Complex or malformed ICU requires manual review');
  return result.sort();
}
export function validText(value) {
  return typeof value === 'string' && !!value.trim() && value.length <= 10000 && !/[<>]/.test(value);
}
export function replaceTokens(text, changes) {
  const parsed = inspectJSON(text), edits = [];
  for (const change of changes) {
    const token = parsed.strings.get(JSON.stringify(change.segments));
    if (!token || token.value !== change.old) throw Error('Missing or stale string destination');
    edits.push({...token, replacement:JSON.stringify(change.new)});
  }
  edits.sort((a,b)=>b.start-a.start);
  for (let i=0;i<edits.length;i++) {
    if (i && edits[i].end > edits[i-1].start) throw Error('Overlapping destination');
    text = text.slice(0,edits[i].start)+edits[i].replacement+text.slice(edits[i].end);
  }
  const after = inspectJSON(text);
  for (const change of changes) if (after.strings.get(JSON.stringify(change.segments))?.value !== change.new) throw Error('JSON verification failed');
  return text;
}
