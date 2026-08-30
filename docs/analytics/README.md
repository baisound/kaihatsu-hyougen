# Google Analytics 計測・レポート設計

## 目的

「開発と表現」ブランドサイトを、企業のWebマーケターや広告代理店が定例確認するリード獲得型サイトとして分析できる状態にする。

## 基本KPI

- 集客：セッション、アクティブユーザー、新規ユーザー
- 品質：エンゲージドセッション、エンゲージメント率、平均エンゲージメント時間
- 成果：キーイベント、セッション キーイベント率
- 切り口：チャネル、参照元／メディア、キャンペーン、ランディングページ、ページ、デバイス

広告費、売上、ROASは連携データが存在する場合だけ表示し、ゼロの飾り指標としては追加しない。

## イベント

| イベント | 発火条件 | 用途 | 本番での扱い |
|---|---|---|---|
| `page_view` | Googleタグの標準計測 | ページ別閲覧 | いいえ |
| `click` | 拡張計測の外部リンククリック | 外部流出先の分析 | いいえ |
| `cta_click` | CTAリンクのクリック | 主要導線の評価 | いいえ |
| `contact_form_open` | 外部Google Formを開く | 相談開始の代理指標 | フォーム開始のマイクロCV |
| `select_content` | YouTubeリンクのクリック | 動画コンテンツ別の関心 | いいえ |

`contact_form_open` はフォーム送信完了ではない。Google Form側の送信完了を同じGA4プロパティへ返せるようになるまでは、「相談開始」のマイクロコンバージョンとして扱う。

GA4のキーイベント指定は、イベントが「最近のイベント」に出現してから行う。ローカルの試験データだけで本番のリード獲得実績と誤認させない。

## カスタムディメンション

| 表示名 | イベント パラメータ |
|---|---|
| CTA ID | `cta_id` |
| CTA位置 | `cta_location` |
| CTAテキスト | `cta_text` |
| サイト環境 | `site_environment` |

URL、ページ、外部リンク先などGA4に既定ディメンションがある項目は重複登録しない。

## GA4専用レポート

公開コレクション名は `Webマーケティング` とし、低トラフィックの初期段階では次の詳細レポートに絞る。

1. 週間サマリー
2. 集客成果（チャネル、参照元／メディア）
3. LP・コンテンツ成果
4. CTA・フォーム開始
5. YouTube・外部リンク

期間は直近7日とその前の7日を比較し、直近28日を補助表示する。指標はセッション、ユーザー、エンゲージメント率、平均エンゲージメント時間、フォーム開始数、セッション単位のフォーム開始率を中心にする。デバイスは独立ページではなく比較軸として使う。

本番定例レポートは `hostname = baisound.github.io` かつ `page path` が `/kaihatsu-hyougen/` で始まるデータだけを対象にする。`contact_form_open` は「フォーム開始数」であり、リード獲得数やフォーム送信完了数とは表記しない。

## 環境分離

| 環境 | 実際のURL | GA4測定ID | 用途 |
|---|---|---|---|
| Production | `https://baisound.github.io/kaihatsu-hyougen/` 以下 | `G-TWNC4EVTYD` | 週次定例レポート |
| Local | `http://localhost:4173/` 以下 | `G-H68SYXZ86L` | 実装・イベント検証 |

GA4のストリーム作成画面はlocalhostをURLとして受理しないため、ローカルストリームの管理URLだけは予約ドメイン `http://local.kaihatsu-hyougen.test/` としている。実際の送信元判定はGTMで `localhost` または `127.0.0.1` を用いる。

## 運用上の境界

