import {fileURLToPath} from "node:url";
import {defineConfig} from "vitest/config";

export default defineConfig({
  resolve: {alias: {"@": fileURLToPath(new URL("../../../../../src", import.meta.url))}},
  test: {include: ["docs/qa/bouquets/parts/inspiration/widget.test.tsx"]}
});
