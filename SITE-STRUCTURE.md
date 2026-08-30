# 開発と表現｜下層ページ導線設計・サイトマップ

## 1. 設計の前提

- 主体：個人事業の屋号「開発と表現」
- 公開上の活動名：「いさむ」
- 主な閲覧者：開発・AI・映像・音声・配信を相談したい人、活動や制作過程を見たいクリエイター
- トップページの仕事：屋号の考え方を短時間で伝え、閲覧者を適切な詳細ページへ振り分ける
- 下層ページの仕事：判断に必要な具体情報を示し、関連ページまたは相談へつなぐ

## 2. 結論

トップページは現在の強いビジュアルと要約を残し、各セクションを「詳細ページへの入口」にする。

カードは単独コンテンツではなく、下層ページへのリンクとして扱う。カード内に遷移先を明記し、押した後の内容を予告する。

```text
トップの要約
   ↓  詳細を見る
下層ページの具体情報
   ↓  関連プロダクト／活動／相談
次の行動
```

### 現在の物理配置

この文書内のページ名は情報設計上の名称です。Gitリポジトリ上の正本は次の場所にあります。

```text
TOP             → site/index.njk                  → /
支援領域        → site/services/index.njk         → /services/
プロダクト      → site/products/index.njk         → /products/
└ BAI VIDEO PRODUCTION
                → site/products/bai-video-production/index.njk
                                                   → /products/bai-video-production/
└ その他8製品 → site/products/{製品名}/index.njk → /products/{製品名}/
対応スキル      → site/skills/index.njk           → /skills/
いさむについて  → site/about-isamu/index.njk      → /about-isamu/
相談する        → site/contact/index.njk          → /contact/
プライバシー    → site/privacy/index.njk          → /privacy/
共通部品        → site/_includes/partials/
共有CSS         → site/css/
共有JavaScript  → site/scripts/
画像            → site/images/assets/
生成サイト      → _site/（Git管理外）
```

今後の実装も `site/` 配下へ追加し、`_site/` や旧フォルダの複製は直接更新しません。

## 3. 推奨サイトマップ

```text
開発と表現
│
├─ TOP / /
│  ├─ 思想（トップ内）
│  ├─ 支援領域の要約
│  ├─ プロダクトの要約
│  ├─ YouTube活動の要約
│  ├─ 仕事の進め方の要約
│  └─ いさむの要約
│
├─ 支援領域 / services/
│  ├─ 開発
│  ├─ 接続・統合「と」
│  ├─ 表現
│  ├─ 進め方
│  └─ 相談できる状態／できない状態
│
├─ プロダクト / products/
│  ├─ BAI VIDEO PRODUCTION / products/bai-video-production/
│  │  ├─ よくある困りごとと変わる制作体験
│  │  ├─ 4つの利用工程
│  │  ├─ 読みやすく切り出した開発中の実画面2点
│  │  ├─ できていること・検証中・次に目指すこと
│  │  └─ 折りたたみ式のTASK-051〜063開発記録
│  ├─ makeTikTokGiftMaster / products/make-tiktok-gift-master/
│  ├─ BAI VOICE APP / products/bai-voice-app/
│  ├─ BAI CREATIVE OS / products/bai-creative-os/
│  ├─ BAI DaVinci EXTENDS / products/bai-davinci-extends/
│  ├─ Creator / Streaming Tools / products/creator-streaming-tools/
│  ├─ BAI DEVELOPMENT OS / products/bai-development-os/
│  ├─ BAI Knowledge Hub / products/bai-knowledge-hub/
│  └─ BAI Development Hub / products/bai-development-hub/
│
├─ 活動 / activity.html
│  ├─ いさむの開発×表現 裏側ch / channel-isamu.html
│  └─ バイサウンド / channel-baisound.html
│
├─ 対応スキル / skills/
│  ├─ 対応できる仕事
│  ├─ 実務経験の土台
│  ├─ 個人開発・研究
│  └─ 技術スタック
│
├─ いさむについて / about-isamu/
│  ├─ いさむについて
│  ├─ 扱う領域
│  ├─ 仕事で大切にすること
│  ├─ 制作環境・使用機材
│  └─ プロダクト／チャンネルとの関係
│
├─ 相談する / contact/
│  ├─ 相談できる内容
│  ├─ 相談前に決まっていなくてよいこと
│  └─ 連絡手段
│
└─ プライバシー・アクセス解析 / privacy/
```

## 4. グローバルナビゲーション

```text
考え方｜支援領域｜対応スキル｜プロダクト｜活動・YouTube｜いさむ｜相談する
```