- サイトは共通パーシャルから `GTM-NH7W8HHZ` を読み込み、各ページへ同じGTMスニペットを1組だけ出力する。
- ローカル通常ビルドにはGTMを出力しない。明示的に `ANALYTICS_ENABLED=true` と `GTM_CONTAINER_ID` を指定したときだけローカル計測を有効にする。
- GitHub Pages用ビルドはRepository Variable `GTM_CONTAINER_ID` を受け取り、未設定・不正形式なら失敗する。
- GTM側はホスト名によってProduction測定IDとLocal測定IDを振り分ける。直接 `gtag.js` は使用しない。
- Production公開、公開サイトへの反映、公開後の送信確認はこの作業では行わない。
- 内部トラフィック除外はIPが確定してからテスト状態で導入し、確認前に有効化しない。
- Search Console連携は公開ドメインの所有権確認後に行う。
- Looker Studioは実データが蓄積してから、KPIカード、期間推移、チャネル、LP、デバイスの順で構成する。

## QA結果（2026-08-31）

- GTMの未公開バージョン2 `v1｜本番・ローカル分離計測（未公開）` を作成した。公開版は空コンテナのままで、サイトへの配信はしていない。
- 既定の `localhost:4173` は別プロセスが使用中だったため、今回のブラウザQAだけ `localhost:4178` を代替使用した。GTMのローカル許可条件には4173と4178を登録している。
- `/`、`/services/`、`/about-isamu/`、`/contact/` の4ページで、共有GTM scriptを各1件、直接gtagを0件確認した。
- 本番相当ビルド後HTMLは4ページすべてGTM scriptとnoscriptが各1組、`GTM-NH7W8HHZ` が各2箇所、直接gtagが0件。通常ローカルビルドはGTM/gtagとも0件。内部リンク検査は4ページ、問題0件。
- Tag Assistant履歴で `GTM-NH7W8HHZ` とローカル測定ID `G-H68SYXZ86L` を検出した。
- GA4 DebugViewの直前30分に `page_view`、`first_visit`、`session_start` を含む4件のローカル受信を確認した。Tag Assistantの接続が短時間で切れたため、デバッグ端末表示は0のままだった。
- `cta_click`、`contact_form_open`、`select_content` と各カスタムパラメータのLocal GA4実受信は、Tag Assistant接続断により未確認。GTM公開前QAの未完了項目として残す。

## 公開前ゲート

- 計測目的、取得項目、Google Analytics／Cookie利用、問い合わせ先を説明するプライバシーポリシーを用意し、全ページのフッターから到達できるようにする。
- 必要な同意管理の範囲を確認し、同意要否が未確定のままGTMコンテナを公開しない。
- GTM未公開バージョンをProductionへ公開する操作とGitHub Pagesへの反映は、Ownerが別途明示承認した作業でのみ行う。
- 公開後はProductionストリームだけに本番データが入り、Localストリームへ本番データが混入しないことを確認する。

## 操作記録

`setup-captures/` に連番付きPNGを保存する。このフォルダはGit対象外とし、メールアドレス、アカウントIDなどをマスクした複製だけを動画素材に使う。

## 参考

- Google公式：[イベントを設定する](https://developers.google.com/analytics/devguides/collection/ga4/events)
- Google公式：[推奨イベント](https://developers.google.com/analytics/devguides/collection/ga4/reference/recommended-events)
- Google公式：[外部リンククリックを測定する](https://support.google.com/analytics/answer/13566436)
- Google公式：[レポートナビゲーションをカスタマイズする](https://support.google.com/analytics/answer/10460557)
- Google公式：[探索を開始する](https://support.google.com/analytics/answer/7579450)
- YouTube：[GA4レポートをカスタマイズする方法](https://www.youtube.com/watch?v=gxi0yyNIT3Y)
- YouTube：[How to build custom reports in Google Analytics 4](https://www.youtube.com/watch?v=8HTzMfiNAdE)
- note：[Looker StudioでGA4データを可視化する方法](https://note.com/stacker_team/n/nb9214c1469f3)
- note：[GSC × GA4 ダッシュボード構築手順](https://note.com/bookmarkandlight/n/n5d2b9037a964)
