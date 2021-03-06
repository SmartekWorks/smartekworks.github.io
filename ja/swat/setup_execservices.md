実行サービスのセットアップ
===

SWATはより効率的にシナリオを作成できるだけでなく、ローカル実行サービスとクラウド実行サービスを用意していることで、様々なプラットフォーム上でUIテストを実行させることができます。

ローカル実行サーバー
---

#### 動作環境

|         | 動作環境
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 2048 MB
| OS      | Windows XP以降, Mac OS X 10.6以降, Ubuntu 10.4以降（その他Linuxのディストリビューションでも動作する可能性があります）
| Browser | Internet Explorer 6以上, 最新版Firefox, 最新版Chrome, 最新版Safari
| Others  | Java SDK 7をターゲット端末かVMにインストールが必要

#### インストール手順

1. SWATサービスのサービス設定メニューから**ローカル実行環境**を選び、**ローカル実行環境一覧**画面を表示させます。
2. 右側の<span class="glyphicon glyphicon-download-alt"></span>ボタンをクリックし、**ローカル実行環境**を選択します。
3. 設定情報を確認して、「ダウンロード」をクリックすると、zipファイル名`WAAS-xxx.zip`がローカルコンピュータにダウンロードされます。
4. ターゲット端末上のインストールディレクトリにzipファイルを解凍します。
6. 下記に従ってインストールディレクトリの下の`account.ini`設定ファイルを変更します。
7. ローカル実行サーバーを立ち上げるには、インストールディレクトリ下の`startup.bat`（MacもしくはLinuxの場合、`startup.sh`）を実行します。 
8. **ローカル実行環境一覧**画面を再度表示させ、ローカル実行サーバーが登録されていることを確認できます。
9. ローカル実行サーバーを停止させるには、インストールディレクトリ下の`shutdown.bat`（MacもしくはLinuxの場合、`shutdown.sh`）を実行します。

Note: Windows 8でローカル実行サーバーを立ち上げるとき、"Could not open/create prefs root node Software\JavaSoft\Prefs at root 0x80000002. Windows RegCreateKeyEx(...) returned error code 5."のwarning messageが表示されます。 これが実行に影響を与えることはありませんので、このメッセージを無視ください。 また、レジストリに`HKEY_LOCAL_MACHINE\Software\JavaSoft\Prefs`を追加することにより、このメッセージを削除することができます。

#### 設定ファイル

以下に従ってインストールディレクトリの下の`account.ini`の設定ファイルを変更します。

* `waasCode`: **（任意）** 実行サーバーのコードです。特定の実行サーバーでシナリオを実行するために実行の作成時にコードを指定することができます。アルファベットと数字の組合せで16文字以下で指定します。この機能がいらない場合は設定する必要はありません。 
* `privateMode`: 不特定の**WaasCode**で実行タスクを受け入れるかどうかを決めるのに`true`か`false`を指定します。 デフォルト値`false`です。実行サーバーで `waasCode`を設定しない場合、この値は無視されます。
* `serverUrl`: **（必須）** SWATアカウントのサーバーURLです。**アカウント設定**画面からこの情報を入手することができます。
* `apiKey`: **（必須）** SWATアカウントのAPIキーです。 **アカウント設定**画面からこの情報を入手することができます。
* `secretKey`: **（必須）** SWATアカウントの秘密キーです。**アカウント設定**画面からこの情報を入手することができます。
* `driverMode`: **（任意）** `local`、ローカル実行をサポートするモードです。`remote`、リモートサービス実行をサポートするモードです。デフォルト値は`local`です。
* `swatProxy.enable`: **（任意）** SWATサービスへ接続するためにプロキシを使うかどうかを決定するのに`true`か`false`を指定します。デフォルト値は`false`です。
* `swatProxy.host`: **（任意）** プロキシのホストです。`swatProxy.enable`が`false`の場合、無視されます。
* `swatProxy.port`: **（任意）** プロキシのポートです。 数字を指定します。`swatProxy.enable`が`false`の場合、無視されます。
* `swatProxy.username`: **（任意）** プロキシのusernameです。`swatProxy.enable` が`false`の場合、無視されます。
* `swatProxy.password`: **（任意）** プロキシのpasswordです。`swatProxy.enable`が`false`の場合、無視されます。
* `execProxy.enable`: **（任意）** ブラウザ実行時にプロキシを使うかどうかを決めるのに`true`か`false`で指定します。SWATは、実行中のブラウザ認証ダイアログを扱うことができません。ユーザネームとパスワードなしでプロキシを使うことができます。デフォルト値は`false`です。
* `execProxy.host`: **（任意）** プロキシのホストです。`execProxy.enable`が`false`の場合、無視されます。
* `execProxy.port`: **（任意）** プロキシのポートです。`execProxy.enable`が`false`の場合、無視されます。
* `driverParallelization`: **（必須）** ローカル実行サーバーで許可される最大並列セッションです。IEの場合、サーバー毎に１セッションしかありません。
* `downloadDir`: **（任意）** ブラウザのデフォルトダウンロードディレクトリーです。値を設定しないと、**ファイル保存**のシステムオペレーションを使うことができません。`C:\\Downloads`のようにWindowsでダブルバックスラッシュを加えてください。
* `firefoxProfile`: **（任意）** 特定なFirefoxプロファイルをロードしてテストすることを望む際のFirefoxプロファイルのパスです。特別な設定やアドオンで、Firefox上でテストをしたい時に便利です。`C:\\MyProfile`のようにWindowsでダブルバックスラッシュを加えてください。

