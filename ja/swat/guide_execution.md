テストケースの実行
===

このページではテストケースの実行とテスト結果の参照方法について説明します。

実行のための準備
---

### 実行サービスのセットアップ

テストケースを実行する前に、SWAT上に実行サービスを準備します。SWATの実行サービスには、ローカル実行サービスとパブリッククラウド実行サービスの２種類あります。

もし利用しているSWATに実行サービスがセットアップされていない場合、[実行サービスの設定](setup_execservices.md＃ローカル実行サーバー)に従って、ローカルマシン上にローカル実行サービスをセットアップをしてください。

既にBrowserStackアカウントをお持ちの場合は、SWAT上でパブリッククラウド実行サービスをセットアップすることができます。[実行サービスの設定](setup_execservices.md#BrowserStackサービス)を参照ください。

Hint: [BrowserStack](http://www.browserstack.com)から評価アカウントを取得して、SWATのパブリッククラウド実行サービスに設定することが可能です。

Note: SWATのオプションサービスとしてBrowserStackサービスを購入している場合、SWATでBrowserStackサービスは既に設定されます。

### 実行の設定

テストケースを実行するにはいくつか重要な設定があります。それらは実行する前に作業を行うことが必要です。

#### 対象サーバー

**対象サーバー**がどのテストサーバーに対してテストケースを実行するかを決めます。このURLを変更することで、ローカル開発環境や統合テストサーバなど異なる開発工程のテスト環境に同じテストケースを実行することができます。新しい実行を行う時に設定を行いますが、一般的にテストセットでデフォルト値として設定を行います。

1. 前回の章で作成したテストセットの**シナリオ一覧**画面を開きます。
2. 右上の<span class="glyphicon glyphicon-pencil"></span>ボタンをクリックし、 **テストセット**画面を表示させます。
3. **対象サーバー**の*Bing*に`http://www.bing.com`を入力し、保存します。 

Hint: **サイト設定**画面で対象サーバーを設定することができます。ここで設定した情報は、テストセットを作成する時のデフォルトとして継承されます。

Note: **対象サーバー**の設定は、このガイドのサンプルシナリオを含むすべての実行のために必要です。

#### プラットフォームとウィンドウサイズ

プラットフォームは、テストケースを実行させる際のOSとブラウザの組み合わせで決定します。ウィンドウ幅とウィンドウ高さは実行中のブラウザウィンドウサイズを制御します。レスポンシブなWebアプリケーションのテストの場合は便利な設定です。 

新しい実行を行うとき、さらに詳細な設定がありますが、それらはデフォルトで選択できるようにしておくと便利です。デフォルト設定は、SWATのサービス設定で行います。 

1. サービス設定メニューから**アカウント設定**を選択します。
2. **プラットフォーム**のデフォルト値を選択し、**ウインドゥ幅（px）**、**ウインドゥ高（px）**のデフォルト値を記入します。
3. 設定を保存します。

#### サイトの実行パラメータ

Webアプリケーションには様々な実装の仕方があります。例えば、フレーム、アラート、および独自のテスト要件のような実装タイプがあります。 細かな実行挙動を変更するために各サイトの拡張可能な実行パラメータが設定できます。新しいサイトを作成するときにパラメータのデフォルト値が設定されます。`Bing`サイトについてはパラメータ変更をする必要はありません。

パラメータの使用方法については、別の章[実行パラメータの設定](setup_execservices.md#実行パラメータの設定)を参照してください。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_3_1.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_3_1.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

選択したテストケースの実行
---

1. 前回の章で作成したテストセットの**シナリオ一覧**画面を開きます。
2. シナリオ`S0001`の前のチェックボックスにチェックをしますと、シナリオ配下のすべてのテストケースは自動的にチェックされます。**実行**ボタンがツールバーに表示されます。 
3. **実行**ボタンをクリックすると**新規実行**ページが表示されます。
4. **新規実行**画面でいくつかの設定を行います。通常は**プラットフォーム**以外はデフォルト設定を使用します。またテストケースリストの右側でテストケース削除やテストケースの順番を変更することができます。
5. 使用可能なプラットフォームについて、SWATはデフォルトの設定に従いプラットフォームを選択します。また、利用可能な異なる実行サービスやプラットフォームを選択することができます。（`Ctrl/Command`キーまたは`Shift`キーを押しながら複数プラットフォームの選択ができます。）
6. **確定**ボタンをクリックすると**実行一覧**画面が表示し、実行が始まります。
7. **実行一覧**画面では、実行の進行状況や実行中のテストケースが参照できます。

Note: 複数プラットフォームを選択した場合、それぞれのプラットフォーム単位に実行が実施されます。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_3_2.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_3_2.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

テスト結果にアクセス
---

1. テストケースの右端にある進捗ラベルは、テストケースが完了した段階で、**完了**か、**エラー**のボタン表示が出ます。
2. **完了**か、**エラー**のボタンをクリックすると、**実行結果**画面が表示されます。
3. **エビデンスを確認**ボタンをクリックすると、結果情報のスクリーンショットやHTMLなどのエビデンスが参照できる**エビデンスビューアー**画面が表示されます。
4. サムネイルをクリックするとスライドショーで全てのテストステップのスクリーンショットが表示されます。また、ステップの詳細を表示させるには、左側のシナリオツリー内の特定のステップをクリックします。

殆どの場合、テストケースが成功か失敗かを検証する必要があります。検証するには以下のいくつかのアプローチがあります。

* **エビデンスビューアー**画面で結果を検証します。
* エビデンスの外部出力機能を使い、Excelか他フォーマットでオフラインで検証します。
* **画面検証**システムオペレーションを使い、自動的に結果検証を行います。

Excelにエビデンスを出力をするには、いくつかの方法があります。

* **エビデンスビューアー**画面で単独の結果をExcelかzipへ出力することができます。
* **実行**画面で実行単位にすべてのテストケース結果をExcelへ出力することができます。
* **実行**画面で選択した複数実行のすべてのテストケース結果をまとめてExcelへ出力することができます。
* **シナリオ一覧**画面でテストセットにあるすべてのテストケースの最終結果を出力することができます。

Hint: Excelへ出力してるときに、通常モード（**画面検証**システムオペレーションをセットした所の画面だけをエビデンスとして出力されます）かフルモード（すべてのエビデンスを出力します）かを選ぶことができます。より速く出力させるには、検証ルールなしの**画面検証**システムオペレーションをシナリオの検証ポイントに組み込んで通常モードで出力させます。（今後自動検証を実装するときに画面検証が必要となります。）

検証後は、テスト結果のステータスを`成功`か`失敗`かに変えることができ、**実行結果**ページで結果に対する課題を起票することができます。

<video width="480" controls>
	<source src="http://www.smartekworks.com/video/guide/guide_3_3.webm" type="video/webm">
	<source src="http://www.smartekworks.com/video/guide/guide_3_3.mp4" type="video/mp4">
	ビデオの再生がサポートされていません。</video>

次へ
----

これでSWATの基本的な操作方法を理解していただいたかと思います。SWATは現在ざまざまなHTMLの実装を理解するためのナレッジルールエンジンを持っています。

次は、JSから作られた特殊画面要素をナレッジルールのカスタマイズで対応することを説明します。

[画面ナレッジカスタマイズ](guide_tuning.md)へ。