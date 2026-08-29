# AGENTS.md

## 作業対象

このリポジトリを「開発と表現」ブランドサイトとトップページ動画の唯一の正本とする。

- リポジトリ：`D:\Data\Projects\【開発ｘ表現 裏側ｃｈーOPxED】\07-会社ブランド\html\kaihatsu-hyougen`
- 編集元：`site/`
- 生成サイト：`_site/`（Git管理外）
- トップページ：`site/index.njk`
- 下層ページ：`site/<route>/index.njk`
- 共通部品：`site/_includes/partials/`
- 共通CSS：`site/css/`
- 共通JavaScript：`site/scripts/`
- 画像：`site/images/assets/`
- 動画プロジェクト：`video-top/`

旧 `html-v2` など、リポジトリ外の複製を編集してはならない。

## 表記とブランド

- 主体は個人事業の屋号「開発と表現」。法人・株式会社・スタジオ所有を示す表現は使用しない。
- 公開上の活動名は「いさむ」。実名は掲載しない。
- 「開発」はシアン、「表現」はオレンジ、接続を表す「と／×」はバイオレットを使う。
- 基本メッセージは「開発から表現まで、仕事がつながる過程を見せる。」

## パス規約

- トップから共有資産へは `css/`、`scripts/`、`images/assets/` を使う。
- 下層ページは `/<route>/` のディレクトリURLとし、`.html` URLへ戻さない。
- 下層ページからトップ・共有資産へは `../` を1回だけ使う。
- ヘッダーとフッターは各ページへ複製せず、`site/_includes/partials/` を更新する。
- 外部公開を想定し、`file://` ではなく `pnpm serve` で生成サイトを確認する。
- ファイル移動後は、HTMLの `href`、`src`、フラグメントIDを必ず検査する。

## 変更時の確認

1. `git status --short` で既存変更を確認する。
2. `pnpm check` で画像派生、ロゴ同期、ビルド、リンク検査を実行する。
3. PC幅とスマートフォン幅でトップ・変更した下層ページを確認する。
4. ブラウザのコンソールエラーと画像読み込み失敗を確認する。
5. `CHANGELOG.md` の `Unreleased` を更新する。

## 生成物

- `video-top/out/`、`video-top/public/capture/`、`video-top/public/top-page.webm` は再生成可能な成果物としてGit管理しない。
- `_site/` と `node_modules/` は再生成可能なためGit管理しない。
- 写真のPNGは原本、同名のAVIF/WebPは配信用派生として管理する。
- `video-top/public/company-wordmark.png` は `site/images/assets/company-wordmark.png` から同期し、直接編集しない。
- 完成動画をリリース資産として保存する場合は、通常コミットではなく明示的な配布方法を決める。
- 生成物を削除する場合は、ユーザーの明示的な許可を得る。
