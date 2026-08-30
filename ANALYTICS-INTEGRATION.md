# Analytics / GTM 統合前チェック

Analytics専用タスクの最終commitは `7d72bc9`（`d048872` を含む）。専用worktreeは `kaihatsu-hyougen-analytics`、branchは `codex/analytics-tag-injection`。

## 維持する実装境界

- GTMは共有partial `analytics-head.njk` と `analytics-body.njk` から各ページ1組だけ挿入する。
- 直接の `gtag` は追加しない。
- 通常のローカルビルドでは計測を無効にする。
- 本番ビルドはRepository Variable `GTM_CONTAINER_ID` を使用し、未設定または形式不正なら失敗させる。
- `contact_form_open` はGoogle Formを開いたマイクロコンバージョンであり、送信完了や実リード数ではない。
- LP側のCTAは安定した `data-cta-id` で識別する。

## 公開前・公開後ゲート

1. `cta_click`、`contact_form_open`、`select_content` とカスタムパラメータがLocal GA4へ届くことを確認する。
2. Local計測がProduction測定IDへ送られていないことを記録する。
3. 本番hostnameだけがProduction GA4へ送信されることを公開後に確認する。
4. 本番公開とGTM公開は、ユーザーから明示的な許可を得た場合だけ行う。
5. 週次提案はProductionデータが蓄積してから行い、観測、仮説、変更案、期待KPI、検証期間、確度を分ける。

現時点ではGTMコンテナとバージョンは未公開。上記の実受信QAも未完了であり、PASSとして扱わない。
