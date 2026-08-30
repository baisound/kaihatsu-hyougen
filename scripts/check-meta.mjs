import { readdir, readFile } from "node:fs/promises";
import { join, relative } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL("../_site/", import.meta.url));
const files = [];

async function walk(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) await walk(path);
    else if (entry.name === "index.html") files.push(path);
  }
}

await walk(root);
const seenTitles = new Map();
const issues = [];
const expectedOrigin = "https://baisound.github.io/kaihatsu-hyougen";

for (const file of files) {
  const html = await readFile(file, "utf8");
  const route = relative(root, file).replaceAll("\\", "/").replace(/index\.html$/, "");
  const title = html.match(/<title>([^<]+)<\/title>/)?.[1]?.trim();
  const required = [
    ['meta[name="description"]', /<meta name="description" content="[^"]+">/],
    ['meta[name="robots"]', /<meta name="robots" content="[^"]+">/],
    ["canonical", new RegExp(`<link rel="canonical" href="${expectedOrigin.replaceAll("/", "\\/")}\\/[^"]*">`)],
    ["og:title", /<meta property="og:title" content="[^"]+">/],
    ["og:description", /<meta property="og:description" content="[^"]+">/],
    ["og:image", new RegExp(`<meta property="og:image" content="${expectedOrigin.replaceAll("/", "\\/")}\\/[^"]+">`)],
    ["twitter:card", /<meta name="twitter:card" content="summary_large_image">/],
    ["JSON-LD", /<script type="application\/ld\+json">[\s\S]+?<\/script>/]
  ];
  if (!title) issues.push(`${route || "/"}: title がありません`);
  else if (seenTitles.has(title)) issues.push(`${route || "/"}: title が ${seenTitles.get(title)} と重複しています`);
  else seenTitles.set(title, route || "/");

  for (const [label, pattern] of required) {
    if (!pattern.test(html)) issues.push(`${route || "/"}: ${label} がありません`);
  }

  const blocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]+?)<\/script>/g)];
  for (const block of blocks) {
    try { JSON.parse(block[1]); }
    catch (error) { issues.push(`${route || "/"}: JSON-LDが不正です (${error.message})`); }
  }
}

if (issues.length) {
  console.error(issues.join("\n"));
  process.exit(1);
}

console.log(`Meta検査完了: ${files.length}ページ / title重複0 / 必須Meta欠落0 / JSON-LD不正0`);