#### アップグレード

ローカル実行サーバーにユーザーデータとして利用するのは`account.ini`の設定ファイルのみです。そのため、新しいバージョンのローカル実行サーバーをもう一度インストールすればよいです。

#### ローカル実行環境について

自動実行に影響を与える可能性のあるブラウザの設定は多いため、OSやブラウザの設定は簡単な作業ではありません。これらのプロセスを簡単にするために、いくつかの提案をします。

* [ローカル環境の設定](#ローカル環境の設定)に情報アップデートを頻繁に行うので、問題があったときにこのセクションを確認ください。
* ローカル実行サーバーに一部課題の回避策が組み込まれるため、最新バージョンのローカル実行サーバーをアップデートしてください。
* SWATローカル実行サーバーのメインの実行エンジンであるSelenium WebDriverの環境情報をインターネットで探します。
* クラウド実行サービスが利用できる場合、OSやブラウザ設定のほとんどをプロバイダ側で処理をするため、クラウド実行サービスを利用ください。

BrowserStackサービス
---

SWATクラウドサービスではパブリック実行サービスとして[BrowserStack](http://www.browserstack.com)のサービスをサポートします。BrowserStackサービスを使うには、BrowserStackアカウントを取得し、最初の自動化プランを購入する必要があります。（BrowserStackのパートナーとして、弊社は支払い代行と一時サポート窓口を提供しています。）その後、サービスを利用する前にSWAT上にBrowserStackアカウントを設定します。 

Note: SWATのオプションサービスとしてBrowserStackサービスを購入している場合、SWATでBrowserStackサービスは既に設定されます。

1. サービス設定メニューから**アカウント設定**を選び、**アカウント設定**画面を表示します。
2. **クラウド実行**フィールドに下記のようなBrowserStackアカウント情報の設定文字列を入力します。 
```json
{
	"browserstack":{
		"enable":true, 
		"username":"Demo", 
		"accesskey":"abcdefgabcdefg", 
		"parallelization":2
	}
}
```

#### 設定文字列

設定文字列は下記ルールのJSONマップです。

* `"browserstack"`のキーを使い、値として下記キーのJSONマップです。
 * `"enable"`: **（任意）** サービスを使うかどうかを決めるのに`true`か`false`を使います。 デフォルト値は`false`です。
 * `"username"`: **（必須）** BrowserStackアカウントのusernameです。
 * `"accesskey"`: **（必須）** BrowserStackアカウントのaccesskeyです。
 * `"parallelization"`: **（必須）** 最大平行セッションは、BrowserStackサブスクリプションで許可されたものです。
 * `"local"`: **（任意）** BrowserStackのLocal Testingを使うかどうかを決めるには`true`か`false`を使います。デフォルト値は`false`です。
 
Note: アカウント情報を取得する方法やLocal Testingの使用方法はBrowserStackのドキュメントを参照してください。

ローカル環境の設定
---

ローカル実行環境でよく発生する問題について下記参照ください。

#### Internet Explorer

実行を行うには下記設定が必要です。

* Windows VISTAか7でIE 7以降を使用する場合、ゾーンごとに保護モードの設定を同じにする必要があります。値は、すべてのゾーンのために同じである限り、オンまたはオフにすることができます。 保護モードを設定するには、[ツール]メニューから "インターネットオプション..."を選択し、[セキュリティ]タブをクリックしてください。各ゾーンについては、「保護モードを有効にする」と記されたタブの下部にあるチェックボックスがあります。
* さらに、IE10以降の「強化された保護モード」を無効にする必要があります。このオプションは、[インターネットオプション]ダイアログの[詳細設定]タブに含まれています。
* ネイティブのマウスイベントが正しい座標に設定できるように、ブラウザのズームレベルを100％に設定されなければなりません。
* IE11のみでは、ドライバがInternet Explorerのインスタンスへの接続を維持できるように、ターゲットコンピュータ上のレジストリエントリを設定する必要があります。レジストリファイルはローカル実行サーバーの配下の`tools`の下に格納されています。また、[ここ](http://www.smartekworks.com/tools/ie11-get-window-handles.zip)からダウンロードすることもできます。
* Webアプリケーションでベーシック認証を使用する場合は、`http://<username>:<password>@yourdomain`のようなフォーマットでURLを使うことができます。しかしながら、IEはデフォルトでこのタイプのURLをサポートしません。ターゲット端末にレジストリを入力しなければなりません。レジストリファイルはローカル実行サーバーの配下の`tools`の下に格納されています。また、[ここ](http://www.smartekworks.com/tools/ie-enable-basic-auth.zip)からダウンロードすることもできます。
* IE11を使用する場合は、WindowsのアップデートKB3025390がIEのwebdriverを壊します、Windowsのコントロールパネルでこの更新プログラムをアンインストールしてください。

また、実行中以下の点について注意が必要です。

* InternetExplorerDriverがOSレベルでブラウザ上のマウスやキーボード操作を実行するため、実行を妨げることが無いように、他のタスクを停止しなければならない。
* VMを使用する場合、実行環境を接続するためのリモートデスクトップ（RDP)を使う間は実行中のスクリーンショットを正常に取得することができません。実行前にRDPを正常に接続を切断する必要があります。
* InternetExplorerDriverはIEのデフォルトユーザーのデータやセッティングを使用するので、一つの実行からのクッキーは次の実行に残ります。これらの影響をなくすために、IE終了時にコンテキストデータを削除する設定が必要です。

#### OS X Safari

* シナリオをSafari上に自動実行するために、手動でSafariDriverの拡張機能をインストール必要があります。拡張機能のインストールファイルはローカル実行サーバーの配下の`tools`の下に格納されています。また、[ここ](http://www.smartekworks.com/tools/SafariDriver.safariextz.zip)からダウンロードすることもできます。解凍したファイルをクリックすることで拡張機能がSafariにインストールできます。拡張機能がインストールされた後、自動的に削除され、Safariの拡張機能一覧で確認できます。
* Safariを駆動するWebDriverの制限で、現在シナリオ上にアラートの処理が対応されていません。また**ブラウザ機能**システムオペレーションも対応されていません。

#### Windows Firewall

Windows Firewallが有効の場合、最初のシナリオを実行すると、`IEDriverServer.exe`や` chromedriver.exe`の通信を可能にするようなダイアログで確認があります。その場合、通信を許可してください。また、Windows Firewallの設定で、手動でアクセス許可を追加することができます。

#### Windows IME

Windows日本語版の実行端末で実行する場合、シナリオの日本語半角記入が文字化けする可能性があります。実行端末のIMEを英語にすればこの問題を回避することが可能です。

実行パラメータの設定
---

フレームや、AJAXなどWebアプリの実装によって実行の挙動を変えるために、SWATではサイトごとに実行パラメータの設定が可能です。設定文字列は下記ルールのJSONマップです。

```json
{
	"webdriverTimeout": 60, 
	"commandInterval": 500, 
	"operationInterval": 500, 
	"frameSearchDepth": 3, 
	"scrollableFrames": [{"name":"frame1"}, {"id":"frame2"}], 
	"scrollableElements": [{"selector":"div.main_menu"}, {"id":"shopping_cart"}], 
	"enableAjaxWait":true,
	"ignoreAlertTimeout":true,
	"evidenceLevel": 2, 
	"matchingLevel": 1
}
```

* `webdriverTimeout`: 実行エンジンの秒単位のタイムアウト時間（画面のロードとか）。デフォルト値は`60`秒。
* `commandInterval`: オペレーションの中に複数操作の間の待ち時間（ms）。デフォルト値`500`（ms）。
* `operationInterval`: オペレーションの間の待ち時間（ms）。デフォルト値`500`（ms）。
* `frameSearchDepth`: 対象フレームを検索する際に最大の検索範囲の階層数。デフォルト値`3`階層。`0`の場合、フレームをサポートしません。
* `scrollableFrames`: スクロールスクリーンショットを撮る対象となるフレーム。各フレームが`name`か`id`で指定する必要があります。デフォルト値は空の配列。
* `scrollableElements`: スクロールスクリーンショットを撮る対象となる画面要素。各要素がCSSセレクトか`id`で指定する必要があります。デフォルト値は空の配列。
* `enableAjaxWait`: 実行時に非同期なAJAXコールの完了を待つオプションです。デフォルト値は`false`。
* `ignoreAlertTimeout`: アラートタイムアウト発生時にエラーにならないようにするオプションデス。デフォルト値は`false`。
* `evidenceLevel`: エビデンスを撮るポリシーです。デフォルト値は`2`。
 * `1`: 省略モードです。画面検証とエラーのエビデンス以外にすべてのエビデンスを取りません。
 * `2`: 通常モードです。すべてのオペレーションのエビデンスを取ります。
* `matchingLevel`: オペレーションローケーティングポリシーです。デフォルト値は`1`。
 * `1`: 通常モードです。ルールに定義したローティングポリシーにしたがって、画面上のオペレーションを特定します。
 * `2`: ファジーモードです（実験モード）。オペレーションの構造と内容をナレッジベースの内容とマッチして、オペレーションを識別します。