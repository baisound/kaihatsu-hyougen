import path from "node:path";
import { access, stat } from "node:fs/promises";
import sharp from "sharp";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const assetDirectory = path.join(repositoryRoot, "site", "images", "assets");

const sourceNames = [
  "photo-development-v4",
  "photo-expression-v4",
  "photo-baivoice-v4",
  "photo-channel-behind-v4",
  "photo-baisound-v4",
  "photo-workspace-master-v4"
];

async function needsUpdate(sourcePath, outputPath) {
  try {
    await access(outputPath);
    const [source, output] = await Promise.all([stat(sourcePath), stat(outputPath)]);
    return source.mtimeMs > output.mtimeMs;
  } catch {
    return true;
  }
}

async function convert(sourceName) {
  const sourcePath = path.join(assetDirectory, `${sourceName}.png`);
  const webpPath = path.join(assetDirectory, `${sourceName}.webp`);
  const avifPath = path.join(assetDirectory, `${sourceName}.avif`);

  const tasks = [];

  if (await needsUpdate(sourcePath, webpPath)) {
    tasks.push(
      sharp(sourcePath)
        .rotate()
        .webp({ quality: 84, effort: 6, smartSubsample: true })
        .toFile(webpPath)
    );
  }

  if (await needsUpdate(sourcePath, avifPath)) {
    tasks.push(
      sharp(sourcePath)
        .rotate()
        .avif({ quality: 62, effort: 6, chromaSubsampling: "4:4:4" })
        .toFile(avifPath)
    );
  }

  await Promise.all(tasks);
  return { sourceName, generated: tasks.length };
}

const results = await Promise.all(sourceNames.map(convert));
const generatedCount = results.reduce((total, result) => total + result.generated, 0);
console.log(`画像派生を確認しました: ${sourceNames.length}原本 / ${generatedCount}ファイル更新`);
