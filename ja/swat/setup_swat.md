SWATサーバーのセットアップ
===

SWATはクラウドサービスとオンプレミス版の両方を提供してます。SWATクラウドサービスを利用する場合はアカウント情報が必要で、SWATオンプレミス版を利用する場合は事前にプライベートサーバーにセットアップすることが必要です。

動作環境
---

|         | 動作環境
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 3072 MB (Windows), 2048 MB (Linux)
| OS      | Windows 7以降、Mac OS X 10.6以降、Ubuntu 10.4以降、Redhat 5以降（その他Linuxのディストリビューションでも動作する可能性があります）
| Others  | Java SDK 7をターゲット端末かVMにインストールが必要 


インストール手順
---

1. 最新版SWATのオンプレミス版をダウンロードします。
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
3. ターゲット端末上のインストールディレクトリにswat_xxx.zipファイルを展開します。
4. Windows以外のプラットフォームでセットアップする場合、SWATを実行するユーザーが、サブディレクトリに対する書き込み権限を持っていることが必要です。
5. 下記のサーバーの設定が完了後、サーバーの起動や停止については以下のコマンドを使用します。
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

設定手順
---

#### サーバーの設定

設定の殆どはSWATのUIから行うことができるため、SWATのサーバの設定ファイルにアクセスするためのIPアドレスを設定します。

Note: SWATサーバーをスタンドアロンで使用する場合、下記の設定が不要です。

1. テキストエディターで `<installation directory>/bin/setenv.bat` か `<installation directory>/bin/setenv.sh`を開きます。
2. `-DswatServer=http://127.0.0.1:8080`の`127.0.0.1`を実際のサーバーのアドレスへ変更します。

#### アカウントの設定

SWATのサーバを起動し、ブラウザでアカウントの設定を行います。

Note: SWATサービスを参照するためにInternet Explorer 10以降か、最新版Chrome、最新版Firefox、最新版Safariを使ってください。

1. `<installation directory>/bin/startup.bat` か `<installation directory>/bin/startup.sh`で実行し、 サーバーが起動完了するまで待ちます。
2. ブラウザで`http://<IP_ADDRESS>:8080`へ接続します。
3. 初期ユーザーID/パスワード (`manager`/`12345678`)でログインします。
4. サービス設定メニューからアカウント設定を選び、**アカウント設定**画面を表示させます。ここでアカウント情報を参照します。
5. 以下設定を完了させます。
 * **プラン情報**の隣の**更新**ボタンをクリックし、SWATを使用するためのライセンスコードを入力します。
 * SWATの実行と解析で使用するための**言語**を選択します。 (UI言語は使用中のブラウザに応じて切り替えます）
 * 必要に応じ、**タイムゾーン**とその他の設定を変更します。
6. 画面右上にあるユーザーアイコンから**プロファイル編集**画面を開き、初期ユーザーのパスワードの変更をします。 
7. 必要に応じて、サービス設定メニューから**ユーザー管理**画面を開き、新しいユーザーを登録します。

アップグレード手順
---

Note: 現在アップグレードのみサポートしています。ダウングレードをサポートしません。

1. 新しいバージョンのSWATのアップグレード用オンプレミス版をダウンロードします。
2. アップグレード用オンプレミス版を解凍後、配下のファイルをSWATの`<installation directory>/update`に移動します。（`update`フォルダが存在しない場合、作成をお願いします。）
3. アップグレード用スクリプを実行します。
Windowsでは、
```
cd <installation directory>/update
./update.bat
```
Linuxでは、
```
cd <installation directory>/update
./update.sh
```
4. アップグレードが失敗した場合、ロールバックスクリプトで旧バージョンに戻すことが可能です。
Windowsでは、
```
cd <installation directory>/update
./rollback.bat
```
Linuxでは、
```
cd <installation directory>/update
./rollback.sh
```

次へ
----

SWATサーバーのセットアップ後、シナリオを実行させる前に[実行サービスのセットアップ](setup_execservices.md#ローカル実行サーバー)が必要です。

独自に作業を始める前に[スタートガイド](guide_start.md)を一通り読むことをお勧めします。
