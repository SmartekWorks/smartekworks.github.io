実行サービスのセットアップ
===

SWATはより効率的にシナリオを作成できるだけでなく、様々なプラットフォーム上でローカル実行サービスとクラウド実行サービスを提供してます。

ローカル実行サーバーのセットアップ
---

#### 動作環境

|         | 動作環境
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 2048 MB
| OS      | Windows XP以上, Mac OS X 10.6以上, Ubuntu 10.4以上(他のlinuxで動作するかは別途検証が必要)
| Browser | Internet Explorer 6以上, 最新版Firefox, 最新版Chrome, 最新版Safari
| Others  | desktopかVM上でJava　SDK7のインストールが必要。 

#### インストール手順

1. SWATサービスのサービス設定からローカル実行環境を選び、**ローカル実行環境一覧**画面を表示させます。
2. 右側のボタンをクリックし、**ローカル実行環境**を選択します。
3. 設定情報を確認して、「ダウンロード」をクリックすると、zipファイル名`WAAS-xxx.zip`がローカルコンピュータにダウンロードされます。
4. ターゲットコンピュータ上のインストールディレクトリにzipファイルを解凍します.
6. 下記章に従ってインストールディレクトリの下の`account.ini`設定ファイルを変更します。
7. ローカル実行サーバーを立ち上げるのは、インストールディレクトリ下の`startup.bat` (`startup.sh` on Mac or Linux)を実行します。 
8. サービス設定のローカル実行環境を選び、**ローカル実行環境一覧画面** 画面を再度表示させ、ローカル実行サーバが登録されていることを確認できます。
9. ローカル実行サーバーを停止させるには、インストールディレクトリ下の`shutdown.bat` (`shutdown.sh` on Mac or Linux)を実行します。

#### 設定ファイル

以下の章に従ってインストールディレクトリの下の`account.ini`の設定ファイルを変更

* `waasCode`: 実行サーバーのコードです。特定の実行サーバーでシナリオを実行するための実行の作成時にコードを指定することができます。アルファベットと数字の組合せで16文字以下で指定します。この機能がいらない場合は設定する必要はありません。 
* `privateMode`: 不特定の**WaasCode**で実行タスクを受け入れるかどうかを決めるのに`true`か`false`を指定します。 デフォルト値`false`です。実行サーバーで `waasCode`を設定しない場合、値は無視されます。
* `serverUrl`: SWATアカウントのサーバーURLです。**アカウント設定**画面からこの情報を入手することができます。
* `apiKey`: SWATアカウントのAPIキーです。 **アカウント設定**画面からこの情報を入手することができます。
* `secretKey`: SWATアカウントのシークレットキーです。**アカウント設定**画面からこの情報を入手することができます。
* `swatProxy.enable`: SWATサービスへ接続するためにプロキシーを使うかどうかを決定するのに`true`か`false`を指定します。デフォルト値は`false`です。
* `swatProxy.host`: プロキシーのホストです。`swatProxy.enable`が`false`の場合、無視されます。
* `swatProxy.port`: プロキシーのポートです。 数字を指定します。`swatProxy.enable`が`false`の場合、無視されます。
* `swatProxy.username`: プロキシーのusernameです。`swatProxy.enable` が`false`の場合、無視されます。
* `swatProxy.password`: プロキシーのpasswordです。`swatProxy.enable`が`false`の場合、無視されます。
* `execProxy.enable`: ブラウザ実行時にプロキシーを使うかどうかを決めるのに`true`か`false`で指定します。SWATは、実行中のブラウザ認証ダイアログを扱うことができません。ユーザネームとパスワードなしでプロキシーを使うことができます。デフォルト値は`false`です。
* `execProxy.host`: プロキシーのhostです。`execProxy.enable`が`false`の場合、無視されます。
* `execProxy.port`: プロキシーのportです。`execProxy.enable`が`false`の場合、無視されｍす。
* `driverParallelization`:ローカル実行サーバで許可された最大並列セッションです。コンピュータ上でIEのセッションが一つ実行していると、このケースでは値は無視されます。
* `downloadDir`: ブラウザのデフォルトdownloadディレクトリーです。値を設定しないと、システムオペレーションの**Obtain Download**は使いことができない。 `C:\\Downloads`のようにWindowsでダブルバックスラッシュを加えてください。
* `firefoxProfile`: テストブラウザを起動することを望む際のFirefox profileのパスです。特別な設定や追加をし、Firefox上でテストをしたい時に便利です。 `C:\\Downloads`のようにWindowsでダブルバックスラッシュを加えてください。

#### ノート

* Windows 8でローカル実行サーバーを立ち上げるとき、"Could not open/create prefs root node Software\JavaSoft\Prefs at root 0x80000002. Windows RegCreateKeyEx(...) returned error code 5."のwarning messageを確認します。 それが実行に影響を与えることはありませんので、このメッセージを無視ください。 また、レジストリに`HKEY_LOCAL_MACHINE\Software\JavaSoft\Prefs`を追加することにより、このメッセージを削除することができます。


