import {readFileSync} from "node:fs";
import {runInNewContext} from "node:vm";
import {expect, it} from "vitest";
import {parsePreviewBalloons} from "@/content/sanity/balloons";

type Field = {name: string; type: string; fields?: Field[]; group?: string};
type Config = {schema: {types: Field[]}; document: {singletons: string[]}};
it("Studio singleton schema covers every resolved fallback field and photo path", () => {
  const original = readFileSync("studio/sanity.config.js", "utf8");
  const script = original.replace(/^import .*;\n/gm, "").replace("export default defineConfig(", "result = defineConfig(");
  expect(script).not.toContain("export default");
  const identity = <T>(value: T): T => value;
  function emptyConfig(): Config | null {return null;}
  const scope = {result: emptyConfig(), defineConfig: identity, defineType: identity, defineField: identity, structureTool: identity, presentationTool: identity, defineLocations: identity, process: {env: {}}, URL};
  runInNewContext(script, scope);
  const config: Config | null = scope.result;
  if (!config) throw Error("Studio config missing");
  expect(config.document.singletons).toContain("balloonsPage");
  const schema = config.schema.types.find(field => field.name === "balloonsPage");
  if (!schema?.fields) throw Error("Balloons fields missing");
  const paths = new Set<string>();
  function visit(fields: Field[], prefix = "") {
    for (const field of fields) {
      const path = prefix ? `${prefix}.${field.name}` : field.name;
      if (field.type === "image" || ["string", "text"].includes(field.type)) paths.add(path);
      if (field.fields) visit(field.fields, path);
    }
  }
  visit(schema.fields);
  for (const locale of ["en", "ru", "sr"] as const) {
    const parsed = parsePreviewBalloons({_id: "balloonsPage", _type: "balloonsPage"}, locale, null);
    for (const path of parsed.fallbackPaths) expect(paths.has(path), path).toBe(true);
  }
  expect(original).toContain("documentId('balloonsPage')");
  for (const locale of ["en", "ru", "sr"]) expect(original).toContain(`href: '/${locale}/balloons'`);
});
