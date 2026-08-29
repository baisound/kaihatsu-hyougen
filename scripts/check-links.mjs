import path from "node:path";
import { access, readFile, readdir } from "node:fs/promises";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const outputDirectory = path.resolve(repositoryRoot, process.argv[2] ?? "_site");
const issues = [];

async function collectHtmlFiles(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const entryPath = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await collectHtmlFiles(entryPath));
    if (entry.isFile() && entry.name.endsWith(".html")) files.push(entryPath);
  }

  return files;
}

async function exists(targetPath) {
  try {
    await access(targetPath);
    return true;
  } catch {
    return false;
  }
}

const htmlFiles = await collectHtmlFiles(outputDirectory);

for (const htmlPath of htmlFiles) {
  const html = await readFile(htmlPath, "utf8");
  const references = [...html.matchAll(/(?:href|src|srcset)="([^"]+)"/g)].map((match) => match[1]);

  for (const reference of references) {
    if (/^(?:https?:|mailto:|tel:|javascript:|data:)/.test(reference)) continue;

    const [pathPart, fragment] = reference.split("#", 2);
    let targetPath = pathPart ? path.resolve(path.dirname(htmlPath), pathPart) : htmlPath;

    if (pathPart?.endsWith("/")) targetPath = path.join(targetPath, "index.html");
    if (!(await exists(targetPath))) {
      issues.push(`${path.relative(repositoryRoot, htmlPath)} -> ${reference}`);
      continue;
    }

    if (fragment && path.extname(targetPath) === ".html") {
      const targetHtml = await readFile(targetPath, "utf8");
      const escapedFragment = fragment.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      if (!(new RegExp(`id=["']${escapedFragment}["']`)).test(targetHtml)) {
        issues.push(`${path.relative(repositoryRoot, htmlPath)} -> ${reference} (fragment)`);
      }
    }
  }
}

if (issues.length > 0) {
  console.error("ローカルリンク切れを検出しました:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log(`リンク検査完了: ${htmlFiles.length}ページ / 問題0件`);
}
