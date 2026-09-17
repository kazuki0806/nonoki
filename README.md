# ののき工務店（架空の会社のデザイン作例）

Webデザインの作例として作った、工務店のコーポレートサイトのトップページです。**この会社は実在しません。** 社名・人名・数字・金額・事例・住所・電話番号・許可番号は、すべて作りものです。フォームや下層ページは作っておらず、入力や送信の仕組みはありません。

公開ページ: https://kazuki0806.github.io/nonoki/

## 会社の設定

埼玉県の西部で1985年から木の家を建てている、社員14名（うち大工6名）の工務店という設定です。地元の杉とひのきで新築・リノベーション・修繕をし、建てた大工が30年目まで点検に来ます。サイトの目的は、完成見学会の予約と、施工事例を見たうえでの相談を増やすことです。

## デザインの方針

明るい灰色（#D2D2D2）の地に、強い色は赤（#CC0700）の1色だけ。太い和文（Noto Sans JP の900）と細長い英字（Bebas Neue）を大きく組み、言い切るコピーと大工の手元の写真で見せます。角は全体に丸めています。書体はすべて Google Fonts です。

見せ場は5つです。画面いっぱいの写真と特大のコピー、写真を貼りつけたままその上をスクロールしてくる縦書きの大見出し「描く。刻む。通う。」、施工事例の絞り込み（新築・リノベーション・店舗）、改修前と改修後を左右に動かして見比べる写真、どこにいても押せる「見学会を予約する」ボタン。

動きは GSAP と ScrollTrigger で、読み込み時に見出しが左から開き、ほかの要素はフェードしながら少し上へ動きます。スクロールでは区画ごとに中身を順に表示します。視差効果は使っていません。OSの「視差効果を減らす」設定（prefers-reduced-motion）では、何も隠さず最終の状態を表示します。

## 中身

- `index.html` … トップページ本体
- `404.html` … 見つからないページ
- `assets/style.css` … 色・書体・余白のトークンと、全区画のスタイル
- `assets/guard.js` … フォントを表示を止めずに読み込み、動きの準備ができなかったときは2.5秒で全部を表示する
- `assets/main.js` … GSAP の初期化、メニューの開閉、施工事例の絞り込み、改修前後の見比べ
- `assets/gsap.min.js`, `assets/ScrollTrigger.min.js` … GSAP 3.13.0
- `assets/chat.js`, `assets/chat.css` … AIチャット窓口（形だけ）
- `images/` … 仮の写真11枚（WebP）と、シェア用の画像 `ogp.jpg`
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, ファビコン一式

## 操作できるところ

- 施工事例の絞り込み: ボタン（aria-pressed）で種類を選ぶと、該当する事例だけが残り、件数を読み上げます
- 改修前後の見比べ: 写真の上をドラッグするか、フォーカスして左右の矢印キーで境目を動かせます（中身は range 入力）
- メニュー: Esc で閉じ、開いている間はフォーカスをメニューの中に閉じ込めます

## AIチャット窓口について

ホームページ制作のオプション（AIチャット窓口）を見せるための作例として、トップページに足しました。形だけで、AIにはつながっておらず、どこにも送信しません。入力した内容は保存もされません。

ファーストビューを過ぎると、右下に「ご質問はこちら」が出ます。開くと、よくある質問のボタン（見学会の日程、新築の費用、工事できる範囲、30年の点検、小さな修繕、工期の目安）か、入力した言葉に、会社の資料（ののき工務店.md）にある事実だけで決まった答えを返します。見学会・施工事例・家づくりの流れ・お問い合わせの答えには、ページ内のその区画へのリンクが付きます。答えられない質問には「このデモでは決まったご質問にだけお答えしています」と返します。窓口の上部にも、作例でAIにつながっていないことを書いています。Escキーで閉じると、呼び出しボタンにフォーカスが戻ります。メニューを開いている間は隠れ、暗い面（フッター）の上ではボタンが白になります。

直すときは design-canvas/src の site_chat.js と site_chat.css を編集し、build_site.py を実行してください（assets の中を直接直すと、次の組み立てで消えます）。

## リリース前チェックリストの結果

制作用のチェックリスト48項目で確認し、追加素材なしで直せるものは直しました。

