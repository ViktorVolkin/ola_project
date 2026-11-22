import {readFileSync, readdirSync} from "node:fs";
import {dirname, join, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import ts from "typescript";
import {expect, test} from "vitest";

const src = fileURLToPath(new URL("../../src", import.meta.url));
const files = readdirSync(src, {recursive: true, withFileTypes: true})
  .filter(entry => entry.isFile())
  .map(entry => join(entry.parentPath, entry.name));
const layers = ["app", "components/pages", "components/widgets", "components/shared"];
const layerOf = (path: string) => layers.findIndex(layer => relative(src, path).startsWith(`${layer}/`));

function parse(path: string) {
  return ts.createSourceFile(path, readFileSync(path, "utf8"), ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);
}

test("source imports preserve app → pages → widgets → shared", () => {
  for (const file of files.filter(file => /\.tsx?$/.test(file))) {
    const layer = layerOf(file);
    if (layer < 0) continue;
    for (const statement of parse(file).statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      const target = specifier.startsWith("@/") ? join(src, specifier.slice(2))
        : specifier.startsWith(".") ? resolve(dirname(file), specifier) : null;
      if (!target) continue;
      const targetLayer = layerOf(target);
      if (targetLayer >= 0) expect(targetLayer, `${relative(src, file)} → ${specifier}`).toBeGreaterThanOrEqual(layer);
    }
  }
});

test("pages compose named widget blocks instead of section markup", () => {
  for (const [page, sectionCount] of [["Home", 6], ["About", 6], ["Weddings", 6], ["Balloons", 5]] as const) {
    const file = join(src, `components/pages/${page}Page/${page}Page.tsx`);
    const tree = parse(file);
    const blocks: string[] = [];
    const nativeTags: string[] = [];
    function visit(node: ts.Node) {
      if (ts.isJsxOpeningElement(node) || ts.isJsxSelfClosingElement(node)) {
        const tag = node.tagName.getText(tree);
        if (/^[a-z]/.test(tag)) nativeTags.push(tag);
        // Draft-only status widgets are not public editorial sections.
        else if (!((page === "Home" || page === "About") && tag === `${page}PreviewStatus`)) blocks.push(tag);
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
    expect(nativeTags).toEqual(["main"]);
    expect(blocks).toHaveLength(sectionCount);
    expect(blocks.every(name => name.startsWith(page) && name.endsWith("Block"))).toBe(true);
  }
});

test("authored styles use CSS Modules, not global CSS or Tailwind", () => {
  const styles = files.filter(file => file.endsWith(".css"));
  expect(styles.length).toBeGreaterThan(0);
  for (const file of styles) {
    expect(file).toMatch(/\.module\.css$/);
    expect(readFileSync(file, "utf8")).not.toMatch(/@theme|@import\s+["']tailwindcss/);
  }
});

test("explicit CSS Module class usages have corresponding selectors", () => {
  for (const file of files.filter(file => file.endsWith(".tsx"))) {
    const tree = parse(file);
    const modules = new Map<string, Set<string>>();
    for (const statement of tree.statements) {
      if (!ts.isImportDeclaration(statement) || !ts.isStringLiteral(statement.moduleSpecifier)) continue;
      const specifier = statement.moduleSpecifier.text;
      const binding = statement.importClause?.name?.text;
      if (!binding || !specifier.endsWith(".module.css")) continue;
      const stylesheetPath = specifier.startsWith("@/") ? join(src, specifier.slice(2)) : resolve(dirname(file), specifier);
      const stylesheet = readFileSync(stylesheetPath, "utf8");
      modules.set(binding, new Set([...stylesheet.matchAll(/\.([A-Za-z_][\w-]*)/g)].map(match => match[1])));
    }
    function visit(node: ts.Node) {
      if (ts.isPropertyAccessExpression(node) && ts.isIdentifier(node.expression)) {
        const selectors = modules.get(node.expression.text);
        if (selectors) expect(selectors.has(node.name.text), `${relative(src, file)}: ${node.getText(tree)}`).toBe(true);
      }
      ts.forEachChild(node, visit);
    }
    visit(tree);
  }
});
