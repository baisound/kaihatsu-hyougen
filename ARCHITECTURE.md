# ARCHITECTURE.md

## 全体構成

このリポジトリは、Eleventyで生成する静的ブランドサイトと、そのトップページを素材にしたRemotion動画プロジェクトを分離して管理する。

```text
kaihatsu-hyougen/
├─ site/                    # Webサイトの編集元
│  ├─ index.njk             # トップページ
│  ├─ services/             # 支援領域
│  ├─ products/             # プロダクト全体マップと製品詳細LP
│  ├─ skills/               # 対応スキル
│  ├─ about-isamu/          # いさむについて
│  ├─ contact/              # 相談する
│  ├─ privacy/              # プライバシー・アクセス解析
│  ├─ _data/                # 製品詳細などの構造化本文
│  ├─ _includes/partials/   # 共通ヘッダー・フッター
│  ├─ css/                  # 共通スタイル
│  ├─ scripts/              # 共通クライアント処理
│  └─ images/assets/        # サイト画像
├─ scripts/                 # 画像派生・リンク検査・動画素材同期
├─ _site/                   # Eleventy生成物・Git対象外
├─ video-top/               # トップページPVのソース
│  ├─ src/                  # Remotionコンポジション
│  ├─ scripts/              # Webページ収録処理
│  ├─ public/               # Remotion入力素材
│  └─ out/                  # 生成物・Git対象外
├─ SITE-STRUCTURE.md        # 情報設計と将来ページ
└─ README.md                # 開発・確認手順
```

## 依存方向

```text
site/**/*.njk
  ├─ site/_data/*.json
  ├─ site/_includes/partials/*.njk
  ├─ site/css/*.css
  ├─ site/scripts/script.js
  └─ site/images/assets/*

Eleventy
  └─ _site/**/*

video-top/scripts/capture.cjs
  └─ HTTP配信中の _site/index.html

video-top/src/*
  └─ video-top/public/top-page.webm
```

サイト側から動画の生成物へ依存させない。動画側は公開中のトップページを入力として扱う。

## URLとファイル配置

現在の公開URLは、`_site/` をドキュメントルートにしたディレクトリ形式を前提とする。

- `/`
- `/services/`
- `/products/`
- `/products/bai-video-production/`
- `/products/make-tiktok-gift-master/`
- `/products/bai-voice-app/`
- `/products/bai-creative-os/`
- `/products/bai-davinci-extends/`
- `/products/creator-streaming-tools/`
- `/products/bai-development-os/`
- `/products/bai-knowledge-hub/`
- `/products/bai-development-hub/`
- `/skills/`
- `/about-isamu/`
- `/contact/`
- `/privacy/`

## 共有部品

ヘッダーは `site/_includes/partials/header.njk`、フッターは `site/_includes/partials/footer.njk`、検索・SNS・構造化データは `site/_includes/partials/meta.njk` を正本とする。BAI VIDEO PRODUCTION以外の製品詳細は `site/_data/productDetails.json` を本文の正本、`site/_data/productSeo.json` を検索公開方針、`site/_includes/partials/product-detail.njk` を共通レイアウトとして扱う。

通常のローカルビルドではアクセス解析を無効にする。Analytics専用worktreeの統合時も、GTMは共有partialから各ページ1組だけ挿入し、直接の `gtag` は追加しない。公開前条件は `ANALYTICS-INTEGRATION.md` を参照する。

写真は確定済みPNGを原本とし、`scripts/optimize-images.mjs` が同じベース名のAVIF/WebPを生成する。HTMLは `picture` のAVIF、WebP、PNGの順でフォールバックする。

動画用ワードマークは `site/images/assets/company-wordmark.png` を正本とし、`scripts/sync-video-assets.mjs` が `video-top/public/` へ同期する。
