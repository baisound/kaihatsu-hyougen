# Analytics / GTM 統合状態と運用チェック

Analytics専用タスクの最終commitは `7d72bc9`（`d048872` を含む）。専用worktreeは `kaihatsu-hyougen-analytics`、branchは `codex/analytics-tag-injection`。

共有partialと検査は制作ブランチへ統合済み。通常ローカルでは無効。GTMバージョン2 `v1｜本番・ローカル分離計測` は2026-08-31に公開した。

## 維持する実装境界

- GTMは共有partial `analytics-head.njk` と `analytics-body.njk` から各ページ1組だけ挿入する。
- 直接の `gtag` は追加しない。
- 通常のローカルビルドでは計測を無効にする。
- アクセス解析はBasic Consent Modeとし、利用者が許可するまでGTMコンテナを読み込まない。
- 広告保存、広告向けユーザーデータ、広告パーソナライズは常に拒否する。
- 同意は180日保存し、フッターから変更できる。拒否してもサイト利用を制限しない。
- 本番ビルドはRepository Variable `GTM_CONTAINER_ID` を使用し、未設定または形式不正なら失敗させる。
- `contact_form_open` はGoogle Formを開いたマイクロコンバージョンであり、送信完了や実リード数ではない。
- LP側のCTAは安定した `data-cta-id` で識別する。

## 公開・運用ゲート

1. `cta_click`、`contact_form_open`、`select_content` とカスタムパラメータがLocal GA4へ届くことを、接続を維持したTag AssistantとGA4 DebugViewの両方で確認する。
2. LocalページでLocal Googleタグだけが発火し、Production Googleタグが発火していないことをTag Assistantへ記録する。
3. 本番hostnameだけがProduction GA4へ送信されることを公開後に確認する。
4. 本番公開とGTM公開は、ユーザーから明示的な許可を得た履歴を残して行う。
5. 週次提案はProductionデータが蓄積してから行い、観測、仮説、変更案、期待KPI、検証期間、確度を分ける。

## 実受信QA（2026-08-31）

- GTM公開前プレビューで、Local Googleタグ `G-H68SYXZ86L` が1回発火し、Production Googleタグ `G-TWNC4EVTYD` が発火していないことをTag Assistantで確認した。
- GA4 DebugViewでLocalストリームへの `page_view` 2件、`session_start` 1件、`user_engagement` 1件を確認した。
- Tag Assistant接続が切れたため、`cta_click`、`contact_form_open`、`select_content` とカスタムパラメータのDebugView実受信は未確認。静的実装検査だけでPASSにせず、GTM公開前ゲートとして残す。
- ローカル判定の除外条件は特定ポートへ固定せず、`localhost` と `127.0.0.1` の任意ポートをLocalとして扱う。

## 本番公開・実受信QA（2026-08-31）

- PR #3をmainへ統合し、GitHub Pages workflow run `33333325342` で全検査とデプロイがPASSした。
- 公開URL `https://baisound.github.io/kaihatsu-hyougen/` で、同意前はGTMを読み込まず、解析同意後に `GTM-NH7W8HHZ` とProduction測定ID `G-TWNC4EVTYD` が読み込まれることを確認した。
- GTMバージョン2 `v1｜本番・ローカル分離計測` を公開し、「ライブ, 最新」であることを確認した。
- GA4リアルタイムで本番ページの `page_view`、`cta_click`、`contact_form_open`、`select_content` を確認した。カスタムイベント3種は各1件を実受信した。
- `contact_form_open` は引き続きフォーム開始のマイクロコンバージョンであり、送信完了や実リード数ではない。
