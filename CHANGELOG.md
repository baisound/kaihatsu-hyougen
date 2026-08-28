# CHANGELOG.md

このプロジェクトの主な変更を記録します。形式は Keep a Changelog を参考にし、リリース番号が決まるまでは `Unreleased` に集約します。

## [Unreleased]

### Added

- `public/pages/` に支援領域、つくる人、相談する下層ページを追加。
- 下層ページ共通の「Connection Trace」デザインを追加。
- Git運用向けの `AGENTS.md`、`AGENT.md`、`CODEX.MD`、`ARCHITECTURE.md`、`CONTRIBUTING.md`、`.gitignore`、`.gitattributes` を追加。

### Changed

- Web公開ルートを `public/` として明文化。
- 動画キャプチャが使用する `playwright@1.62.1` を直接devDependencyとして固定。
- CSS、JavaScript、画像、下層ページを用途別フォルダへ整理。
- トップと下層ページの内部導線を新しいフォルダ構成に合わせて更新。
- トップの下層導線を「支援領域」「つくる人」「相談する」へ接続。

### Fixed

- ファイル移動後に発生していたCSS、JavaScript、画像、HTML間の相対パス切れを修正。
- 遅延読み込み可能な下部サムネイルと写真を `loading="lazy"` に変更。
- 画像寸法、現在ページ表示、モバイルメニューのスクロール挙動を改善。
- 下層ページのモバイル大見出しが過剰に折り返される問題を修正。
