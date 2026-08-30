# 開発と表現 ブランドサイト

個人事業の屋号「開発と表現」のブランドサイトと、トップページを素材にしたプロモーション動画を管理するリポジトリです。

公開上の活動名は「いさむ」です。法人・株式会社・スタジオ所有を示す表現は使用していません。

## 正本

今後のWebサイト・下層ページ・トップページ動画の変更は、このリポジトリで行います。

```text
D:\Data\Projects\【開発ｘ表現 裏側ｃｈーOPxED】\07-会社ブランド\html\kaihatsu-hyougen
```

旧フォルダの複製は参照用であり、更新対象ではありません。

## ディレクトリ

```text
site/
├─ index.njk                  # トップページの正本
├─ services/index.njk         # 支援領域
├─ products/index.njk         # 状況と用途で選ぶプロダクト案内
├─ products/*/index.njk       # 製品・制作基盤・開発基盤の詳細LP
├─ _data/productDetails.json  # 共通詳細LPの製品別本文
├─ _data/productSeo.json      # 製品詳細ごとの検索表示・公開方針
├─ skills/index.njk           # いさむに任せられる仕事と経験
├─ about-isamu/index.njk      # つくる人
├─ contact/index.njk          # 相談する
├─ privacy/index.njk          # プライバシー・アクセス解析
├─ _includes/partials/        # 共通ヘッダー・フッター・Meta
├─ css/
│  ├─ styles.css              # サイト共通
│  └─ subpages.css            # 下層ページ共通
├─ scripts/script.js          # 表示・メニュー・モーション
└─ images/assets/             # ロゴ、写真、YouTubeサムネイル

scripts/                      # 画像最適化・リンク検査・動画素材同期
_site/                        # Eleventy生成物・Git対象外
video-top/                    # RemotionによるトップページPV
```

詳しい依存関係は [`ARCHITECTURE.md`](ARCHITECTURE.md)、今後のページ計画は [`SITE-STRUCTURE.md`](SITE-STRUCTURE.md) を参照してください。

## ローカル確認

依存関係を導入し、Eleventyで生成・配信します。

```powershell
pnpm install
pnpm serve
```

次のURLを開きます。

- トップ：`http://127.0.0.1:4173/`
- 支援領域：`http://127.0.0.1:4173/services/`
- プロダクト：`http://127.0.0.1:4173/products/`
- 製品詳細：`http://127.0.0.1:4173/products/{製品名}/`
- 対応スキル：`http://127.0.0.1:4173/skills/`
- いさむについて：`http://127.0.0.1:4173/about-isamu/`
- 相談する：`http://127.0.0.1:4173/contact/`
- プライバシー：`http://127.0.0.1:4173/privacy/`

`file://` ではなくHTTP配信で確認してください。相対パス、スクロール移動、動画収録条件を本番に近い状態で確認できます。

完全な検査は次で実行します。

```powershell
pnpm check
```

この処理は写真のAVIF/WebP派生、動画用ロゴ同期、Eleventyビルド、ローカルリンク検査、全ページのMeta・canonical・JSON-LD検査を行います。

## ブランドサイトの内容

- ブランド思想と3つの支援領域
- 利用者向け製品、制作を支える仕組み、開発を支える基盤の3つに分けたプロダクト案内
- BAI VIDEO PRODUCTIONで変わる制作体験、4つの利用工程、開発中の実画面、3段階の開発状況
- 他8製品についても、困りごと、変わる体験、4つの流れ、現在地、対応範囲、FAQを同じ粒度で説明
- 実画面が存在しない製品は架空UIを見せず、役割と情報の流れをHTML図解で表現
- いさむへ任せられる仕事、職務経験の土台、個人開発・研究を区別した対応スキル
- アクセス解析、Cookie、相談フォームの情報利用を説明するプライバシーページ
- 「いさむの開発×表現 裏側ch」と「バイサウンド」の活動紹介
- 各YouTubeチャンネルの代表動画とおすすめコンテンツ
- 実際の制作環境と使用機材
- スクロール表示、微細な揺らぎ、カードのホバー／フォーカス表現

4面モニターは、左上＝ATEM Mini Proを参考にした配信マルチビュー、右上＝OBS、左下＝Codex、右下＝DaVinci Resolveです。

代表動画：

- いさむの開発×表現 裏側ch：`https://www.youtube.com/watch?v=5p5lxTnZsMM`
- バイサウンド：`https://www.youtube.com/watch?v=g0sYiMVvtsw`

YouTubeはエラー153を避けるため、iframeではなくYouTube本体を別タブで開くサムネイルカードにしています。

## トップページ動画

Webページの収録とRemotionレンダーは `video-top/` で行います。

```powershell
cd video-top
pnpm install
pnpm capture
pnpm render
```

`pnpm capture` の前に、リポジトリ直下で `pnpm serve` を実行し、生成サイトを `http://127.0.0.1:4173/` で配信してください。動画用ロゴはルートの `pnpm build` または `pnpm sync:video-assets` でサイト正本から同期されます。

`video-top/out/`、`video-top/public/capture/`、`video-top/public/top-page.webm` は再生成可能なためGit管理外です。

## Git運用

- 作業規約：[`AGENTS.md`](AGENTS.md)
- Codex向け手順：[`CODEX.MD`](CODEX.MD)
- 共同作業：[`CONTRIBUTING.md`](CONTRIBUTING.md)
- 変更履歴：[`CHANGELOG.md`](CHANGELOG.md)
- 構成監査：[`AUDIT.md`](AUDIT.md)
