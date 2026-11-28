import {readFileSync, readdirSync} from "node:fs";
import {join} from "node:path";

/** Include both traditional and range-syntax viewport composition queries. */
export function currentLayoutBoundaries() {
  const root = join(process.cwd(), "src/components/widgets");
  return [...new Set(readdirSync(root, {recursive: true, withFileTypes: true})
    .filter(entry => entry.isFile() && entry.name.endsWith(".module.css"))
    .flatMap(entry => [...readFileSync(join(entry.parentPath, entry.name), "utf8").matchAll(/@media\s*([^{}]+)\{/g)]
      .flatMap(query => [...query[1].matchAll(/(?:(min|max)-width:\s*(\d+)px|width\s*([<>]=?)\s*(\d+)px)/g)]
        .map(match => match[1]
          ? Number(match[2]) + (match[1] === "max" ? 1 : 0)
          : Number(match[4]) + (match[3] === ">" ? 1 : 0)))))].sort((a, b) => a - b);
}
