# Analytics / GTM 統合状態と運用チェック

Analytics専用タスクの最終commitは `7d72bc9`（`d048872` を含む）。専用worktreeは `kaihatsu-hyougen-analytics`、branchは `codex/analytics-tag-injection`。

共有partialと検査は制作ブランチへ統合済み。通常ローカルでは無効。GTMバージョン2 `v1｜本番・ローカル分離計測` は2026-08-31に公開した。

## 維持する実装境界

- GTMは共有partial `analytics-head.njk` と `analytics-body.njk` から各ページ1組だけ挿入する。
- 直接の `gtag` は追加しない。
- 通常のローカルビルドでは計測を無効にする。
- 計測を有効にしたビルドはページ表示時にGTMを読み込む。動画選択は select_content、フォームは contact_form_open、その他のサイト導線は cta_click を各1件送る。
- 広告保存、広告向けユーザーデータ、広告パーソナライズは常に拒否する。
- 設定パネルは表示しない。旧版で保存した拒否は従来の有効期間まで尊重する。
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

## 2026-11-09 公開前版のクリック・動画確認

計測を有効にしたプレビュー全18ページのGTM loaderは各1件、同意パネルは0件。127.0.0.1:4173をブラウザーでリロードして、パネルの非表示とLocal測定ID G-H68SYXZ86Lの読み込みを確認した。通常の計測無効ビルドも pnpm check で検査した。

| 操作 | イベント | GA4通信の確認 |
| --- | --- | --- |
| ページ表示 | page_view | Local収集先で204 |
| 受賞MVを選択 | select_content | youtube_video、sRgZwjuOr3A、204 |
| ヒーローの開発ツール、BVPカードを選択 | cta_click | 各1件。CTA識別子あり、動画IDなし、204 |
| 裏側chのチャンネルを選択 | select_content | youtube_channel、@isamu_dev_art、送信確認。応答未確認 |
| 相談フォームを開く操作 | contact_form_open | contact-form-open、204。フォーム送信は行っていない |

動画は2ページの計21箇所。ユニークな12作品すべてでYouTubeプレーヤーの再生時刻が進んだ。動画選択の計測は再生ボタンの操作を表す。途中・完視聴の計測は含まない。

本番公開URLのHTMLは旧版でGTM-NH7W8HHZと旧設定パネルを確認。今回の変更は公開前版で検証した。GA4管理画面のレポート反映は今回の確認対象外。