#### 次へ

実行に影響を与える可能性のあるブラウザの設定は多いため、OSやブラウザの設定は簡単な作業ではありません。これらのプロセスを簡単にするいくつかの提案をします。

* クラウド実行サービスを使い、OSやブラウザの設定のほとんどをプロバイダにより処理します。
* ローカル環境の設定方法についての情報アップデートを頻繁にセッションを確認ください。
* 最新バージョンのローカル実行サーバーをアップデートし、ローカル実行サーバにおける実行の問題に関する解決がなされてます。
* Selenium Web Driverの情報をインターネットで探します。これは現在SWATのメインの実行エンジンだからです。

BrowserStackサービスの設定
---

クラウドサービスで、SWATはパブリック実行サービスとして[BrowserStack](http://www.browserstack.com)をサポートします。 BrowserStackサービスを使うには、BrowserStackアカウントを取得し、最初の自動化プランを購入する必要があります。 (BrowserStackのパートナーとして、弊社は支払い代行と一時サポート窓口を提供しています。) その後、サービスを利用する前にSWAT上にBrowserStackアカウントを設定します。 

ヒント：BrowserStackサービスは試用アカウントを使用している場合、既に設定され、もしくはサブスクリプションを購入します。

1. サービス設定のアカウント設定を選び、**アカウント設定**画面を表示します。
2. BrowserStackアカウント情報のコンフィグレーション文字列を**クラウド実行**フィールドに下記の一つとして入力します。 
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

#### コンフィグレーション文字列

コンフィグレーション文字列は下記ルールのJSONマップです。

*`"browserstack"`のキーを使い、値として下記キーのコンフィグレーションマップです。
 * `"enable"`: Use サービスを使うかどうかを決めるのに`true`か`false`を使います。 デフォルト値は`false`です。
 * `"username"`: BrowserStackアカウントのusernameです。
 * `"accesskey"`: BrowserStackアカウントのaccesskeyです。
 * `"parallelization"`: 最大平行セッションは、BrowserStackサブスクリプションで許可されたものです。
 * `"local"`: ローカルテストでBrowserStackを使うかどうかを決めるには`true`か`false`を使います。デフォルト値は`false`です。
 
ノート：アカウント情報を取得する方法やローカルテストの使用方法はBrowserStackのドキュメントを参照してください。

ローカル環境の設定
---

最も可能性の高い問題に出会うには次の通りです。

#### Internet Explorer

実行を行うには下記設定が必要です。

* Windows VISTAか7でIE 7以降を使用する場合、同じ値になるようにゾーンごとに保護モードの設定をする必要があります。値は、すべてのゾーンのために同じである限り、オンまたはオフにすることができます。 保護モードを設定するには、[ツール]メニューから "インターネットオプション..."を選択し、[セキュリティ]タブをクリックしてください。各ゾーンについては、「保護モードを有効にする」と記されたタブの下部にあるチェックボックスがあります。
* さらに、「強化された保護モード「IE10以降のために無効にする必要があります。このオプションは、[インターネットオプション]ダイアログの[詳細設定]タブに含まれています。
* ネイティブのマウスイベントが正しい座標に設定できるように、ブラウザのズームレベルを100％に設定されなければなりません。
* IE11のみでは、ドライバがInternet Explorerのインスタンスへの接続を維持できるように、ターゲットコンピュータ上のレジストリエントリを設定する必要があります。 reg fileはここからダウンロードできます。 [here](http://www.smartekworks.com/tools/ie11-get-window-handles.zip).
* If the website uses basic authentication, you can use the URL in the format like `http://<username>:<password>@yourdomain`. However, IE does not support this type of URL by default. You have to set a registry entry on the target computer. You can download the reg file [here](http://www.smartekworks.com/tools/ie-enable-basic-auth.zip)

You should also take care of the following points in execution:

* As the InternetExplorerDriver uses so-called "native", or OS-level events to perform mouse and keyboard operations in the browser, you have to stop other tasks when using the IE driver for execution to ensure no to interfere the execution.
* Screenshot cannot be captured normally in execution during the period that you use remote desktop (RDP) to connect execution environment, which is common when you use VM for execution. You also have to disconnect the RDP connect normally before execution.
* InternetExplorerDriver uses current user's settings and data of IE, which means that cookies from one execution will remains in the next execution. You need to set IE to delete the context data when exit in *Internet Options > General* to ensure the execution starts with a clean context.

#### Windows Firewall

If you execute the scenario for the first on Windows with Windows Firewall enabled, there may be a dialog shown to ask whether allow the communication of `IEDriverServer.exe` or `chromedriver.exe`. Please permit the communication. You can also add the permission manually in your windows firewall settings.