| ラベル | 遷移先 | 役割 |
|---|---|---|
| 思想 | `/#about` | 屋号の考え方を読む |
| 支援領域 | `/services/` | 依頼・相談できる内容を確認する |
| 対応スキル | `/skills/` | いさむに任せられる仕事と経験の根拠を見る |
| プロダクト | `/products/` | 製品・制作基盤・開発基盤の全体像と現在地を見る |
| 活動 | `activity.html` | YouTubeと制作過程を見る |
| いさむ | `/about-isamu/` | 「いさむ」と制作環境を知る |
| 相談する | `/contact/` | 相談方法を確認して連絡する |

「ポートレート」は写真作品にも読めるため、メニューでは「つくる人」を推奨する。ページ内の英字ラベルとして `PORTRAIT / ISAMU` を残すことはできる。

## 5. トップページからの導線

### 支援領域

3枚のカードは、ホバー表現だけで終わらせず、カード全体を `/services/` の該当見出しへリンクする。

```text
開発     → /services/#development
と       → /services/#integration
表現     → /services/#expression
```

カード下部の行動ラベル：`この領域でできること →`

### プロダクト

トップのプロダクト棚は `/products/` へ接続する。全体ページでは、完成済み・開発中・調査中・構想・基盤・開発エージェントを混同せず、ステータスを明記する。

```text
プロダクト全体を見る → /products/
```

すべての製品名から個別詳細LPへ接続する。各詳細では「困りごと → 変わる体験 → 4つの流れ → 現在地 → 対応範囲 → FAQ」を共通順序とし、未実装の機能を完成済みのように見せない。実画面がない場合は、架空UIではなく役割と情報の流れをHTMLで図解する。

### 活動・YouTube

チャンネル紹介ブロックはチャンネル下層ページへ、おすすめ動画カードはYouTubeへ直接リンクする。

```text
チャンネルの詳細を見る → channel-isamu.html / channel-baisound.html
動画を見る             → YouTubeの各動画
```

サイト内リンクとYouTube外部リンクを同じカードに混在させない。

### つくる人

トップには現在の写真・活動名・短い宣言だけを残す。

```text
いさむについて、活動と制作環境を見る → /about-isamu/
```

実名は使用しない。機材一覧の完全版、経験、考え方、各活動との関係は下層へ移す。

### 相談

トップからの主導線は `/contact/` にする。相談ページで「何を送ればよいか」を説明してから、公開Google Formへつなぐ。サイト上にメールアドレスや `mailto:` は掲載しない。

## 6. 下層ページ共通構造

```text
┌──────────────────────────────────┐
│ パンくず / 現在地                │
│ ページの役割を一文で示す見出し   │
│ CYAN ─────── と ─────── ORANGE   │
├──────────────────────────────────┤
│ 結論・現在地                      │
├──────────────────────────────────┤
│ 具体内容                          │
├──────────────────────────────────┤
│ 関連するプロダクト／活動          │
├──────────────────────────────────┤
│ NEXT CONNECTION → 次に進むページ │
└──────────────────────────────────┘
```

各下層ページの末尾には、単なるフッターの前に `NEXT CONNECTION` を置く。これにより詳細ページを行き止まりにしない。

例：

- 支援領域 → 仕事の進め方 → 相談
- BaiVoice Studio → バイサウンド → 相談
- 裏側ch → 関連プロダクト → つくる人
- つくる人 → 活動 → 相談

## 7. 視覚的な導線ルール

- シアン：開発、仕組み、技術側へ進むリンク
- オレンジ：表現、映像、音声、発信側へ進むリンク
- バイオレット：「と」、接続、ページ間をまたぐリンク
- 内部リンク：`→`
- 外部リンク：`↗`
- ページ内移動：`↓`
- 戻る：`←`

リンク種別を矢印だけに頼らず、ラベルでも明記する。

特徴的な表現として、トップのカード下端から伸びる細いバイオレット線を、下層ページの見出し上部へ引き継ぐ。別ページへ移っても「開発と表現の間をつなぐ」という体験を維持できる。

## 8. 公開順序

### Phase 1：行き止まり解消

1. `/about-isamu/`
2. `/services/`
3. `/contact/`
4. トップとフッターのリンク変更

### Phase 2：活動の整理

1. `activity.html`
2. `channel-isamu.html`
3. `channel-baisound.html`

### Phase 3：プロダクト詳細

1. `/products/`（実装済み）
2. 公開情報が固まった製品の個別詳細ページ
3. 製品別の実画像への差し替え

空ページは公開しない。ページ本文が完成するまでは、トップの現行セクション内リンクを維持する。

## 9. Webページ動画化への転用

この導線はそのままサイト紹介動画のカット順として使える。

```text
TOPの宣言
→ 支援領域3枚
→ プロダクト
→ YouTube活動
→ つくる人
→ 相談する
```

自動スクロール、カードのホバー、ページ遷移を収録し、16:9のMP4へまとめる。公開ページが揃った段階で、無音UIデモまたはBGM・ナレーション付き紹介動画として制作できる。