対応済みの項目は、meta title（28字）と description（204字、見学会の予約への案内つき）、canonical、robots.txt、sitemap.xml、html lang、JSON-LD（Organization と BreadcrumbList）、OGP一式と Twitter カード、1200×630のシェア画像、ファビコン（ico・32・16・180・192・512・svg）、theme-color、site.webmanifest、画像のWebP化（品質68〜80、1枚120KB以下）、Googleフォントをページで使う文字だけに絞る（チャット窓口の文言も含めて526文字、6ファイル）、ファーストビュー外の遅延読込、imgのwidth/height明示、viewport、375pxと1440pxでの表示確認、alt、コントラスト比、見出し階層（h1は1つ、飛ばしなし）、CSSとJSの外部ファイル化、セマンティックHTML、SSLとHTTPSの強制（GitHub Pages）、ページ内リンクのチェック、ダミーテキストなし、コピーライトの年号、404ページ、環境変数（APIキーなし）です。

未対応の項目と、その理由は次のとおりです。

| 項目 | 理由 |
| --- | --- |
| noindex | 架空の会社なので、検索結果に出さないよう意図的に noindex にしています（チェックリストの index とは逆） |
| GA4・Search Console・コンバージョン計測 | 本番の測定IDと所有権確認が必要。テスト用IDを入れるのはチェックリスト自身が禁じているため入れていません |
| フォームの送信先・到達確認 | フォームを作っていません。「見学会を予約する」はページ内の見学会・お問い合わせの区画へ移動するだけです |
| プライバシーポリシー | 下層ページを作っていないため、フッターのリンクは飛び先なしです |
| 特商法・Cookie同意 | 販売行為と計測がないため対象外です |
| Lighthouse・Core Web Vitals | 手元に計測ツールがなく、数値を確認していません |
| シェア表示の確認 | X・Facebook のデバッガーはログインが必要なため未確認です |

なお `robots.txt` は、GitHub Pages のプロジェクトページではドメイン直下のものだけが読まれるため、この場所では効きません。検索避けは各ページの noindex で行っています。

## 写真について

本番用の写真はまだないので、Unsplash のフリー写真（Unsplash License）を仮に置いています。人の顔が分かる写真は使わず、手元と建物だけにしました。ブランド名や文字が写っていた写真は、その部分を切り落としています。設定とずれている写真もあります（改修後は薪ストーブではなく暖炉、事例02は土間ではなく居間、事例03はパン屋ではなくカフェのカウンター、新築は寺社風の軸組）。

| ファイル | 使いどころ | 撮影者 | 元ページ |
| --- | --- | --- | --- |
| hero-carpenter | ファーストビュー | Minh Đức | https://unsplash.com/photos/RpJIm5Lojyw |
| carpenter-hands | メニュー | Dominik Scythe | https://unsplash.com/photos/3cIvvzjE6Lk |
| service-new | 住まいの工事 | Trojan Yao | https://unsplash.com/photos/vT5IsNOFXKw |
| service-shop | お店と会社の工事（切り抜き） | Guillaume DHALLUIN | https://unsplash.com/photos/2v4gKimgAOc |
| works-01-before | 事例01 改修前 | ayumi kubo | https://unsplash.com/photos/IAgczbi1B-M |
| works-01-after | 事例01 改修後（切り抜き） | Clay Banks | https://unsplash.com/photos/Iy0cr3k7YoM |
| works-02 | 事例02 | Bailey Alexander | https://unsplash.com/photos/Aq8ljLz12gk |
| works-03 | 事例03（切り抜き） | Veronika Martinelli | https://unsplash.com/photos/WxfXOQEpyFg |
| event | 完成見学会 | Clay Banks | https://unsplash.com/photos/jczU03g4QIs |
| media-youtube | メディア YouTube | Clay Banks | https://unsplash.com/photos/PAoispQVHNI |
| service-repair | メディア Instagram | David Trinks | https://unsplash.com/photos/pKjIk8tf3io |

## 見るには

そのままブラウザで `index.html` を開けます。手元で確認するときは、このフォルダで次を実行して http://localhost:8813 を開いてください。

```bash
python3 -m http.server 8813
```
