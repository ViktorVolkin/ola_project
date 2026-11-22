import {createHash} from "node:crypto";
import {existsSync, readFileSync} from "node:fs";
import {resolve} from "node:path";
import {expect, test} from "vitest";

test("supplied development assets exist in the checkout and match the manifest", () => {
  const manifestPath = resolve("docs/assets-manifest.json");
  expect(existsSync(manifestPath), "Asset manifest must ship with the project").toBe(true);
  const manifest: {path: string; bytes: number; sha256: string}[] =
    JSON.parse(readFileSync(manifestPath, "utf8"));
  expect(manifest.length).toBeGreaterThan(0);
  expect(new Set(manifest.map((asset) => asset.path)).size).toBe(manifest.length);

  for (const asset of manifest) {
    expect(asset.path).toMatch(/^assets\//);
    expect(asset.path).not.toContain("..");
    const path = resolve("public", asset.path);
    expect(existsSync(path), asset.path).toBe(true);
    const bytes = readFileSync(path);
    expect(bytes.length, asset.path).toBe(asset.bytes);
    expect(createHash("sha256").update(bytes).digest("hex"), asset.path).toBe(asset.sha256);
  }
});
