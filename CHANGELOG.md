# CHANGELOG.md

このプロジェクトの主な変更を記録します。形式は Keep a Changelog を参考にし、リリース番号が決まるまでは `Unreleased` に集約します。

## [Unreleased]

### Added

- 全16ページに固有title・description・canonical・OGP・X Card・robots・JSON-LDを追加し、重複・欠落・JSON不正を検出する `check:meta` を追加。
- アクセス解析、Cookie、Google Formで扱う情報を説明する `/privacy/` とフッター導線を追加。
- Analytics統合に備え、主要CTAへ安定した `data-cta-id` を追加。
- 職務経歴書から公開可能な経験と技術領域を再編集し、実務経験と個人開発・研究を分けて示す `/skills/` を追加。
- makeTikTokGiftMaster、BAI VOICE APP、BAI CREATIVE OS、BAI DaVinci EXTENDS、Creator / Streaming Tools、BAI DEVELOPMENT OS、BAI Knowledge Hub、BAI Development Hubの詳細LPを追加。
- 8つの詳細LPで共用する製品データとレイアウトを追加し、困りごと、変わる体験、4つの流れ、現在地、対応範囲、FAQを同じ順序で説明。
- BAI VIDEO PRODUCTIONの困りごと、変わる体験、4工程、実画面、開発状況、FAQを一般視聴者向けに説明する `/products/bai-video-production/` の詳細LPを追加。
- 開発状況を「できていること・いま確かめていること・次に目指すこと」の3段階へ整理し、TASK-051〜063の技術記録は折りたたみ表示へ変更。
- BAI VIDEO PRODUCTIONの実画面から開始経路と編集領域を読みやすく切り出し、AVIF/WebP派生を追加。生成コンセプト画像は公開画面で使用せず、実UIへ統一。
- `BAI_プロダクト開発基盤_全体一覧_2026-08-28.md` の内容を整理した `/products/` ページを追加。
- 利用者向け製品、制作を支える製品群、開発・知識基盤、Evidence循環を一つのプロダクトマップとして追加。
- 後から実画像へ同名で差し替えられる、1600×900の製品別SVGプレースホルダー11点を追加。
- 共通テンプレートから全ページへGTMを1組だけ出力し、GitHub Pagesとlocalhostを別GA4ストリームへ振り分ける環境分離を追加。
- CTA、相談フォーム遷移、YouTubeコンテンツ選択のGA4イベント計測と、Webマーケティング向け計測・レポート設計を追加。
- Googleへのログイン不要で利用できる公開相談フォームと、新着回答メール通知を追加。
- `site/` に支援領域、つくる人、相談する下層ページを追加。
- 下層ページ共通の「Connection Trace」デザインを追加。
- Git運用向けの `AGENTS.md`、`AGENT.md`、`CODEX.MD`、`ARCHITECTURE.md`、`CONTRIBUTING.md`、`.gitignore`、`.gitattributes` を追加。
- 生成した `_site/` をGitHub Pagesへ公開するGitHub Actionsワークフローを追加。
- Eleventyによる静的サイト生成、リンク検査、画像最適化、動画ロゴ同期のスクリプトを追加。
- 確定済み写真6枚のAVIF/WebP派生を追加。

### Changed

- トップの主要導線を「支援領域」「プロダクト」の順に変更し、屋号と公開活動名を明記。
- 相談ページへ送信後の流れ、費用発生のタイミング、入力情報の用途を追加。公開Google Formの質問とログイン不要状態もブラウザで確認。
- 固定ヘッダーと重なっていたプロダクト内ナビゲーションを、ヘッダー下へ固定するよう修正。
- トップのPRODUCT SHELFを、一般利用の需要が想像しやすいBAI VIDEO PRODUCTION、makeTikTokGiftMaster、BAI VOICE APPの順へ再編。内部開発基盤はプロダクト一覧へ移動。
- `P—01`、`C—01`、`TASK-051`など来訪者に意味のない内部管理番号を公開画面から削除し、用途を表す言葉へ置換。
- `/products/` を、画像カードの一覧から「利用者が使う製品・制作を支える仕組み・開発を支える基盤」の3分類へ再設計。対象者、公開状況、現在できることから選べる構成へ変更。
- 実画面のない製品は生成画像や架空UIを使わず、役割と情報の受け渡しをHTMLの機能図解で表示。
- `/products/` のBAI VIDEO PRODUCTIONカードを詳細LPへ接続し、生成イメージから開発中の実画面へ差し替え。開発中・Windowsアプリ・人が最終判断する境界を明記。
- 旧営業ロードマップの進捗値を使わず、現行PROJECT、Task、Release Evidenceを優先する説明へ更新。
- ヘッダー、モバイルメニュー、フッター、トップのプロダクトセクションから `/products/` へ移動できるよう更新。
- トップの主力プロダクト表示を、現在の開発優先度に合わせてBAI VIDEO PRODUCTIONへ更新。
- Codexを単独製品ではなく開発エージェント、BAI VOICE APPを調査・設計段階として明示。
- 相談ページのメール導線をGoogle Formへ変更し、フォームの入力内容と外部遷移を事前に案内する構成へ更新。
- Web編集元を `site/`、生成サイトを `_site/` として明文化。
- 動画キャプチャが使用する `playwright@1.62.1` を直接devDependencyとして固定。
- CSS、JavaScript、画像、下層ページを用途別フォルダへ整理。
- トップと下層ページの内部導線を新しいフォルダ構成に合わせて更新。
- トップの下層導線を「支援領域」「つくる人」「相談する」へ接続。
- 編集元を `site/`、生成物を `_site/` に分離し、GitHub Pagesでビルドして公開する構成へ変更。
- 下層ページURLを `/services/`、`/about-isamu/`、`/contact/` へ短縮。
- ヘッダーとフッターをEleventyの共通パーシャルへ移行。
- 写真を `picture` に変更し、AVIF、WebP、PNGの順にフォールバックするよう変更。
- 動画用ワードマークをサイト正本から同期する運用へ変更。

### Fixed

- ファイル移動後に発生していたCSS、JavaScript、画像、HTML間の相対パス切れを修正。
- 遅延読み込み可能な下部サムネイルと写真を `loading="lazy"` に変更。
- 画像寸法、現在ページ表示、モバイルメニューのスクロール挙動を改善。
- 下層ページのモバイル大見出しが過剰に折り返される問題を修正。
