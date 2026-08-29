import path from "node:path";
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { createHash } from "node:crypto";

const repositoryRoot = path.resolve(import.meta.dirname, "..");
const sourcePath = path.join(repositoryRoot, "site", "images", "assets", "company-wordmark.png");
const destinationPath = path.join(repositoryRoot, "video-top", "public", "company-wordmark.png");
const checkOnly = process.argv.includes("--check");

function digest(buffer) {
  return createHash("sha256").update(buffer).digest("hex");
}

const source = await readFile(sourcePath);
let destination = null;

try {
  destination = await readFile(destinationPath);
} catch {
  // 同期先がない場合は、通常実行時に新規作成する。
}

const synchronized = destination !== null && digest(source) === digest(destination);

if (synchronized) {
  console.log("動画用ロゴはサイト正本と同期済みです。");
} else if (checkOnly) {
  console.error("動画用ロゴがサイト正本と一致しません。pnpm sync:video-assets を実行してください。");
  process.exitCode = 1;
} else {
  await mkdir(path.dirname(destinationPath), { recursive: true });
  await copyFile(sourcePath, destinationPath);
  console.log("動画用ロゴをサイト正本から同期しました。");
}
