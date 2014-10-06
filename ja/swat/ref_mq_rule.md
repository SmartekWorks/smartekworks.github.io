マッチング＆DSLの問い合わせ
===

ルールマッチングとクエリールールは、それに応じて、ウェブ画面からの値をWeb画面上の条件をアサートし、取得するために使用されている。普通単純なシナリオを構築し、それを自分のブラウザで自動的に実行したい場合は、ルールのいずれかのタイプを使用する必要はありません。しかしばがら、テスト効率を向上させ、複雑なシナリオ構築を支援するためには、これらのルールが必要です。

マッチングルールとは？
---

マッチングルールは、ウェブ画面上の条件をアサートするために使用できるドメイン固有言語の一つとして書かれてます。SWATの以下の機能にマッチングルールを使用することができます。

#### シナリオの自動検証

シナリオのチェックポイントへ追加し使うことができます。[**Assertion** system operation](ref_sys_operation.md#Operation_-_Assertion)  システムオペレーションのパラメータとしてマッチングルールをセットする必要があります。and when executing it, SWATはアクティブなウィンドウ内の画面でマッチングルールをパスすかどうかチェックします。 もし条件が満たされない場合、実行時エラーを報告します。 適切なアサーションでシナリオを設計する場合には、テストが手動ですべてのスクリーンショットをチェックせずに通過したかどうかがわかります。

自動検証を構築するには、いくつかやるべきことがありますが、それが大幅にテスト効率を向上させるには主に回帰テストで必要とされます。

#### シナリオでWindowsを見つける

ターゲットウィンドウを見つけて、それを操作するために使用できます。[**Window Control** system operation](ref_sys_operation.md#Operation_-_Window_Control)　システムオペレーションのパラメータとしてマッチングルールをセットする必要があり、それを実行するとき、SWATはマッチングルールにパスしたり現在のウィンドウに切り替え閉じたりする最初のWindowを見つけます。

#### 画面の識別

次の手順による画面ナレッジの識別としてマッチングルールを定義することができます。

1. メニュータグのナレッジから**画面ナレッジ**を開きます。
2. 左側のツリーにあるターゲット画面を選びます。
3. <span class="caret"></span>**保存**ボタンをクリックし、次へ進み、プルダウンメニューから**画面の識別**を選び、 **画面識別のマッチングルール**ダイアログ表示させます。
4. テスト領域のマッチングルールを入力し保存します。

画面の識別を定義したなら、SWATは _ページかどうか、その画面上でオペレーションを実行する前に、マッチングルールにパスするかどうかをチェックします。それは、ターゲット画面に似ていて間違った画面で操作を実行しないようにするのに役立ちます。 

マッチングルールのDSL
---

マッチングルールはアサーション条件のJSON map文字列です。SWATでは、通常、複数のマッチングルールを含むJSONリストでマッチングルールを使用しています。

```json
[
	{"target":"url", "have_text":"contract"},
	{"target":"title", "equal_text":"Search Results"}
]
```

### 構文

JSON　MAPは、キーの3種類が含まれています。

* `"frame"`: **(Optional)** ターゲットフレームの名前とID。 SWATはキーが定義されていない場合、主にHTMLを使います。 (Webアプリケーションフレームを使用していない場合は、キーを無視することができます。)
```json
{"frame":"main", "have_text":"Success"}
```
* `"target"`: **(Optional)** 評価対象。次の値を使用することができます。デフォルト値は`"body"`です。
```json
{"target":"url", "have_text":"contract"}
```
 * `"url"`: 画面のURL。
 * `"title"`: 画面のタイトル。
 * `"alert"`: すべてのアラートのテキストは、前回の動作に現れます。 (`"alert"`タイプは、システムオペレーションの**アサーション** で利用可能です。)
 * *Selector String*: 画面の領域で (タイプは、"frame"`キーを持っている場合、infirstマッチしたフレームで利用可能)CSSセレクターで定義される。 物理ページの領域に実装され、複数の論理ページがない限り、`"body"`使用をお勧めします。
* *Evaluation*: **(Required)** あなたは、以下のキーと値を指定することで、評価のいくつかのタイプを使用することができます。
```json
{"target":"title", "equal_text":"Search Results"}
{"have_css":{"css":"button#btnOK", "with_text":"Go"}}
```
 * `"equal_text"`: 目的のテキストは、キーの文字列値に等しくなければならない。
 * `"not_equal_text"`: 目的のテキストは、キーの文字列値に等しくない。.
 * `"have_text"`: 目的のテキストは、キーの文字列値に含まれる。
 * `"not_have_text"`: 目的のテキストは、キーの文字列値に含まれない。
 * `"have_css"`: 目的のテキストは、キーの文字列値に定義されたノードに含まれる。〝Target"はセレクタ文字列である場合にのみ有効です。
 * `"not_have_css"`: 目的のテキストは、キーの文字列値に定義されたノードに含まれない。 〝Target"はセレクタ文字列である場合にのみ有効です。

`` "have_css" `と` "not_have_css」の値は、JSON MAPで次のキーが含まれます。:

```json
{"have_css":{"css":"button#btnOK", "with_text":"Go"}}
```

* `"css"`: **(Required)** CSSセレクタによって定義されたノード
* `"with_text"`: **(Optional)** ノードのTEXTはキーの文字列値に等しくなければならないというCSSへ定義する条件を追加することができる。
* `"with_part_text"`: **(Optional)** You can add condition to `"css"` by defining that the `text` of the node should contain the string value of the key. SWAT will bypass this condition by default.
* `"with_value"`: **(Optional)** You can add condition to `"css"` by defining that the `value` of the node should equal to the string value of the key. SWAT will bypass this condition by default.
* `"with_href"`: **(Optional)** You can add condition to `"css"` by defining that the `href` of the node should equal to the string value of the key. As the href is from the actual DOM, it is the full URL instead of the relative URL you may defined in HTML. If you need use the `href` you defined in HTML, you can use CSS select with attribute match. SWAT will bypass this condition by default.
* `"with_index"`: **(Optional)** You can add condition to `"css"` by defining that the index (starting from `1`) of the matched node should equal to the number value of the key. SWAT will bypass this condition by default.
* `"enabled"`: **(Optional)** You can add condition to `"css"` by defining whether the node should be enabled or not (true/false). SWAT will bypass this condition by default.
* `"selected"`: **(Optional)** You can add condition to `"css"` by defining whether the node should be selected or not (true/false). SWAT will bypass this condition by default.
* `"displayed"`: **(Optional)** You can add condition to `"css"` by defining whether the node should be displayed or not (true/false). SWAT will use `true` by default.

### サンプル

* The page's URL should contain text the `"contract"`.
```json
{"target":"url", "have_text":"contract"}
```
* The page's title should equal to the text `"Search Results"`
```json
{"target":"title", "equal_text":"Search Results"}
```
* The frame with name `"main"` of the page should contain the text `"Success"`
```json
{"frame":"main", "have_text":"Success"}
```
* The page should contain a button with id `"btnOK"` and text `"Go"`.
```json
{"have_css":{"css":"button#btnOK", "with_text":"Go"}}
```
* On the page, the link with ID `"link1"` should link to `"http://www.smartekworks.com/"`.
```json
{"have_css":{"css":"#link1", "with_href":"http://www.smartekworks.com/"}}
```
* On the page, the button with ID `"btnBack"` should be disabled.
```json
{"have_css":{"css":"#btnBack", "disabled":true}}
```
* On the page, the second row of table with ID `"tblPersonel"` should contain the text `"John"`.
```json
{"have_css":{"css":"#tblPersonel tbody tr:nth-child(2)", "with_part_text":"John"}}
```
* On the page, the second radio with name `"gender"` should be selected.
```json
{"have_css":{"css":"input[name='gender']", "with_index":2, "selected":true}}
```

何のためのルールを照会する？
---

Querying rules are written in a kind of Domain-specific language, which we can use to retrieve values from a page. You can use querying rules in the following function of SWAT.

#### Using Values from Web Page

In some complicated scenario, you may need to use a value from the web page for succeeding operations. For example, you may need the *Order Number* shown on *Order Complete* page to search the status of the order.

To do this, you should use [**Set Value** system operation](ref_sys_operation.md#Operation_-_Set_Value) to retrieve the value from a web page and save it to an variable which can be used in parameters of later operations. You need to set a querying rule as a parameter of the system operation, and when executing it, SWAT will retrieve the value according to the rule.

Querying Rule DSL
---

Querying rule is a JSON map string with a query condition. 

```json
{"source":"title"}
```

### Syntax

The JSON map contains three type of keys:

* `"frame"`: **(Optional)** The target frame's name or ID. SWAT will use the main HTML if the key is not defined. (You can ignore the key if your web application does not use frames.)
```json
{"frame":"main", "source":"#orderNo", "css_key":"text"}
```
* `"source"`: **(Required)** The source of the value. You can use the following values.
```json
{"source":"#selectGender", "css_key":"value"}
```
 * `"url"`: URL of the page. You need to use `"query_key"` to retrieve the value of a parameter of the query string.
 * `"title"`: Title of the page.
 * `"alert"`: Text of the last alert appeared in the previous operation.
 * *Selector String*: A visable node (that must be displayed) in the page (first matched frame if you have `"frame"` key) defined by CSS selector. You need to use `"css_key"` to retrieve the text or attribute of the node.
* `"query_key"`: (Required when `"source"` is `"url"`) The parameter key of the query string.
```json
{"source":"url", "query_key":"orderNo"}
```
* `"css_key"`: (Required when `"source"` is *Selector String*) The attribute name of the node. You can also use `text` to retrieve the text of the node.
```json
{"source":"#selectGender", "css_key":"value"}
```
* `"css_index"`: (Optional, Only used when `"source"` is *Selector String*) If there are several nodes match the *Selector String*, you can use `"css_index"` to specify the node. SWAT will use `1` by default.
```json
{"source":"input[name='gender']", "css_key":"value", "css_index":2}
```

### Samples

* Use value of parameter `orderNo` in current URL.
```json
{"source":"url", "query_key":"orderNo"}
```
* Use value of the text of a `span` with ID `"orderNo"` in the frame with name `"main"` of the page.
```json
{"frame":"main", "source":"#orderNo", "css_key":"text"}
```
* Use value of the value of a select with ID `"selectGender"`.
```json
{"source":"#selectGender", "css_key":"value"}
```
* Use value of the `"name"` attribute of a button with ID `"btnOrder"`.
```json
{"source":"#btnOrder", "css_key":"name"}
```
* Use value of the value of the second radio with name `"gender"`.
```json
{"source":"input[name='gender']", "css_key":"value", "css_index":2}
```

