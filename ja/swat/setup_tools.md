ツールと外部連携のセットアップ
===

SWATは、より効率的にテスト自動化を実現させるために、いくつかのツールや他のサービスとの連携機能を提供しています。

SWATキャプチャー
---

**SWATキャプチャー**は、SWAT画面ナレッジのインポートで使用されるWebアプリケーションのHTMLをキャプチャするブラウザ拡張機能です。ブラウザの機能で*HTMLとして保存*を使うことも可能ですが、Webアプリケーションのフレーム構造を扱う場合や、HTMLがリアルタイムレンダリングされている場合に**SWATキャプチャー**を使用する必要があります。

**SWATキャプチャー**は、Google Chrome、Mozilla FirefoxとInternet Explorerで提供されます。

Attention: 一部拡張機能によって、WebページのDOMが変更されることがあるため、**SWATキャプチャー**を使用する前にそれらをアンインストールすることをお勧めします。

### Google Chrome

#### 動作環境

* Google Chrome 31以降 

#### 拡張機能のインストール

1. Chromeブラウザを開き、Chrome Webストアの[SWATキャプチャー画面](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie)へ移動します。 
2. <span class="glyphicon glyphicon-plus"></span> **無料**ボタンで拡張機能をインストールします。 インストール完了後は、Chromeのツールバーに![SWAT icon](/swat/assets/images/extension.png)が表示されます。

#### 拡張機能の利用

1. 任意のWebページを開き、![SWAT icon](/swat/assets/images/extension.png) をクリックします。 
2. SHTMタイプ（SWATが使うHTMLコンテナの一種）のファイルは、デフォルトでは自動的にダウンロードフォルダーに保存されます。

### Mozilla Firefox

#### 動作環境

* Mozilla Firefox 29以降

#### アドオンのインストール

