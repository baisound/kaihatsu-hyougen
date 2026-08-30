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
├─ about-isamu/index.njk      # つくる人
├─ contact/index.njk          # 相談する
├─ _includes/partials/        # 共通ヘッダー・フッター・GTM
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
- つくる人：`http://127.0.0.1:4173/about-isamu/`
- 相談する：`http://127.0.0.1:4173/contact/`

`file://` ではなくHTTP配信で確認してください。相対パス、スクロール移動、動画収録条件を本番に近い状態で確認できます。

完全な検査は次で実行します。

```powershell
pnpm check
```

この処理は写真のAVIF/WebP派生、動画用ロゴ同期、Eleventyビルド、ローカルリンク検査を行います。

## Google Analytics

通常のローカルビルドと `pnpm serve` ではGTMを出力せず、Google Analyticsへデータを送信しません。

ローカル計測を明示的に有効にする場合は、GTMのプレビューを開始したうえで次を実行します。トップと3つの下層ページはすべて同じ共通GTMパーシャルを読みます。

```powershell
$env:ANALYTICS_ENABLED = "true"
$env:GTM_CONTAINER_ID = "GTM-NH7W8HHZ"
pnpm serve
```

GitHub Pages用のワークフローはRepository Variable `GTM_CONTAINER_ID` を受け取り、共通テンプレートから全HTMLへGTMを出力します。IDが未設定・不正形式なら本番ビルドは失敗します。

コンテナIDは生成後のHTMLに公開される識別子であり、認証情報ではありません。そのためGitHub Actions SecretではなくRepository Variableで管理します。GA4測定IDはGTM内でホスト名に応じてProductionとLocalへ振り分けます。

## ブランドサイトの内容

- ブランド思想と3つの支援領域
- BaiVoice Studio / AI Development OSの紹介
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
