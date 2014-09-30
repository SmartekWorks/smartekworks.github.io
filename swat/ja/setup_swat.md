SWATサーバーのセットアップ
===

SWATはクラウドサービスとパッケージ版の両方を提供してます。 SWATクラウドサービスを利用する場合はアカウント情報が必要で、SWATパッケージ版を利用する場合は事前にプライベートサーバーにセットアップが必要です。

動作環境
---

|         | 動作環境
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 3072 MB (Windows), 2048 MB (Linux)
| OS      | Windows 7以降、Mac OS X 10.6以降、Ubuntu 10.4以降、Redhat 5以降(その他Linuxの場合、ディストリビューションも動作可能)
| Others  | Java SDK 7をターゲットPCかVMにインストール必要 


インストール手順
---

1. 最新版SWATのリリースパッケージをダウンロードします。
2. JAVA Homeや環境設定のpathをセットアップします。例えば、
Windowsでは、
```
JAVA_HOME=C:\Program Files\Java\jdk1.7.0_45
Path=%JAVA_HOME%\bin
```
Linuxでは、
```
JAVA_HOME=/home/ubuntu/jdk1.7.0_45
PATH=/home/ubuntu/jdk1.7.0_45/bin
```
3. ターゲットコンピュータ上のインストールディレクトリにswat.xx.zipファイルを展開します
4. Windows以外のプラットフォームでセットアップした場合、アプリケーションを実行しているユーザーアカウントが、サブディレクトリに対する書き込み権限を持っていることが必要です。
5. サーバー設定後は、サーバーの起動や停止については以下のコマンドを使用します。
Windowsの場合
```
<installation directory>/bin/startup.bat
<installation directory>/bin/shutdown.bat
```
Linuxの場合、
```
<installation directory>/bin/startup.sh
<installation directory>/bin/shutdown.sh
```

設定
---

#### サーバーの設定

設定の殆どはSWATのUIからセットすることができます。SWATのサーバにアクセスするための設定ファイルではIPアドレスを設定します。

1. テキストエディターで `<installation directory>/bin/setenv.bat` か `<installation directory>/bin/setenv.sh`を開きます。
2. `-DswatServer=窶鷲ttp://IP_ADDRESS:8080窶兪を確認し、実際のサーバーアドレス`IP_ADDRESS`へ変更します。SWATサーバーをスタンドアロンで使用しない場合は、`127.0.0.1` か `localhost`は使用しません。

#### アカウントの設定

SWATのサーバを起動し、ブラウザに残っているアカウントの設定を行います。

ノート：SWATサービスを参照するためにInternet Explorer 10以降か、最新版Chrome、最新版Firefox、最新版Safariを使ってください。

1.`<installation directory>/bin/startup.bat` か `<installation directory>/bin/startup.sh`で実行し、 サーバーの起動完了するまで待ちます。
2.ブラウザで`http://<IP_ADDRESS>:8080`へ接続します。
3.user/password (`manager`/`12345678`)でログインします。
4.メニュータグのサービス設定からアカウント設定を選び、**アカウント設定**画面を表示させます。ここでアカウント情報を参照します。
5.以下設定を完了させます。
 * **アップデート**ボタンをクリックし、次にSWATを使用する前に**プラン情報**やライセンスコードを入力します。
 * SWATの実行と解析で使用するために**内部言語**を選択します。 (UI言語は使用中のブラウザに応じて切り替えます）
 * 必要に応じ、**タイムゾーン**とその他の設定を変更します。 (これはユーザガイドで説明してます。[User Guide](guide_start.md), [Setup Execution Services](setup_execservices.md) and [Setup Tools and Integrations](setup_tools.md))
6.TOP画面右上にあるアイコンをクリックし、**プロファイル編集**画面を開き、プロファイルの編集とパスワードの変更をします。 
7.メニュータグのサービス設定から**ユーザ管理**画面を開き、新しいユーザをセットアップしても構いません。.

次へ
----

SWATサーバーのセットアップ後、シナリオを実行させる前に [Local Execution Services](setup_execservices.md#Setup_Local_Execution_Server)のセットアップが必要です。

独自に作業を始める前にユーザガイド [User Guide](guide_start.md)を終了させることをお勧めします。
