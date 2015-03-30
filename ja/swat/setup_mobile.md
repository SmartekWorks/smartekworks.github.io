モバイル実行環境のセットアップ
===

SWATは[Appium](http://appium.io/)を通して、iOSとAndroid搭載したモバイル機器のエミュレータ、実機でテストを実行させることができます。

モバイル実行環境の構成
---
モバイル実行環境を構築するために、下記のモジュールをそれぞれ用意する必要があります。

* iOS/Androidの開発環境：モバイルデバイス（エミュレータ）を開発モードで接続するためのツールです。
* Appium：モバイルデバイスのブラウザを駆動するためのツールです。
* SWATローカル実行サーバー：SWATのシナリオ、ケースをAppiumのノードサーバーに転送するプロキシです。

iOS/Androidの開発環境の構築
---
Google社とApple社の公式サイトからツールを入手し、ドキュメントを参考して環境を構築します。

* Android: http://developer.android.com/sdk/index.html
* iOS: https://developer.apple.com/programs/ios/

Hint: iOS/AndroidとAppiumの公式ドキュメント以外に、インターネット検索で日本語の情報を入手することをお勧めします。

Appiumのセットアップ
---

1. [Appiumサイト](http://appium.io/)からAppiumアプリファイルを入手します。
2. [Appiumスタートサイト](http://appium.io/getting-started.html?lang=en)を参照しで必要な環境準備を確認します。
3. Appiumを実行し、ノードサーバーを起動します。

Hint: Appiumをソースからビルドして利用する方法とGUIパッケージで利用する方法があります。後者を利用するのが便利ですが、ドキュメントに前者の説明が多いので、注意する必要があります。

ローカル実行サーバーの設定
---
SWATのローカル実行サーバーは通常のローカル実行以外に、Appiumもしくは他のRemoteWebDriver標準に準じたサービスを呼び出す機能があります。それを実現するために下記の設定が必要です。

#### account.ini
ローカル実行サーバーをリモートサービスを呼び出すように設定します。

```
driverMode＝remote
```

#### remote.json
リモートサービスを呼び出すための仕様をJSONフォーマットで定義し、`remote.json`のファイル名でローカル実行サーバーのディレクトリーに保存します。

定義例

```json
[
	{
		"url":"http://localhost:4723/wd/hub", 
		"parallelization":1, 
		"caps":{},
		"platforms": [
			{
				"code":"Android Test", 
				"parallelization":1, 
				"spec":{
					"os":"Android",
					"browser":"Chrome"
				},
				"caps":{
					"platformName":"Android",
					"platformVersion":"4.4",
					"deviceName":"Android Device",
					"browserName":"Chrome"
				}
			}
		]
	}
]
```

リモートサービスを呼び出すための仕様は複数のAppiumノードサーバー定義を含むJSON配列です。

* **Appiumノードサーバー定義**: Appiumノードサーバーの定義が下記になります。
 * `url`: AppiumノードサーバーのURL。デフォルトセットアップの場合、定義例を参照してください。 
 * `parallelization`: 並列で実行可能数。モバイルの場合`1`にしてください。
 * `caps`: Appiumノードサーバーで実行する際に追加したい`capabilities`のマップです。通常は空です。
 * `platforms`: 該当Appiumノードサーバーに含むプラットフォーム定義です。通常は1プラットフォームを定義します。
* **プラットフォーム定義**: プラットフォームの定義が下記のJSONマップです。
 * `code`: プラットフォームのコード名です。SWAT側で実行するときにプラットフォームの一覧に表示されます。
 * `parallelization`: 並列で実行可能数。モバイルの場合`1`にしてください。
 * `spec`: プラットフォームの仕様です。
 * `caps`: Appiumプラットフォームで実行する際に追加する`capabilities`のマップです。[Appiumの接続仕様](http://appium.io/slate/en/master/?java#automating-mobile-web-apps)に従って設定する必要があります。
* **プラットフォーム仕様**:プラットフォームの仕様が下記のJSONマップです。
 * `os`: OSのコード（`Windows`, `OS X`, `Linux`, `iOS`, `Android`）
 * `osVer`: OSのバージョン、例えば`"8.1"`。モバイルの場合記入する必要がありません。
 * `browser`: ブラウザのコード（`IE`, `Firefox`, `Chrome`, `Safari`, `Browser`）。iOSの場合`Safari`を利用し、Androidの場合モバイルの場合`Chrome`を利用します。
 * `browserVer`: ブラウザのバージョン、例えば`"6"`。モバイルの場合記入する必要がありません。

デバイスの実行準備
---
実行の前に、[Appiumでモバイルブラウザを駆動](http://appium.io/slate/en/master/?java#automating-mobile-web-apps)でデバイスの実行準備を実施する必要があります。また初回の実行に自動アップデートなどが行うため、時間かかる場合があります。