1. Firefoxブラウザを開き、Firefoxアドアンのマーケットプレースの[SWATキャプチャー画面](https://addons.mozilla.org/firefox/addon/firefoxswatcapture/)へ移動します。 
2. <span class="glyphicon glyphicon-plus"></span> **Firefoxに追加**ボタンでアドアンをインストールします。 インストール完了後は、Firefoxのツールバーに![SWAT icon](/swat/assets/images/extension.png)が表示されます。

#### アドオンの利用

1. 任意のWebページを開き、![SWAT icon](/swat/assets/images/extension.png) をクリックします。 
2. **名前を付けて保存**ダイアログでターゲットフォルダーを選択し、保存します。
3. SHTMタイプとしてファイルはターゲットフォルダーに保存されます。

### Internet Explorer

#### 動作環境

* Internet Explorer 9以降
* Internet Explorer 32bit
* [.NET Framework 4.0](http://www.microsoft.com/en-US/download/details.aspx?id=17718)

#### 拡張機能のインストール

1. [ここ](http://www.smartekworks.com/tools/swat-ie-capture.zip)からインストール用zipをダウンロードします。
2. zipをインストール先に解凍してください。
3. cmd.exeを検索、それに対して右クリックで「管理者として実行」を選びます。
4. 開いたコマンドウィンドウのインストールフォルダに入り、install.batを実行します。（アンインストールの場合uninstall.batを実行します）

Note: 端末によって、「Could not load file or assembly or one of its dependencies. Operation is not supported. (Exception from HRESULT: 0x80131515)」のエラーが発生することがあります。その場合、フォルダにある二つのDLLファイルに対して右クリックで、プロパティの「ブロックの解除」ボタンをクリックし、再度インストールしてください。

#### 拡張機能の利用

1. 管理者モードでInternet Explorer 32bitを動かします。ブラウザのツールバーに![SWAT icon](/swat/assets/images/extension.png)が表示されます。
2. 任意のWebページを開き、![SWAT icon](/swat/assets/images/extension.png) をクリックします。 
3. **名前を付けて保存**ダイアログでターゲットフォルダーを選択し、保存します。
4. SHTMタイプとしてファイルはターゲットフォルダーに保存されます。

Jenkinsとの連携
---

SWATサービスは受入テストとしてCIプロセスにJenkinsと下記のように連携することができます。

* JenkinsビルドとしてSWATのケースを実行します。
* Jenkinsでテスト実行の進捗を参照します。
* Jenkinsでテスト結果レポートを参照します。

#### Jenkinsプラグインのインストール

1. Jenkinsのインストールディレクトリ下の`plugins`ディレクトリに[swat-execute-plugin.hpi](http://www.smartekworks.com/tools/swat-execute-plugin.hpi)をコピーします。
2. Jenkinsを再起動しログインします。
3. Jenkins管理からシステム設定を選び、**システム設定**画面を開き、**SWAT Execution**セクションが追加されていることが確認できます。 
4. 下記パラメータを設定し、保存します。
 * **Server URL**: SWATアカウントのサーバURLです。**アカウント設定**画面からこの情報を得ることができます。
 * **Api key**: SWATアカウントのapiキーです。**アカウント設定**画面からこの情報を得ることができます。
 * **Secret key**: SWATアカウントのSecretキーです。**アカウント設定**画面からこの情報を得ることができます。
 * **Progress query interval**: 実行進捗クエリの間隔（秒）です。デフォルト値は`30`です。

#### Jenkinsビルドの設定

1. JenkinsにSWATケースを実行させるためのJenkinsプロジェクト（フリースタイルソフトウェアプロジェクト）を作成します。
2. ビルドセッションでは、**SWAT Execution**をビルドステップに追加し、 **Request Information**に実行リクエスト文字列を入力します。
3. **ビルド後のアクション**セクションに**Publish JUnit test result report**アクションを追加し、**Test report XMLs**に`swat_result.xml`を入力します。
4. プロジェクトを保存します。

#### 実行リクエスト文字列を取得

1. SWATサービスの対象テストセットにある**シナリオ一覧**画面を表示します。
2. 対象ケースを選び、**実行**ボタンをクリックします。
3. 必要に応じて新しい実行のオプションを変更します。
4. **確定**ボタンをクリックする代わりに、 **確定**ボタンの次のプルアップリストの**ケース実行リクエスト生成（Jenkins）** か **テストセット実行リクエスト生成（Jenkins）**を選びます。
5. **実行リクエスト情報（Jenkins）**ダイアログは、Jenkinsを設定するために必要な実行リクエスト文字列で表示されます。

ATLASSIAN社のJIRAとの連携
---

SWATは内部の課題管理システムをATLASSIAN社のJIRAに置き換え使用することができます。 連携機能は以下の通りです。

* SWATからJIRAプロジェクトへ課題を起票します。
* 特定のテスト結果に関連する課題を検索します。
* SWAT画面とJIRAプロジェクト画面とをシームレスに切り替えることができます。

Note: 連携のために、SWATサービスからJIRAサービスにアクセスできることが必要です。そのため、SWATオンプレミス版でJIRAオンデマンドやJIRAオンプレミス版を両方使うことができますが、SWATクラウドサービスではJIRAオンデマンドのみ使うことができます。

#### JIRAの設定

* 少なくとも１つのJIRAプロジェクトを必要とします。
* SWATで使用される課題の種類に関する以下のコードは、プロジェクトに追加する必要があります。
 * `bug`, `duplicate`, `enhancement`, `question`, `others`

#### SWATの設定

1. サービス設定メニューから**アカウント設定**を選び、 **アカウント設定**画面を開きます。 
2. *外部サービス連携**フィールドに以下のようにJIRAアカウント情報の設定文字列を入力します。 
```json
{
	"jira":{
		"url":"https://xxxx.atlassian.net", 
		"username":"Demo", 
		"password":"Demo", 
		"project":"demo"
	}
}
```

#### 設定文字列

設定文字列は以下ルールを持つJSONマップです。

* `"jira"`キーを使い、値として以下キーを持つ設定マップです。
 * `"url"`: **（必須）** JIRAサービスのURLです。
 * `"username"`: **（必須）** JIRAアカウントのユーザネームです。
 * `"password"`: **（必須）** JIRAアカウントのパスワードです。
 * `"project"`: **（必須）** SWATのプロジェクト名です。このキーは必須ではありません。設定しない場合、SWATはSWATのプロジェクトコードをJIRA内のプロジェクト名として使用します。どっちかの場合、JIRAの対象プロジェクトが存在することが必要です。

エージェントAPIの連携
---

シナリオの中でデータベースへアクセスすることや、ファイル操作をすることなどの拡張オペレーションを実行するために、シナリオから外部Webサービスを呼び出すことができます。 その場合、[エージェントAPI仕様](ref_agent_api.md)に準拠したエージェントサーバを構築する必要があります。 詳細は[データベース、ファイル操作](article_api_call.md)を参照ください。

**外部API呼び出し**システムオペレーションを使い直接APIのURLを入力することができますが、またAPI連携するための設定をすれば、**外部API呼び出し**システムオペレーションから、事前に定義されたAPIを選択することもできます。

#### SWATの設定

1. システム設定メニューから**アカウント設定**を選び、**アカウント設定**画面を表示します。
2. **外部サービス連携**フィールドに以下のようにAPI情報の設定文字列を入力します。 
```json
{
	"agent_api":{
		"Obtain server log":"http://xxx.xxx.xxx.xxx:xxx/log/webserver",
		"Obtain db diff":"http://xxx.xxx.xxx.xxx:xxx/db/diff",
		"Initialize db":"http://xxx.xxx.xxx.xxx:xxx/db/initialize"
	}
}
```

#### 設定文字列

設定文字列は以下ルールを持つJSONマップです。

* `"agent_api"`キーを使い、値として以下キーを持つ設定マップです。
* マップのキーはAPIの名前で、値はURLです。