import {describe, expect, it} from "vitest";
import {readFileSync} from "node:fs";
import {bouquetTextKeys, parseBouquets, type BouquetCopy} from "@/content/sanity/bouquets";

const keys = ["seasonalSpring", "seasonalSummer", "seasonalAutumn", "seasonalWinter"] as const;
const local = Object.fromEntries(bouquetTextKeys.map(key => [key, key])) as BouquetCopy;
const photos = Object.fromEntries(keys.map((key, i) => [key, {asset: {_ref: `image-${String(i + 1).repeat(40)}-1200x900-jpg`}}]));

describe("independent seasonal CMS photos", () => {
  it("accepts four distinct validated images and exposes four Studio upload fields", () => {
    const result = parseBouquets({_id: "bouquetsPage", _type: "bouquetsPage", ...photos}, "en", local)!;
    for (const [i, key] of keys.entries()) expect(result.images).toHaveProperty(key, expect.objectContaining({src: expect.stringContaining(String(i + 1).repeat(40))}));
    const studio = readFileSync("studio/sanity.config.js", "utf8");
    for (const key of keys) expect(studio).toContain(key);
  });
});
