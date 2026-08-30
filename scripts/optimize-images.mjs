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
  "photo-workspace-master-v4",
  "products/bai-video-production/bvp-hero-floating-build",
  "products/bai-video-production/bvp-workflow-before-after",
  "products/bai-video-production/bvp-human-decision",
  "products/bai-video-production/bvp-roadmap-model",
  "products/bai-video-production/bvp-recovery-workspace",
  "products/bai-video-production/bvp-home-v611",
  "products/bai-video-production/bvp-home-routes-v611",
  "products/bai-video-production/bvp-edit-timeline-v611",
  "products/bai-video-production/bvp-edit-workspace-v611",
  "products/bai-video-production/bvp-export-v611",
  "products/bai-video-production/bvp-world-lock-v611",
  "products/placeholder-make-tiktok-gift-master",
  "products/placeholder-bai-voice-app",
  "products/placeholder-bai-creative-os",
  "products/placeholder-bai-davinci-extends",
  "products/placeholder-creator-streaming",
  "products/placeholder-bai-development-os",
  "products/placeholder-bai-knowledge-hub",
  "products/placeholder-bai-development-hub"
];

const svgSourceNames = sourceNames.filter((name) => name.includes("placeholder-"));

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

async function ensurePngFromSvg(sourceName) {
  const svgPath = path.join(assetDirectory, `${sourceName}.svg`);
  const pngPath = path.join(assetDirectory, `${sourceName}.png`);
  if (await needsUpdate(svgPath, pngPath)) {
    await sharp(svgPath, { density: 144 }).png({ compressionLevel: 9 }).toFile(pngPath);
  }
}

await Promise.all(svgSourceNames.map(ensurePngFromSvg));
const results = await Promise.all(sourceNames.map(convert));
const generatedCount = results.reduce((total, result) => total + result.generated, 0);
console.log(`画像派生を確認しました: ${sourceNames.length}原本 / ${generatedCount}ファイル更新`);
