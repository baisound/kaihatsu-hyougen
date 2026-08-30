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
    if (entry.isDirectory()) return findPages(path);
    return entry.name.endsWith(".njk") ? [path] : [];
  }));
  return nested.flat();
};

const sourceTemplates = await findPages(sourceDir);
const pageFiles = [];
for (const file of sourceTemplates) {
  const source = await readFile(file, "utf8");
  if (source.includes("<!doctype html>")) pageFiles.push(file);
}
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
  const loaderCount = html.split("googletagmanager.com/gtm.js?id=").length - 1;
  const noscriptCount = html.split("googletagmanager.com/ns.html?id=").length - 1;
  const directGaCount = html.split("googletagmanager.com/gtag/js").length - 1;
  const expectedIdCount = expectedId ? html.split(expectedId).length - 1 : 0;
  const consentApiCount = html.split("siteAnalyticsConsent=").length - 1;
  const consentPanelCount = html.split("data-consent-panel").length - 1;
  const analyticsDeniedCount = html.split("analytics_storage:choice==='granted'?'granted':'denied'").length - 1;

  if (expectDisabled) {
    if (loaderCount !== 0 || noscriptCount !== 0 || directGaCount !== 0 || expectedIdCount !== 0 || consentPanelCount !== 0) {
      throw new Error(`${file}: disabled buildに計測コードがあります。GTM loader=${loaderCount}, noscript=${noscriptCount}, direct gtag=${directGaCount}, ID=${expectedIdCount}, consent panel=${consentPanelCount}`);
    }
    continue;
  }

  if (loaderCount !== 1 || noscriptCount !== 0 || expectedIdCount !== 1 || directGaCount !== 0 || consentApiCount !== 1 || consentPanelCount !== 1 || analyticsDeniedCount !== 1) {
    throw new Error(`${file}: GTM loader=${loaderCount}, noscript=${noscriptCount}, expected ID=${expectedIdCount}, direct gtag=${directGaCount}, consent API=${consentApiCount}, consent panel=${consentPanelCount}, denied default=${analyticsDeniedCount}`);
  }
}

if (expectDisabled) {
  console.log(`${pageFiles.length}テンプレートが共有partialを参照し、通常ローカル生成${htmlFiles.length} HTMLはGTM/gtag 0件です。`);
} else {
  console.log(`${pageFiles.length}テンプレートが共有partialを各1回参照し、${htmlFiles.length} HTMLは同意前GTM未読込・広告同意拒否・${expectedId}の許可後loader各1件・直接gtag 0件です。`);
}
