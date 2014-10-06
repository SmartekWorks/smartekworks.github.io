ツールおよび他システム連携のセットアップ
===

より効率的にSWATを使用する際に役立ついくつかのツールや他のサービスとの統合を提供しています。

SWATキャプチャー
---

**SWATキャプチャー** は、SWAT画面ナレッジのインポートで使用されるWebアプリをHTMLsでキャプチャするブラウザ拡張機能である.SWATはまたブラウザの機能で*HTMLsとして保存*を使うことでHTMLｓを保存もサポートしてます。しかし、**SWATキャプチャー**は、Webアプリのフレーム構造を扱う場合や、HTMLのリアルタイムレンダリングされている場合のキャプチャで使用する必要があります。 
**SWATキャプチャー** は、Google ChromeやInternet Explorerで提供されます。

注意：いくつかの拡張機能を使用すると、WebページのDOMを変更するため、** SWATキャプチャツール**を使用する前にそれらをアンインストールすることをお勧めします。

### Google Chrome

#### 条件

* Google Chrome 31以降 

#### 拡張機能のインストール

1. Start Chromeブラウザを開き、ChromeのWeb Store画面からSWATキャプチャーを開きます。[SWAT Capture Tool page](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie)
2. <span class="glyphicon glyphicon-plus"></span> **Free**ボタンをクリックし、拡張機能をインストールします。 ChromeのツールバーにSWATアイコン![SWAT icon](/swat/assets/images/extension.png)が表示されます。

#### 拡張機能の利用

1. 任意のWeb画面を開き、SWATアイコン![SWAT icon](/swat/assets/images/extension.png)をクリックします。 
2. SHTMLタイプのファイルとして自動的にダウンロードディレクトリに保存されます。

ノート: SHTMLファイルフォーマットはSWATが使うHTMLコンテナの一種です。 

### Internet Explorer

#### 条件

