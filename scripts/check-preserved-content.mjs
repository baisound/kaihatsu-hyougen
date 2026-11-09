import assert from "node:assert/strict";
import { readFile, readdir } from "node:fs/promises";
import { resolve, dirname, relative, sep } from "node:path";

const root = resolve(import.meta.dirname, "../_site");
const read = (name) => readFile(resolve(root, name), "utf8");
const nav = JSON.parse(await readFile(new URL("../site/_data/brandNav.json", import.meta.url), "utf8"));
const links = (markup) => [...markup.matchAll(/<a\b[^>]*href="([^"]+)"[^>]*>([^<]*)<\/a>/g)].map(([, href, label]) => ({href, label}));
const pages = (await readdir(root, {recursive:true})).filter(f => f.endsWith("index.html"));
for (const page of pages) {
  const html = await read(page);
  const parts = [html.match(/<nav class="desktop-nav"[^>]*>([\s\S]*?)<\/nav>/)?.[1], html.match(/<nav class="mobile-menu"[^>]*>([\s\S]*?)<\/nav>/)?.[1], html.match(/<h2>サイト案内<\/h2>([\s\S]*?)<\/div>/)?.[1]];
  for (const markup of parts) {
    assert.ok(markup, page);
    const targets = links(markup).slice(0, nav.length).map(({label,href}) => {
      const [path, hash] = href.split("#");
      return [label, relative(root, resolve(root, dirname(page), path)).split(sep).join("/") + "/" + (hash ? "#" + hash : "")];
    });
    assert.deepEqual(targets, nav.map(({label,path}) => [label,path]), page);
  }
}
const required = [
  ["skills/", "stack", ["Frontend","Backend","Database","Cloud / Infra","AI / Automation","Video / Audio / Stream","Quality / Operation"]],
  ["skills/", "foundation", ["10件以上","6時間 → 約1分"]],
  ["skills/", "new-fields", ["Faster Whisper","OBS","FFmpeg"]],
  ["about-isamu/", "workspace", ["BLUE Baby Bottle SL","SONY MDR-900ST","Stream Deck","Bauhutte"]],
  ["", "worklog", ["相談","課題整理","設計・試作","実装・制作","検証・公開","運用・改善"]],
  ["portfolio/", "video-library", ["5p5lxTnZsMM","Nzru7QESOsY","CDraJp9VfDk","jcaL6h7cIAY","g0sYiMVvtsw","Bd_-UWqKvbg","KXbszsIY-2E","MwANRLJPk8Y"]],
  ["portfolio/", "awards", ["sRgZwjuOr3A","fvNRYEmh6JQ"]],
];
for (const [route,id,words] of required) {
  const html = await read(route+"index.html");
  const section = html.match(new RegExp('<section\\b[^>]*id="'+id+'"[^>]*>([\\s\\S]*?)</section>'))?.[1];
  for (const word of words) assert.ok(section?.includes(word), route+"#"+id+": "+word);
}
console.log("主要ナビ3箇所の一致: "+pages.length+"ページ / 保存対象の本文・動画: "+required.length+"項目");
