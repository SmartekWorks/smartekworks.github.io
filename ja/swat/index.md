はじめに
===

### SWAT - Smart Web Application Testing

SWATはWebアプリ用コードレスUIテスト自動化ツールです。あなたがそのWebアプリをどのように操作するのかシュミレートし、Webアプリのテストを手助けします。SWATは開発や保守でのテスト自動化をより簡単にするために設計されてます。

それは、Webマイニング技術を使い、Webページのオペレーションを理解し、ビューレイヤやDOMに対してテストコードの書き込みや変更をすることなく開発や保守でのテスト自動化が行えます。SWATはまたBDD(振舞駆動開発）の方法論に従い、要求仕様に則ったユーザストーリーを受入基準で書くことができます。

SWATは、柔軟な利用を可能とするクラウド版とプライベートサーバー上で実行するパッケージ版を用意します。

何のためにSWATは使いますか？
---

#### 受入テスト

SWATはWebページを開発する知識を必要とせず、ビジネスドメインのレベルでテストシナリオ作成を可能とします。これは、受入テストのためのテストシナリオを作成する特別な開発知識のない設計者でも可能ということです。

自動化回帰テストとして受入テストを普通に実行することができます。SWATはまた受入テストと一緒にCIプロセスの構築にJenkinsとの連携をサポートします。

#### ブラウザ互換テスト

SWATはさまざまなOSやブラウザの組み合わせをサポートしているSelenium WebDriverベースのローカル実行サーバーを用意します。これは、WebアプリのJavaScriptによる描画や動作が異なるOS・ブラウザ組み合わせで正しいかどうかをテストするために、異なるプラットフォーム上でテストケースを実行することを簡単にしてます。

SWATクラウドサービスでは、 [BrowserStack](http://www.browserstack.com)上でシナリオの実行をパブリッククラウド実行サービスとしてサポートします。BrowserStackのクラウド環境から300以上のOS・ブラウザ組み合わせで、Webアプリを簡単にテストすることができます。

なぜSWATですか？
---

* テストシナリオやケースを作成するための専任テストエンジニアを必要としない。
* 自動ナレッジ解析によりテストウェアのメンテナンスを楽にする。
* テストウェアの一元管理と使い易いユーザエクスペリエンスを提供する。
* さまざまなOSとブラウザを組み合わせたデスクトップやモバイル端末での実行をサポートする。
* クラウドサービスとパッケージ共に低価格で月単位での契約を用意する。

SWATをどのように動かしますか？
---

SWATはWebアプリのUIテスト自動化に於いて”シナリオの組み立て＆リプレイ”方式を採用してます。実際の操作のキャプチャー、生成されたスクリプトの修正の代わりに、は以下の手順で自動化を実現しています。

1. HTMLキャプチャーをSWATにインポ―ト
WebページをSWATのナレッジエンジンで解析し、すべてのオペレーションをモデル化します。
2. シナリオ作成
テスト設計者はシナリオ作成をするために必要なオペレーションモデルを組み合わせます。
3. シナリオの実行
SWATのナレッジエンジンでシナリオを解釈し、実ブラウザ上で実行します。

誰がSWATを使いますか？
---

その答えは現在の開発手法やテストプロセスに関係します。しかしながら、この質問にいくつかの考慮すべき事があります。

SWATと他の自動化ツールとの間には大きな違いがあり、SWATはビジネスアナリストや設計者が自動化テストを行うことを可能にしてます。したがって、彼らはシナリオやケースを作成するために、SWATを利用すべきです。

しかしながら、効率的に自動化をさせ、自動検証を実施するには、そのためのプラクティスが必要です。より正確なオペレーションモデルを生成させるにはナレッジ解析のカスタマイズも場合によっては必要です。このカスタマイズでは、HTML、CSS、Javascriptなどの開発経験や知識は必要となります。従ってこれらの知識を有するテスト技術者はとりわけテスト自動化の準備段階で係わることを推奨します。

従って、通常ウォーターフォールスタイルの開発の場合、テスト設計者と開発スキルを有するテスト技術者を一人テストチームに割り当て、テスト自動化が進める利用ケースが多いです。アジャイルスタイルの開発の場合、プロダクトオーナーはアジャイルチームの開発者の助けを借りてSWATを利用するのも効率的です。単なる開発者の場合、SWATを簡単に使いこなし、テストコードを書いたり、修正したりする多くの貴重な時間を節約することができます。

次へ
----

#### SWAT無償版アカウントの取得

[SWAT無償版ページ](http://www.smartekworks.com/free.html)で無償版をお申し込みしてください。

#### SWATユーザガイド

[SWATの利用を勉強](guide_start.md)。