* Internet Explorer 9以降
* Internet Explorer 32bit
* [.NET Framework 4.0](http://www.microsoft.com/en-US/download/details.aspx?id=17718)

#### 拡張機能のインストール

1.弊社のダウンロードページからインストール用zipをダウンロードします。[here](http://www.smartekworks.com/tools/swat-ie-capture.zip)
2.zipをインストール先に解凍してください。
3.cmd.exeを検索、それに対して右クリックで「管理者として実行」を選びます。
4.開いたコマンドウインドにインストールフォルダに入り、install.batを実行します。（アンインストールの場合uninstall.batを実行します）
端末によって、「Could not load file or assembly or one of its dependencies. Operation is not supported. (Exception from HRESULT: 0x80131515)」のエラーが発生することがあります。その場合、フォルダにある二つのDLLファイルに右クリックし、プロパティに「ブロックの解除」ボタンをクリックし、再度インストールしてください。

1. Windows Explorerでインストールフォルダーを開きます。
2. DLLファイルの一つを右クリックし、コンテキストメニューからプロパティを選びます。
3. ダイアログ結果画面の右下のUnblockボタンをクリックします。
4. 他のDLLファイルへ同じ操作をします。

#### 拡張機能の利用

1. 管理者モードでInternet Explorer 32bitを動かします。ブラウザのツールバーにSWATアイコンが表示されます。[SWAT icon](/swat/assets/images/extension.png)
2. 任意のWeb画面を開き、SWATアイコンをクリックします。[SWAT icon](/swat/assets/images/extension.png) 
3. ターゲットフォルダーを選択します。もし**名前を付けて保存**ダイアログを望む場合ファイル名を変え、保存します。
4. SHTMLタイプとしてファイルはターゲットフォルダーに保存されます。

Jenkinsとの統合
---

SWATサービスは受入テストとしてCIの実装にJenkinsと統合することができます。 統合機能としては下記の通りです。

* JenkinsビルドとしてSWATのケースを実行します。
* Jenkinsでテストの進捗を参照します。
* Jenkinsでテスト結果レポートを参照します。

#### Jenkinsプラグインのインストール

1. Jenkinsのインストールディレクトリ下に`pligin`ディレクトリ[swat-execute-plugin.hpi](http://www.smartekworks.com/tools/swat-execute-plugin.hpi)をコピーします。
2. Jenkinsを再起動しログインします。
3. Jenkins管理からシステム設定を選び、**システム設定**画面を開き、**SWAT実行**セクションに追加されていることが確認できます。 
4. 下記パラメータを設定し、保存します。
 * **Server URL**: SWATアカウントのサーバURLです。**アカウント設定**画面からこの情報を得ることができます。
 * **Api key**: SWATアカウントのapiキーです。**アカウント設定**画面からこの情報を得ることができます。
 * **Secret key**: SWATアカウントのSecretキーです。**アカウント設定**画面からこの情報を得ることができます。
 * **Progress query interval**: 各進行クエリ間の時間です。デフォルト値は`30秒`です。

#### Jenkinsビルドの設定

1. JenkinsにSWATケースを実行させるためのプロジェクト（フリースタイルソフトウェアプロジェクト）を作成します。
2. ビルドセッションでは、**SWAT実行**をビルドステップに追加し、 SWAT実行要求の文字列に**要求情報**に入力します。
3. **ビルド後のアクション**セクションでは、**Publish JUnit test result report**にビルド後のアクションを追加し、**XMLsテストレポート**に`swat_result.xml`を入力します。
4. プロジェクトを保存します。

#### 実行要求文字列を取得

1. SWATサービスのターゲットテストセットにある**シナリオ**画面を表示します。
2. ターゲットケースを選び、**実行**ボタンをクリックします。
3. 新しい実行の作成など、必要に応じてオプションを変更します。
4. **OK**ボタンをクリックする変わりに、 プルアップリストの**Jenkins要求** か **Jenkins要求(Total Set)**を選び、次の**OK**ボタンをクリックします。
5. **要求情報**ダイアログは、Jenkinsを設定するために必要な要求文字列で表示されます。

JIRAとの統合
---

SWATは内部の課題管理システムをJIRAに置き換え使用することができます。 統合機能は以下の通りです。

* SWATからJIRAプロジェクトへ課題を起票します。
* 特定のテスト結果に関連する問題を検索します。
* SWAT画面とJIRAプロジェクト画面とをシームレスに切り替えることができます。

ノート: SWATサービスは統合機能でJIRAサービスにアクセスすることができることを確認します。 この理由として、 SWATパッケージでJIRAオンデマンドやJIRAパッケージを使うことがで、SWATクラウドサービスでJIRAオンデマンド使うことができます。

#### JIRA設定

* 少なくとも一つのJIRAプロジェクトを必要とします。
* SWATで使用される課題の種類に関する以下の名前は、プロジェクトに追加する必要があります。
 * `bug`, `duplicate`, `enhancement`, `question`, `others`

#### SWAT設定

1. サービス設定のアカウント設定を選び、 **アカウント設定**画面を開きます。 
2. *拡張機能**フィールドに以下のようにJIRAアカウント情報へ構成文字列として入力します。 
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

#### 文字列設定

文字列設定は以下ルールを持つJSON mapです。

* `"jira"`キーを使い、値として以下キーを持つ設定mapです。
 * `"url"`: JIRAサービスのURLです。
 * `"username"`: JIRAアカウントのユーザネームです。
 * `"password"`: JIRAアカウントのパスワードです。
 * `"project"`: SWATのプロジェクト名です。 キーを設定しない場合、SWATはJIRA内のプロジェクト名をSWATのプロジェクトコードで使用します。キーは必須ではありません。JIRAの対象プロジェクトは、両方に存在することを確認できます。
 
エージェントAPIの統合
---

シナリオ中にDBアクセスのようなファイル操作の拡張操作を実行するために、Webサービスを呼び出すことができます。 拡張操作については、[エージェントのAPI仕様]（ref_agent_api.md）に準拠したエージェントサーバを構築する必要があります。 詳細はこちらを参照ください。[DB Access and File Manipulation](article_api_call.md)

システムオペレーションの**API CALL**を使い直接APIのURLを入力することができます。またSWATで統合のセットアップを可能とし、システムオペレーションの**API CALL**で定義されたAPIを選択することもできます。

#### SWAT設定

1. システム設定からアカウント設定を選び、**アカウント設定**画面を表示します。
2. **拡張機能**フィールドで以下一つの例としてAPI情報をもつ構成文字列を入力します。 
```json
{
	"agent_api":{
		"Obtain server log":"http://xxx.xxx.xxx.xxx:xxx/log/webserver",
		"Obtain db diff":"http://xxx.xxx.xxx.xxx:xxx/db/diff",
		"Initialize db":"http://xxx.xxx.xxx.xxx:xxx/db/initialize"
	}
}
```

#### 構成文字列

構成文字列は以下るーるをもつJSON　mapです。

* Use the key `"エージェントapi"`やAPI mapのキーを使います。
* API mapのキーは名前で、値はURLです。
* JIRAの統合を使う場合、構成文字列は`"jira"`キー含むみます。.
