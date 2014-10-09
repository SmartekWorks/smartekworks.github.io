マッチング、クエリルール
===

ルールマッチングとクエリールールは、それに応じて、ウェブ画面からの値をWeb画面上の条件をアサートし、取得するために使用されている。普通単純なシナリオを構築し、それを自分のブラウザで自動的に実行したい場合は、ルールのいずれかのタイプを使用する必要はありません。しかしばがら、テスト効率を向上させ、複雑なシナリオ構築を支援するためには、これらのルールが必要です。

マッチングルールとは？
---

マッチングルールは、ウェブ画面上の条件をアサートするために使用できるドメイン固有言語の一つとして書かれてます。SWATの以下の機能にマッチングルールを使用することができます。

#### シナリオの自動検証

シナリオのチェックポイントへ追加し使うことができます。[**画面検証**](ref_sys_operation.md#オペレーション_-_画面検証)システムオペレーションのパラメータとしてマッチングルールをセットする必要があります。and when executing it, SWATはアクティブなウィンドウ内の画面でマッチングルールをパスすかどうかチェックします。 もし条件が満たされない場合、実行時エラーを報告します。 適切なアサーションでシナリオを設計する場合には、テストが手動ですべてのスクリーンショットをチェックせずに通過したかどうかがわかります。

自動検証を構築するには、いくつかやるべきことがありますが、それが大幅にテスト効率を向上させるには主に回帰テストで必要とされます。

#### シナリオでWindowsを見つける

ターゲットウィンドウを見つけて、それを操作するために使用できます。[**ウィンドウ制御**](ref_sys_operation.md#オペレーション_-_ウィンドウ制御)システムオペレーションのパラメータとしてマッチングルールをセットする必要があり、それを実行するとき、SWATはマッチングルールにパスしたり現在のウィンドウに切り替え閉じたりする最初のWindowを見つけます。

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
* `"with_text"`: **(Optional)** ノードの`text`は、キーの文字列値に等しい定義により、`" CSS"`に条件を追加することができます。
* `"with_part_text"`: **(Optional)** ノードの`text`は、キーの文字列値を含む定義により、`" CSS"`に条件を追加することができます。SWATは、デフォルトでこの条件をバイパスします。
* `"with_value"`: **(Optional)** ノードの`value`は、キーの文字列値に等しい定義ににより、`" CSS"`に条件を追加することができます。SWATは、デフォルトでこの条件をバイパスします。
* `"with_href"`: **(Optional)** ノードの`href`は、キーの文字列値に等しい定義ににより、`" CSS"`に条件を追加することができます。hrefは実際のDOMからであり、HTMLで定義された相対URLの代わりで完全URLです。もしHTMLで定義されている`href`を使うなら、属性が一致するCSSセレクターを使うことができます。SWATは、デフォルトでこの条件をバイパスします。
* `"with_index"`: **(Optional)** マッチしたノードの（1 '`から始まる）インデックスは、キーの数値に等しい定義により、`"css"`に条件を追加することができます。SWATは、デフォルトでこの条件をバイパスします。
* `"enabled"`: **(Optional)** ノードを有効にすべきかどうか（true/false）の定義により、`" CSS"`に条件を追加することができます。SWATは、デフォルトでこの条件をバイパスします。
* `"selected"`: **(Optional)** ノードが選択されるべきかどうか（true/false）、`" CSS"`に条件を追加することができます。SWATは、デフォルトでこの条件をバイパスします。
* `"displayed"`: **(Optional)** ノードが表示されるべきかどうか（true/false）、" CSS"`に条件を追加することができます。SWATはデフォルトで`true`を使います。

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

問合せルールは、画面から値を取得するために使用することができるドメイン固有言語の一種で書かれています。SWATの以下機能でクエリ-ルールを使うことができます。

#### Web画面からの値を使用

いくつかの複雑なシナリオでは、オペレーションを続けるため、Web画面からの値を使う必要があるかもしれません。例えば、*ご注文番号*で注文のステータスを検索するために*注文完了*画面を表示させる場合があります。

この様な場合、ウェブ画面から値を取得し、オペレーション後のパラメータで使用することができる変数に保存して使うべきです。 [**画面変数設定**](ref_sys_operation.md#オペレーション_-_画面変数設定)システムオペレーションのパラメータとしてクエリ-ルールをセットすることが必要で、それを実行している時、SWATは規則に従って値を取得します。

DSLクエリ-ルール
---

ルールをクエリすると、クエリ条件によるJSONのマップ文字列です。

```json
{"source":"title"}
```

### 構文

JSON　MAPは、キーの3種類が含まれています。:

* `"frame"`: **(Optional)** ターゲットframe'sは名前かIDです。キーが定義されていない場合SWATはメインのHTMLを使用します。 (Webアプリケーションフレームを使用していない場合は、キーを無視することができます。)
```json
{"frame":"main", "source":"#orderNo", "css_key":"text"}
```
* `"source"`: **(Required)** 値のソース。次の値を使用することができます。
```json
{"source":"#selectGender", "css_key":"value"}
```
 * `"url"`: 画面のURL。クエリ文字列のパラメータ値を取得する`"query_key"`を使うことが必要です。
 * `"title"`: 画面のタイトル。
 * `"alert"`: 前の操作に現れた最終アラートのテキスト。
 * *Selector String*: CSSセレクターで定義した画面(`"フレーム"`キーを持っているなら、最初にマッチしたフレーム)の目に見えるノード (表示されなければならない)。 ノードのテキストまたは属性を取得するために` "css_key″´を使う必要があります。
* `"query_key"`: (Required when `"source"` is `"url"`) The parameter key of the query string.
```json
{"source":"url", "query_key":"orderNo"}
```
* `"css_key"`: (Required when `"source"` is *Selector String*) ノードの属性名。ノードのテキストを取得するために`text`を使用することができます。
```json
{"source":"#selectGender", "css_key":"value"}
```
* `"css_index"`: (Optional, Only used when `"source"` is *Selector String*) *セレクタ文字列*に一致するいくつかのノードがある場合、ノードを指定するために`"css_index"`を使うことができます。 SWATはデフォルトで `1`を使います。
```json
{"source":"input[name='gender']", "css_key":"value", "css_index":2}
```

### サンプル

* 現在のURLにある`orderNo`パラメータ値を使用。
```json
{"source":"url", "query_key":"orderNo"}
```
* 画面で`"main"`の名前を持つフレームで `"orderNo"` IDである `span`のテキスト値を使用。
```json
{"frame":"main", "source":"#orderNo", "css_key":"text"}
```
* `" selectGender"` IDを持つセレクト値の値を使用。
```json
{"source":"#selectGender", "css_key":"value"}
```
* ID`" btnOrder"`であるボタンの属性`"名前"`の値を使用。
```json
{"source":"#btnOrder", "css_key":"name"}
```
* `"性別"`名である2番目のラジオの値を使用。
```json
{"source":"input[name='gender']", "css_key":"value", "css_index":2}
```

