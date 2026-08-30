import { readdir, readFile } from "node:fs/promises";
import { join } from "node:path";

const outputDir = "_site";
const sourceDir = "site";
const expectDisabled = process.argv.includes("--disabled");
const expectedId = process.env.GTM_CONTAINER_ID?.trim();

if (!expectDisabled && (!expectedId || !/^GTM-[A-Z0-9]+$/.test(expectedId))) {
  throw new Error("check:analytics には有効な GTM_CONTAINER_ID が必要です。");
}

const findHtml = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    return entry.isDirectory() ? findHtml(path) : path.endsWith(".html") ? [path] : [];
  }));
  return nested.flat();
};

const htmlFiles = await findHtml(outputDir);
if (!htmlFiles.length) throw new Error("検査対象のHTMLがありません。");

const findPages = async (directory) => {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(entries.map((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) {
      return entry.name === "_includes" ? [] : findPages(path);
    }
    return entry.name.endsWith(".njk") ? [path] : [];
  }));
  return nested.flat();
};

const pageFiles = await findPages(sourceDir);
for (const file of pageFiles) {
  const source = await readFile(file, "utf8");
  const headIncludeCount = source.split('{% include "partials/analytics-head.njk" %}').length - 1;
  const bodyIncludeCount = source.split('{% include "partials/analytics-body.njk" %}').length - 1;
  const directTagCount = source.split("googletagmanager.com").length - 1;

  if (headIncludeCount !== 1 || bodyIncludeCount !== 1 || directTagCount !== 0) {
    throw new Error(`${file}: shared head=${headIncludeCount}, shared body=${bodyIncludeCount}, direct tag=${directTagCount}`);
  }
}

for (const file of htmlFiles) {
  const html = await readFile(file, "utf8");
  const scriptCount = html.split(`googletagmanager.com/gtm.js?id='+i`).length - 1;
  const noscriptCount = expectedId
    ? html.split(`googletagmanager.com/ns.html?id=${expectedId}`).length - 1
    : html.split("googletagmanager.com/ns.html?id=").length - 1;
  const directGaCount = html.split("googletagmanager.com/gtag/js").length - 1;
  const expectedIdCount = expectedId ? html.split(expectedId).length - 1 : 0;

  if (expectDisabled) {
    if (scriptCount !== 0 || noscriptCount !== 0 || directGaCount !== 0) {
      throw new Error(`${file}: disabled buildにタグがあります。GTM script=${scriptCount}, noscript=${noscriptCount}, direct gtag=${directGaCount}`);
    }
    continue;
  }

  if (scriptCount !== 1 || noscriptCount !== 1 || expectedIdCount !== 2 || directGaCount !== 0) {
    throw new Error(`${file}: GTM script=${scriptCount}, noscript=${noscriptCount}, expected ID=${expectedIdCount}, direct gtag=${directGaCount}`);
  }
}

if (expectDisabled) {
  console.log(`${pageFiles.length}テンプレートが共有partialを参照し、通常ローカル生成${htmlFiles.length} HTMLはGTM/gtag 0件です。`);
} else {
  console.log(`${pageFiles.length}テンプレートが共有partialを各1回参照し、${htmlFiles.length} HTMLに${expectedId}が各2箇所（script/noscript）、直接gtag 0件です。`);
}
