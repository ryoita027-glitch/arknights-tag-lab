# iPhoneで使えるURLを作る手順（GitHub Pages）

このアプリは**公開サイトにアクセスする際だけ通信が必要**です。タグ検索そのものは外部への通信を行いません。

## 1. 専用リポジトリを作成

GitHubで `New repository` を押し、名前を `arknights-tag-lab` にして **Public** で作成します。GitHub FreeではPagesにPublicリポジトリが必要です。既存のゲーム用リポジトリには混ぜず、新しい専用リポジトリにします。

## 2. 配布ファイルをアップロード

`PWA_UPLOAD_TO_GITHUB` フォルダの **中身** をリポジトリの最上位に置きます。`index.html`, `manifest.webmanifest`, `sw.js`, `icon-192.png`, `icon-512.png`, `.nojekyll` を含めます。フォルダを入れ子にしないでください。ブラウザの場合 `Add file → Upload files → Commit changes` でアップロードできます。

## 3. Pagesを有効化

リポジトリで **Settings → Pages → Build and deployment → Source: Deploy from a branch → Branch: main, / (root) → Save** を選びます。公開されるまで数分かかることがあります。

公開後のURL形式は `https://<GitHubユーザー名>.github.io/arknights-tag-lab/` です。このURLは実際のリポジトリ公開後に確認してください。

## 4. iPhoneへ追加

SafariでURLを開き、ページが最後まで読み込まれるのを待ってから、共有 → ホーム画面に追加します。その後はホーム画面から起動します。完全にオフラインで使う前に一度起動してから、機内モードで起動確認してください。

## 更新する場合

PWA_UPLOAD_TO_GITHUBのファイルを差し替えます。Service Workerのキャッシュ名（sw.js）が変わると新しいファイルを取り直せます。更新版リリースのたびにその名前を変えてください。

## 動作範囲

PC向けの `standalone.html` は単体で動くオフラインHTMLですが、iOSの「ファイル」プレビューでのJavaScript実行は保証されません。PWA版には初回のHTTPSアクセスが必要です。コードとオフラインキャッシュは模擬テスト済みですが、iPhone実機でのオフライン再起動は未検証です。

公式ドキュメント: https://docs.github.com/ja/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site