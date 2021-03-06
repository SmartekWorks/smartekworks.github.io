画面インポート
===

このページでは、WebページからWebのオペレーションモデルを生成する方法について説明します。

SWATキャプチャーのインストール
---

**SWATキャプチャー**はSWAT画面ナレッジのインポートで使用されるWebアプリケーションのHTMLをキャプチャするためのブラウザ拡張機能です。 SWATはまたブラウザ機能による`HTMLとして保存`で保存したHTMLをサポートしています。 WebアプリケーションでリアルタイムレンダリングされたHTMLやフレーム構造を扱うには、**SWATキャプチャー**でWebアプリケーションをキャプチャする必要があります。

**SWATキャプチャー**は現在Google Chrome、Mozilla FirefoxとInternet Explorerで提供されています。このガイドではchromeを使います。セットアップの詳細は、[ツールと外部連携のセットアップ](setup_tools.md#SWATキャプチャー)を参照ください。 

Chrome拡張機能のインストールと利用方法はとても簡単です。以下の手順に従ってください。

1. Chromeブラウザを開き、Chrome Webストアの[SWATキャプチャー画面](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie)を表示させます。 
2. <span class="glyphicon glyphicon-plus"></span> **無料**ボタンで拡張機能をインストールします。 インストール完了後は、Chromeのツールバーに![SWAT icon](/swat/assets/images/extension.png)が表示されます。
3. 任意のWeb画面を開き、![SWAT icon](/swat/assets/images/extension.png) をクリックします。 
4. SHTMタイプのファイルは、デフォルトでは自動的にダウンロードフォルダーに保存されます。

画面インポートの準備
---

*Bing検索*のサンプルシナリオでは、検索画面のHTMLが必要です。

1. **SWATキャプチャー**がインストールされたブラウザで、 http://www.bing.com サイトを開きます。
2. 検索画面がロードされたら、![SWAT icon](/swat/assets/images/extension.png)をクリックします。ファイル名は`Bing.shtm`で保存します。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_1_1.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_1_1.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

SWATナレッジベースについて
---

SWATはナレッジドリブン自動化として、シナリオ構築、保守および実行をサポートするナレッジベースを使用しています。SWATのナレッジベースは以下コンポーネントを含みます。

* **サイト**: HTMLエンコードなどの画面共有属性を管理するための管理コンテナ。通常は、実際のサイトまたはWebアプリケーションに対応。
* **画面**: Webアプリケーションの画面。 
* **ルール**: ナレッジルールは画面の実装をSWATが理解するための設定ファイル。
* **オペレーション**: *ログイン*や*検索*のようなオペレーション。操作ノードセットの情報を含む。
* **ノード**: テキストボックスやボタンのような操作の最小単位。
* **フロー**: 特定のビジネス上のWebアプリケーションワークフローを意味する。それはオペレーションのいくつかのステップを含む。詳細について、[フローの活用](article_flow.md)を参照。

Hint: 最初のナレッジベース構築は少し大変かもしれませんが、うまく構築できるとシナリオの作成とメンテナンスがはるかに効率的に進められます。

サイトの作成
---

最初にSWATナレッジベースに*Bing*の新しいサイト追加が必要です。

1. サービス設定メニューから**サイト設定**を開きます。
2. <span class="glyphicon glyphicon-plus"></span> ボタンをクリックして、新しいサイトを作成します。
3. タイトルを`Bing`、HTMLエンコードを`UTF-8`とします。
4. デフォルト値を使用し他の設定をそのままにして、サイトを作成します。

Note: SWATの契約でサイト作成の上限があります。これ以上にサイトが作成できない場合は、SWAT管理者（無償版の場合、[スマーテックワークス](mailto:sales@smartekworks.com)）へ連絡ください。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_1_2.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_1_2.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

画面のインポート
---

1. ナレッジメニューから**画面ナレッジ**を開きます。
2. **検索**テキストボックス下のサイトプルダウンリストから`Bing`サイトを選択。`Bing`サイトのナレッジツリー画面が表示されます。
3. <span class="glyphicon glyphicon-plus"></span>ボタンをクリックし、**画面ナレッジメンテナンス**画面が表示されます。
4. **対象サイト**は`Bing`であることを確認し、**ファイルを選択**ボタンをクリックし`Bing.shtm`を選びます。（複数ファイルの場合、zipにまとめてアップロードすることが可能です。）
5. **ファイル名のエンコード**はzipファイル内のファイル名のエンコーディングを指し、英語のファイル名を使う場合このオプションを変える必要はありません。
6. インポート時に**解析ルール**のカスタマイズを選ぶことができます。 カスタマイズされたものを用意していないので、デフォルトのままとします。
7. **開始**ボタンをクリックし、その後SWATはHTMLの構文解析を開始します。進捗は左側に表示されます。
8. 解析が完了した後、`Bing`は**画面ナレッジメンテナンス**画面に表示されます。
9. **戻る**ボタンをクリックし、ナレッジツリー画面内に`Bing`という新しい画面ナレッジが追加されたことを確認します。 
10. `Bing`画面を選択し、その下にリンクのグループと検索の2つのオペレーションを確認します。 
11. どれかオペレーションを選択すると、ハイライト表示されたオペレーションのノードが確認できます。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_1_3.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_1_3.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

画面とオペレーションの編集
---

HTMLの実装によって、抽出したオペレーションの名前がわかりづらいことがあります。個別のナレッジコンポーネントのタイトルを含め、いくつかの属性を変更することが可能です。

1. ナレッジメニューから**画面ナレッジ**を選択します。
2. `Bing`下の`hp_table`を選択、タイトルを`リンク`に変更します。保存後、左側ツリーでタイトルが変わったことを確認します。
3. また、`sb_form`のタイトルを `検索`へ変更できます。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_1_4.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_1_4.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

次へ
----

これで画面ナレッジが使えるようになりました。次は画面オペレーションを使ってシナリオの作成する方法を説明します。

[シナリオ作成](guide_scenarios.md)へ。