import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { ESLint } from "eslint";
import configured from "../../../../eslint.config.mjs";

const root = process.cwd();
const out = path.join(root, "docs/qa/quality/lint-scope-001");
await mkdir(out, { recursive: true });

// Public ESLint API; overrideConfigFile:true prevents a second config-file load.
const currentConfig = configured;
const ignoreEntry = currentConfig.find((entry) =>
  Array.isArray(entry?.ignores) && entry.ignores.includes("**/.next/**"),
);
if (!ignoreEntry) throw new Error("Could not locate configured **/.next/** global ignore");
const beforeConfig = currentConfig.map((entry) => {
  if (entry !== ignoreEntry) return entry;
  return { ...entry, ignores: entry.ignores.filter((pattern) => pattern !== "**/.next/**") };
});

const eslintOptions = (overrideConfig) => ({
  cwd: root,
  overrideConfigFile: true,
  overrideConfig,
  errorOnUnmatchedPattern: false,
});
const before = new ESLint(eslintOptions(beforeConfig));
const after = new ESLint(eslintOptions(currentConfig));
const sourcePaths = [
  "src/app/[locale]/page.tsx",
  "src/components/widgets/WeddingsBlocks/WeddingsHeroBlock/WeddingsHeroBlock.tsx",
  "tests/unit/enquiry-url.test.ts",
  "tests/fixtures/action-button/i18n/request.ts",
  "docs/qa/quality/lint-scope-001/verify-lint-scope.mjs",
  "docs/qa/bouquet-detail/preview-visual-001/controls-finish-001/controls.spec.ts",
  "docs/qa/model-benchmark/20261102T140126Z/verify.cjs",
];
const ignored = async (engine, file) => engine.isPathIgnored(path.resolve(root, file));
const checks = {};
const generated = "tests/fixtures/action-button/.next/standalone/tests/fixtures/action-button/.next/package.json";
checks.generatedNestedNextIgnored = await ignored(after, generated);
checks.sourcesNotIgnored = {};
for (const file of sourcePaths) checks.sourcesNotIgnored[file] = !(await ignored(after, file));
const negative = await after.lintText("const = ;\n", {
  filePath: path.resolve(root, "src/components/widgets/HandwrittenNegativeControl.ts"),
});
checks.negativeControlHasRealError = negative.some((result) =>
  result.messages.some((message) => message.severity === 2 && message.message !== "File ignored because of a matching ignore pattern."),
);
checks.negativeControlMessages = negative.flatMap((result) => result.messages.map(({ ruleId, message, fatalError }) => ({ ruleId, message, fatalError: Boolean(fatalError) })));

const summarize = async (engine, label) => {
  const results = await engine.lintFiles(["."]);
  const output = {
    label,
    diagnostics: results.reduce((sum, item) => sum + item.messages.length, 0),
    errors: results.reduce((sum, item) => sum + item.errorCount, 0),
    warnings: results.reduce((sum, item) => sum + item.warningCount, 0),
    filesWithDiagnostics: results.filter((item) => item.messages.length).length,
    files: results.filter((item) => item.messages.length).map((item) => ({
      filePath: path.relative(root, item.filePath),
      errorCount: item.errorCount,
      warningCount: item.warningCount,
      diagnostics: item.messages.map((message) => ({
        ruleId: message.ruleId, severity: message.severity,
        line: message.line, column: message.column, message: message.message,
      })),
    })),
    byPathAndRule: {},
  };
  for (const item of results) for (const message of item.messages) {
    const file = path.relative(root, item.filePath);
    summarizeGroup(output.byPathAndRule, file, message.ruleId ?? "<parser>", message.severity);
  }
  return output;
};
function summarizeGroup(groups, file, rule, severity) {
  const key = `${file}\t${rule}\t${severity}`;
  groups[key] = (groups[key] ?? 0) + 1;
}
const beforeResult = await summarize(before, "controlled-before-config");
const afterResult = await summarize(after, "actual-configured-after");
const data = {
  method: "Controlled same-source comparison: exported current flat config in memory with only **/.next/** global ignore removed for BEFORE; configured current export unchanged for AFTER. Not a historical invocation.",
  api: "ESLint class public API: overrideConfigFile:true, overrideConfig, isPathIgnored, lintText, lintFiles.",
  checks,
  before: beforeResult,
  after: afterResult,
};
await writeFile(path.join(out, "machine-results.json"), `${JSON.stringify(data, null, 2)}\n`);
console.log(JSON.stringify({ method: data.method, checks, before: { errors: beforeResult.errors, warnings: beforeResult.warnings, diagnostics: beforeResult.diagnostics, filesWithDiagnostics: beforeResult.filesWithDiagnostics }, after: { errors: afterResult.errors, warnings: afterResult.warnings, diagnostics: afterResult.diagnostics, filesWithDiagnostics: afterResult.filesWithDiagnostics }, changedConfigCounts: { errors: afterResult.errors - beforeResult.errors, warnings: afterResult.warnings - beforeResult.warnings } }, null, 2));
