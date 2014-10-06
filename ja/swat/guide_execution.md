テストケースの実行
===

このページではテストケースの実行とテスト結果の操作方法について説明します。

実行のための準備
---

### セットアップと実行サービス

テストケースを実行する前に、SWAT上に実行サービスを準備します。SWATの実行サービスには、ローカル実行サービスとパブリッククラウド実行サービスの2種類があります。

ローカル実行サービスはパブリッククラウドに接続できない場合、ローカルマシン上にローカル実行サービスをセットアップをします。[実行サービスの設定]（setup_execservices.md＃Setup_Local_Execution_Server）

既にBrowserStackアカウントをお持ちの場合は、SWAT上でパブリッククラウド実行サービスをセットアップします。[実行サービスの設定](setup_execservices.md#Setup_BrowserStack_Service)

ヒント：もしBrowserStackサービスの評価版を利用中かサブスクリプションを購入している場合、SWATでBrowserStackサービスは既に設定されます。
### 実行の設定

テストケースを実行するにはいくつか重要な設定があります。それらは実行する前に理解いただくことが必要です。

#### ターゲットサーバー

ケースを実行する**ターゲットサーバー**のサーバーURLを設定します。ローカル開発サーバーや統合テストサーバなど異なる開発工程で同じテストケースをテストサーバーへ実行することができます。 一般的にテストセットで設定をし、新しい実行を行う時はテストセットを変更をします。

1. 前回の章で作成したテストセットの**シナリオ**画面を開きます。
2. 右上ボタンのセットの属性編集をクリックし、 **セット属性**画面を表示させます。
3. **対象サーバー**に*Bing*`http://www.bing.com`を入力し、保存します。 

ヒント：**サイト設定**画面で対象サーバーを設定することができます。ここで設定した情報は、テストセットを作成する時のデフォルトとして継承されます。

注意：**ターゲットサーバ**の設定は、このガイドのサンプルシナリオを含むすべての実行のために必要です。

#### プラットフォームとウィンドゥズサイズ

プラットフォームとは、テストケースを実行させる際のＯＳとブラウザの組み合わせで決定します。ウィンドゥ幅とウィンドゥ高さは実行中のブラウザでウィンドゥサイズを制御します。Ｗｅｂアプリケーションがレスポンシブの場合は便利です。 

新しい実行を行うとき、さらに詳細な設定があります。それらはデフォルトで選択できるようにしておくと便利です。デフォルト設定は、SWATのサービス設定で行います。 

1. メニュータグのサービス設定から**アカウント設定**を選択します。
2. **プラットフォーム**のデフォルト値を選択し、**ウィンドゥ幅（ピクセル）**、**ウィンドゥ高さ（ピクセル）**のデフォルト値を記入します。
3. 設定を保存します。

#### サイトの実行パラメーター

すべてのWebアプリには、フレーム、アラート、および独自のテスト要件のような実装タイプがあります。 詳細な実行動作を変更するために各サイトの拡張可能な実行パラメータを設定できます。新しいサイトを作成するときにパラメータのデフォルト値が設定されます。`Bing`サイトについてはパラメータ変更をする必要はありません。

パラメータの使用方法については、別の章[ウィンドゥ、フレーム、アラート、AJAX]（guide_scenes.md）を参照してください。

ケース選択し実行---

1. 前回の章で作成したテスト·セット内の**シナリオ**画面を開きます。
2. シナリオ`S0001`の前のチェックボックスにチェックをします。シナリオ配下のすべてのケースは自動的にチェックされます。**実行**ボタンがツールバーに表示されます。 
3. **実行**ボタンをクリックすると**新しい実行**ページが表示されます。
4. **新規実行**画面でいくつかの設定を行います。通常は**ターゲットプラットフォーム**以外はデフォルト設定を使用します。 またケースリストの右側でケース削除やケースの順番を変更することができます。
5. 使用可能なプラットフォームについて、SWATはデフォルトの設定に従いプラットフォームを選択します。 また、各サービスで利用可能な異なる実行サービスやプラットフォームを選択することができます。（`Ctrlキー/ Command`や` Shift`キーを押しながら複数プラットフォームの選択ができます）
6. **確定**ボタンをクリックすりと実行一覧画面が表示し、実行が始まります。
7. **実行一覧**画面では、実行の進行状況や実行下のケースが参照できます。

ノート：複数プラットフォームを選択した場合、それぞれのプラットフォームのいずれかが順番に実行されます。

テスト結果作業
---

1. ケースの右端にある進捗ラベルは、ケースが完了した段階で、**完了**か、**エラー**のボタン表示が出ます。
2. **完了**か、**エラー**のボタンをクリックすると、**実行結果**画面が表示されます。
3. **エビデンスを確認**ボタンをクリックすると、結果情報のキャプチャーが参照できる**エビデンスビューアー**画面が表示されます。
4. サムネイルをクリックするとスライドショーですべてのテストステップのスクリーンショットが表示されます。また、 ステップの詳細を表示させるには、左側のシナリオ·ツリー内の特定のステップをクリックします。

殆どのケースでは、ケースがOKであるか否かを確認する必要があります。以下の手順を参照ください。

* **結果検証について、**エビデンスビューアー**画面で確認します。
* エビデンスの外部出力は、ＥＸＣＥＬか他フォーマットでオフラインで確認します。
* **アサーション**システム操作を使い、自動で結果確認を行います。

EXCELにエビデンス出力をするには、いくつかの方法があります。
* **エビデンスビューアー**画面で単独の結果をEXCELかzipへ出力することができます。
* **実行**画面で全ての実行結果をEXCELへ出力することができます。
* **実行**画面で各々の結果をEXCELへ出力することができます。
* **シナリオ**画面でテストセットにあるすべてのケースの最終結果を出力することができます。

ヒント：EXCELへ出力してるときに、ノーマルモード（**アサーション**システムオペレーションだけをエビデンスとして出力されます）かフルモード（すべてのエビデンスを出力します）かを選ぶことができます。自動検証を簡単に実装させ、より速く出力させるには、いくつかの**アサーション**システムオペレーションを通常モードで使用することを推奨します。
検証後は、テスト結果のステータスを`OK`を、`NG`に変えることができ、**実行結果**ページで結果に対する課題を作成することができます。
次へ
----

SWATでテスト自動化を行う際、様々な状況での使用ノウハウはアーティクル章の記事を参照ください。また、仕様の詳細を知りたい場合は、リファレンス章を参照ください。