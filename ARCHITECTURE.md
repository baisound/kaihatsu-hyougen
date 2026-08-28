# ARCHITECTURE.md

## 全体構成

このリポジトリは、静的ブランドサイトと、そのトップページを素材にしたRemotion動画プロジェクトを分離して管理する。

```text
kaihatsu-hyougen/
├─ public/                  # Web公開ルート
│  ├─ index.html            # トップページ
│  ├─ pages/                # 下層ページ
│  ├─ css/                  # 共通スタイル
│  ├─ scripts/              # 共通クライアント処理
│  └─ images/assets/        # サイト画像
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
public/index.html
  ├─ public/css/styles.css
  ├─ public/scripts/script.js
  ├─ public/images/assets/*
  └─ public/pages/*.html

public/pages/*.html
  ├─ public/css/styles.css
  ├─ public/css/subpages.css
  ├─ public/scripts/script.js
  └─ public/images/assets/*

video-top/scripts/capture.cjs
  └─ HTTP配信中の public/index.html

video-top/src/*
  └─ video-top/public/top-page.webm
```

サイト側から動画の生成物へ依存させない。動画側は公開中のトップページを入力として扱う。

## URLとファイル配置

現在の公開URLは、`public/` をドキュメントルートにした相対パスを前提とする。

- `/index.html`
- `/pages/services.html`
- `/pages/about-isamu.html`
- `/pages/contact.html`

将来、URLを短くする場合は `public/services/index.html` のようなディレクトリ形式へ一括移行し、混在させない。

## 共有部品

現時点ではビルド工程を持たない静的HTMLのため、ヘッダーとフッターは各HTMLに存在する。変更時は全ページを同時に更新する。

ページ数が増える段階で、Eleventy、Astro等の静的サイト生成へ移行し、共通レイアウトをテンプレート化することを推奨する。移行前にフレームワークを追加してはならない。

