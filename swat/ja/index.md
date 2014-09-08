はじめに
===

### SWAT - Smart Web Application Testing

SWATはWebアプリケーション用コードレスUIテスト自動化ツールで、あなたがそのアプリケーションをどのように操作するのかシュミレートし、Webアプリケーションのテストを手助けします。SWATは実装や保守でのテスト自動化をより簡単にするために設計されてます。
Webマイニング技術を使い、Webページの相互作用を理解し、ビューレイヤやDOMに対してコードの書き込みや変更をすることなく実装や保守での自動化が行えます。SWATはまたBDD(振舞駆動開発）の方法論に従い、実行可能な受入基準としてのユーザストーリーを書くことができます。

私たちは、プライベートサーバー上で実行するパッケージ版SWATや、柔軟な利用で、よりアクセス可能なクラウド版SWATを提供しています。

何のためにSWATは使いますか？

---

#### 受入テスト


SWATはWebページをインプリする知識を必要とせず、ビジネスドメインのレベルでテストシナリオの構築をサポートします。これは、受入テストのためのテストシナリオを構築する特別な開発スキルのない設計者にとっては容易である。
自動化で、リグレッションテストとして受入テストを普通に実行することができます。SWATはまた受入テストと一緒にCIプロセスの構築にJenkinsとの連携をサポートします。

#### Browser compatibility test

SWAT provides local execution server based on Selenium WebDriver supporting various of local OS/browser combinations. It is easy to run cases on different platforms to test whether the rendering or action of javascript of your web application is correct on different combinations.

SWAT cloud service also supports running scenarios on [BrowserStack](http://www.browserstack.com), a public cloud execution service. You can easily test you web application on cloud with 300+ platforms from BrowserStack.

Why SWAT?
---

* Not requiring test engineers to build test scenarios and cases.
* Relieving the pain of test ware maintenance by automatic knowledge analysis. 
* Realising unified management and easy-to-use user experience with management server + web UI architecture.
* Supporting execution on various OS/browser combinations of desktop and mobile devices.
* Providing a more flexible monthly subscription SaaS model with low rate for both cloud service and package.

How does SWAT work?
---

SWAT adopts "Scenario-building & Replay" approach to do the automation of UI testing automation for web application. Instead of capturing your actual operations, modifying generated script and running the script, you just need the following steps in SWAT.

1. Importing HTML captures to SWAT 
SWAT's knowledge engine analyses web pages and extracts all the interactive operation models.
2. Building Scenario
Test designers connect different operation models to build a scenario.
3. Executing Scenario
SWAT's knowledge engine explains and executes the scenarios on the real browser.

Who should use SWAT?
---

The answer may depend on your current development/test process. However, there are several considerations on this question.

The biggest difference between SWAT and other automation tools/frameworks is that SWAT makes it possible for business analyst/designers to do the automated test. Therefore, they can use SWAT to build scenarios and cases.

However, to make an efficient automation, you need practices such as implementing auto verification, customizing the knowledge engine to generate operation models more precisely. knowledge in HTML, CSS, Javascript and development experiences are needed for these practices. Therefore, a good test engineer is recommended to help the SWAT use, especially in the automation deployment phase.

In conclusion, you may assigning a test team with test designers and one test engineer, skipping the test implementation phase, which is normally needed in test automation of waterfall styled development. You may also let the product owner use SWAT to do the test with the help from other developers in an agile team. If you are a developer, you can use SWAT to save much of your precious time writing/modifying test code.

Next Steps
----

#### Obtaining SWAT Trial Account

Visit [SWAT trial application page (Japanese only)](http://www.smartekworks.com/trial.html) or mail [us](mailto:sales@smartekworks.com) to apply for a trial account. 

#### The SWAT User Guide

[Learn SWAT in depth](guide_start.md).