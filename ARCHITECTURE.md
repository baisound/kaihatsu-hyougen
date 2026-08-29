# ARCHITECTURE.md

## 全体構成

このリポジトリは、Eleventyで生成する静的ブランドサイトと、そのトップページを素材にしたRemotion動画プロジェクトを分離して管理する。

```text
kaihatsu-hyougen/
├─ site/                    # Webサイトの編集元
│  ├─ index.njk             # トップページ
│  ├─ services/             # 支援領域
│  ├─ about-isamu/          # つくる人
│  ├─ contact/              # 相談する
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
- `/about-isamu/`
- `/contact/`

## 共有部品

ヘッダーは `site/_includes/partials/header.njk`、フッターは `site/_includes/partials/footer.njk` を正本とする。ページごとの差分は `pageKey` と `rootPath` のFront Matterで制御する。

写真は確定済みPNGを原本とし、`scripts/optimize-images.mjs` が同じベース名のAVIF/WebPを生成する。HTMLは `picture` のAVIF、WebP、PNGの順でフォールバックする。

動画用ワードマークは `site/images/assets/company-wordmark.png` を正本とし、`scripts/sync-video-assets.mjs` が `video-top/public/` へ同期する。
