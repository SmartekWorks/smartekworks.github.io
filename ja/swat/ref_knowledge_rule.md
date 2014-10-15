画面ナレッジルール
===

SWATのナレッジルールは、Web画面の実装と操作方法を説明するためのドメイン固有言語です。SWATナレッジエンジンは、Web画面を分析する能力を持っていますが、Web画面の様々な実装へ対応するためにはナレッジルールが必要です。

なぜナレッジルールが必要か？
---

SWATは最初に最も一般的なWeb画面の作りを基に定義されているデフォルトのナレッジルールを持ちます。以下の目的のために、デフォルトのナレッジルールを変更することができます。

* 非インタラクティブなHTMLタグで構成されたオペレーションを追加します。 JavascriptやJSのライブラリを使用して`div`などの非インタラクティブなHTMLタグをそうできるようになります。[スタートガイド](guide_tuning.md#画面ナレッジチューニング)でサンプルが参照できます。
* デフォルトのオペレーションサイズを変更します。デフォルトルールで一般的な使いやすさに応じて適切なサイズでのオペレーションを抽出します。しかし、時には複数のオペレーションをマージしたり、いくつか小さな操作に分割するために、デフォルトルールを変更します。
* 実行中にオペレーションの場所を特定する方法を変更します。自動化のケースが動的画面上で実行されていることが多く、信頼性の高い自動化のためのロケーティング方針が必要です。殆どのWebアプリケーションは`id`や`name`などで統一されたロケーティング方針が持ちません。その場合、ナレッジルールで柔軟にロケーティング方法を定義することができます。
* オペレーションとノードのラベルを取得する方法を変更します。SWATはオペレーションとノードを抽出する際にHTMLからラベルを取得しようとします。Webアプリケーションの特性によってより適切なラベル取得方法を定義することができます。

Note: デフォルトルールは、より多くの実装に対応するため常に更新されます。 また、様々な実装に対応するためにいくつかのテンプレートルールを提供する予定です。

ナレッジルールの基礎
---

### ナレッジルールの管理

ナレッジルールは、特定グループのWeb画面、例えばWebアプリケーション配下のすべてのWeb画面で設計されています。そのため、ナレッジルールは、SWATサイトの下で管理されています。Webアプリケーションでの実装にはいくつかのタイプを持っているため、サイトの下に、いくつかのルールを設定できます。メンテナンスを楽にするためにお勧めしませんが、特定のWeb画面のナレッジルールを追加することができます。

SWATの画面ナレッジの各バージョンは、同じサイトの下のナレッジルールに関連しています。SWATはそのルールに基づいて画面ナレッジを扱うので、それが使用された後、ナレッジルールを変更することはできません。代わりに、新しいルールを追加し、画面ナレッジをアップグレードすることで、画面ナレッジの新しいバージョンが追加されます。

### 構文

ナレッジルールは、以下のコンポーネントを定義するJSONマップの文字列です。各コンポーネントの構文の詳細については後述します。

```json
{
	"operations":[
	],
	"collectionNodes":{
	},
	"singleNodes":{
	},
	"labelPolicies":{
	},
	"locatorPolicies":{
	}
}```

* `singleNodes`: シングルノードは、画面を操作するアトミックノードです。例えばテキストボックス、ボタンとかです。
* `collectionNodes`: コレクションノードは特定の関係でシングルノードや他のコレクションノードの集まりです。例えば、順番的に操作する一つのフォーム配下のすべての入力、どちらかを選択してクリックするリストの中のリンクとかです。
* `operations`: オペレーションは最終的に画面ナレッジのオペレーションとして抽出される特別なcollectionNodeです。
* `labelPolicies`: ラベルポリシーは、画面ナレッジを生成する際に、シングルノードとコレクションノードのラベルを取得する方法を定義します。
* `locatorPolicies`: ロケーターポリシーは、実行中にシングルノードとコレクションノードの場所を特定する方法を定義します。

`singleNodes`、`collectionNodes`、`operations`は最も重要なコンポーネントです。それらはすべてのルールのために必要とされ、一方、`labelPolicies`、`locatorPolicies`は定義は必須ではありません。

主要コンポーネント
---

### シングルノードの定義

シングルノードは、JSONマップが定義されます。キーはコード（コレクションノードの定義から参照するコード）で値はノードの定義です。下記サンプルを参照ください。 

```json
{
	"singleNodes":{
		"link":{"selectors":["a[href]", "area[href]"], "decisive":true, "action":"click", "label":"link", "locator":"link"}
		"radio":{"selectors":["input[type=radio]"], "decisive":false, "action":"click", "label":"fieldRight", "locator":"field", "group":{"by":"name", "label":"group", "locator":"group"}},
	}
}
```

シングルノードの定義は、以下キーの値を含むJSONマップです。

* `"selectors"`: **（必須）** HTMLのDOM内のノードを定義するCSSセレクタのJSONリスト。
* `"decisive"`: **（必須）** 該当ノードがオペレーションを完結するか、しないかどうかを`true`か`false`かで示します。たとえば、通常のボタンには`true`を使用し、テキストボックスには`false`を使用します。
* `"action"`: **（必須）** ノードに対して可能なアクションタイプを示すアクションコードです。下記のアクションコード表を参照してください。
* `"label"`: **（任意）** ラベルポリシーコードで`labelPolicies`に定義されたラベルの取得方法を使用します。
* `"locator"`: **（任意）** ロケーターポリシーコードで`locatorPolicies`に定義されたノードの場所を特定する方法を使用します。
* `"group"`: **（任意）** ラジオやチェックボックスのようなノードをグループする方法を定義します。JSONマップ定義には以下のキーが含まれます。
 * `"by"`: **（任意）** ノードをグループ化するために使用する属性名です。 `"name"`がデフォルトで使用されます。
 * `"label"`: **（任意）** グループ全体のラベルポリシーコードです。
 * `"locator"`: **（任意）** グループ全体のロケーターポリシーコードです。

アクションコードテーブル:

| アクション       | 説明
| --------------- | -----------
| `"type"`        | テキスト入力などのノードにテキストを入力
| `"upload"`      | ファイル入力などのノードにファイルパスを設定
| `"select"`      | セレクトのオプションなどのノードを選択
| `"check"`       | チェックボックスなどのノードをチェック
| `"click"`       | ボタンなどのノードをクリック
| `"moveTo"`      | ホバーボタンとしてノードにマウスカーソルを移動
| `"rightClick"`  | コンテキストメニューのリンクなどのノードを右クリック
| `"doubleClick"` | ダブルクリック可能な領域などのノードをダブルクリック

### コレクションノードの定義

コレクションノードは、JSONマップが定義されます。キーはコード（コレクションノードかオペレーションの定義から参照するコード）で値はノードの定義です。下記サンプルを参照ください。 

```json
{
	"collectionNodes"
	{
		"form":{"selectors":["*"],"children":["text", "textarea", "upload", "checkbox", "radio", "select", "multiSelect", "buttonGroup"], "action":"and", "label":"block", "locator":"block"},
		"buttonGroup":{"selectors":["*"], "children":["button", "link"], "action":"or", "label":"block", "locator":"block"},
	}
}
```

コレクションノードの定義は、以下キーの値を含むJSONマップです。

* `"selectors"`: **（必須）** HTMLのDOM内のノードを定義するCSSセレクタのJSONリストです。親ノードまたはオペレーションと同じ領域を示すために`"*"`使用することができます。
* `"children"`: **（必須）** コレクションノードに含まれるべきシングルノードまたはコレクションノードのJSONリストです。
* `"action"`: **（必須）** ノードに対して可能なアクションタイプを示すアクションコードです。下記のアクションコード表を参照ください。
* `"label"`: **（任意）** ラベルポリシーコードで`labelPolicies`に定義されたラベルの取得方法を使用します。
* `"locator"`: **（任意）** ロケーターポリシーコードで`locatorPolicies`に定義されたノードの場所を特定する方法を使用します。

アクションコードテーブル

| アクション | 説明
| --------- | -----------
| `"and"`   | すべての子ノードを順番に操作
| `"or"`    | 子ノードのどちらかを選択して操作
| `"multi"` | 複数の子ノードを選択（このアクションは、`マルチセレクト`のみで使用）

### コレクションノードの定義（繰り返し）

コレクションノードで、異なるデータ行や検索結果の一覧など動的子ノードの繰り返しを含むような、特別な種類を定義することができます。 以下はサンプルです。 

```json
{
	"collectionNodes":{
		"list":{"selectors":["ul", "ol"], "children":["list-unit"], "repetitive":true, "similarity":0.90, "combination":2, "percentage":0.5},
		"list-unit":{"selectors":["li"], "children":["buttonGroup"]},
	}
}
```

普通のコレクションノードの定義にいくつかの違いがあります。まず、親コレクションノードと子コレクションノード両方をを定義する必要があります。次に、`"action"`、`"label"`と`"locator"`を定義する必要はありません。繰返しコレクターノードを処理するメカニズムが全く異なるためです。最後に、親コレクションノードに以下の新しいキーを定義する必要があります。

* `"repetitive"`: **（必須）** 繰り返しタイプのコレクションノードでは`true`にする必要があります。
* `"similarity"`: **（必須）** 子ノードどこまで似て繰り返しと判断するかを示す値です。0から1の小数で、大きいほど、より厳格です。
* `"combination"`: **（必須）** 繰り返しの判断でどのぐらいの隣接の子ノードをグループとしてみるかを示す値です。1から9までの整数です。例えば、テーブルに論理行を作る`row-span=2`で`tr`を2つ使うなら、'2'以上の値を設定する必要があります。
* `"percentage"`: **（必須）** 親ノードに繰り返しと見られない子ノードが存在する場合、繰り返しタイプのコレクションノードと判断するかを示す値です。0から1の小数で、繰り返し子ノードの割合がこのパーセンテージを超える必要があります。

Hint: 繰返しノードの定義は非常に複雑です。まずはデフォルトのルールで始め、変更する場合はいくつか試してから行うことをお勧めします。

### オペレーションの定義

オペレーションは、JSON形式のリストとして定義されます。ナレッジエンジンは順番に解析を行うため、定義の順番に注意する必要があります。以下がサンプルです。 

```json
{
	"operations":[
		{"selectors":["form", "table"], "collectionNode":"form", "nesting":"outer"},
		{"selectors":["map", "ul", "ol", "dl", "nav", "div", "a", "button"], "collectionNode":"buttonGroup", "nesting":"inner"},
	]
}
```

オペレーションの定義は、以下キーの値を含むJSONマップです。

* `"selectors"`: **（必須）** HTMLのDOM内のノードを定義するCSSセレクタのJSONリストです。
* `"collectionNode"`: **（必須）** 上記の領域にオペレーションとして抽出するコレクションノードです。
* `"nesting"`: **（必須）** `outer`か`inner`かで、エリア内の検索順序を示します。  `inner`はDOMツリーのボトムからのオペレーションを検索することを意味し、`outer`は、DOMツリーのトップから検索することを意味します。例えば、`"selectors"`にネストした`"div"`が含まれているなら、抽出結果は値により影響を受けます。


補助コンポーネント
---

###ラベルポリシーの定義

ラベルポリシーはJSONマップとして定義されます。 キーはコード（ノード定義で参照するコード）で値はラベルポリシーの定義です。下記サンプルを参照ください。 

```json
{
	"labelPolicies":{
		"fieldLeft":["label", "prevSibling", "parentPrevSibling", "parentTdPrevSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"fieldRight":["label", "nextSibling", "parentNextSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"button":["label", "alt", "title", "value", "text", "id", "name"],
	}	
}
```

各ラベルポリシーは、順番に、取得方法のシリーズで構成されています。すべてこれらの取得方法により順番に処理されます。詳細な説明は、以下を参照ください。

| 取得方法    				| 説明
| --------- 				| -----------
| `"label"` 				| ターゲットノードに対応する`<label>`ノードのテキスト（ターゲットノードの`id`値が`<label>`の`for`属性の値と同じでなければなりません）
| `"text"` 					| ターゲットノードが所有するテキストを取得し、コレクションノードの場合はすべての子供の合計テキストを取得
| `"prevSibling"`   		| DOMツリー内の直前の兄弟関係ノードのテキスト
| `"nextSibling"`   		| DOMツリー内の直後の兄弟関係ノードのテキスト
| `"parentPrevSibling"`   	| DOMツリー内のターゲット親ノードに対して直前の兄弟関係ノードのテキスト
| `"parentNextSibling"`  	| DOMツリー内のターゲット親ノードに対して直後の兄弟関係ノードのテキスト
| `"parentTdPrevSibling"`   | DOMツリー内のターゲットの最寄り`<td>`親ノードに対して直前の兄弟関係`<td>`ノードのテキスト
| `"imgChild"` 				| `<img>`ノード の`alt`、`title`、`id`の値
| `"firstChild"`   			| 最初の子ノードのテキスト
| `"alt"`   				| ターゲットノード属性の値 `alt`
| `"title"`   				| ターゲットノード属性の値 `title`
| `"id"`	   				| ターゲットノード属性の値 `id`
| `"name"`   				| ターゲットノード属性の値 `name`
| `"placeholder"`  			| ターゲットノード属性の値 `placeholder`
| `"value"`   				| ターゲットノード属性の値 `value`

### ロケーターポリシーの定義

ロケーターポリシーはJSONマップとして定義されます。 キーはコード（ノード定義で参照するコード）で値はロケーターポリシーの定義です。下記サンプルを参照ください。 

```json
{
	"locatorPolicies":{
		"field":["name", "id", "label", "xpath"],
		"button":["id", "name", "value", "label", "xpath"],
		"link":["id", "label", "xpath"],
	}	
}
```

各ロケーターポリシーは、順番に、ローケーティング方法のシリーズで構成されています。すべてこれらのローケーティング方法は順番に処理されます。詳細な説明は、以下を参照ください。

| ローケーティング方法 | 説明
| --------- 	| -----------
| `"name"` 		| ターゲットノードと同じ`name`でノードを取得
| `"id"` 		| ターゲットノードと同じ`id`でノードを取得
| `"value"`		| ターゲットノードと同じ`value`でノードを取得
| `"class"`		| ターゲットノードと同じ`class`でノードを取得
| `"xpath"`		| ターゲットノードと同じ`xpath`でノードを取得（ここで`xpath`はオペレーションナレッジツリー内の親に対する相対`xpath`です）
| `"label"`		| ターゲットノードと同じ`label`でノードを取得（ここで`label`はラベルポリシーによって生成されたものです）

ケーススタディ
---

### jQuery UIダイアログ

デフォルトのナレッジルールは、標準のHTML仕様を活用し、時にはいくつかのUIライブラリはウェブサイトに導入される時に特別に拡張される必要があります。ここではjQueryUIダイアログのサンプルを説明します。

```
<div class="ui-dialog ui-widget">
	<div class="ui-dialog-titlebar"><span id="ui-id-1" class="ui-dialog-title">Create new user</span></div>
	<div id="dialog-form" class="ui-dialog-content ui-widget-content">
		<form>
			<fieldset>
				<label for="name">Name</label><input type="text" id="name" name="name">
				<label for="email">Email</label><input type="text" id="email" name="email">
				<label for="password">Password</label><input type="password" id="password" name="password">
			</fieldset>
		</form>
	</div>
	<div class="ui-dialog-buttonpane ui-widget-content ui-helper-clearfix">
		<div class="ui-dialog-buttonset">
			<button type="button"><span class="ui-button-text">Create an account</span></button>
			<button type="button"><span class="ui-button-text">Cancel</span></button>
		</div>
	</div>
</div>
```

上記のHTMLに関して、デフォルトルールは１つのオペレーションとして`<form>`ブロックを抽出し、他のオペレーションとして`<divクラス=" UI-ダイアログbuttonset">`ブロックします。しかし、１つのフォームにダイアログ内のすべての要素を組み合わせたい場合、以下のように既存ルールに１つだけ小さな修正を加えます。

```json
{
	"operations":[
		{"selectors":["div.ui-dialog", "form", "table"], "collectionNode":"form", "nesting":"outer"},
	]
}
```

Note: すべての子ノードを一緒にすることができるように、"div.ui-dialog"は"form"以前に置かなければならない点に注意ください。

上記ケースの更なるステップとして新ルールを作成します。 今ダイアログは`form`として扱います。しかし、これはそのようなダイアログに対してより多くの適切なラベル取得や、ローケーティングをしたい場合に十分ではありません。そこで、それぞれオペレーションルール、コレクションノードルールとラベルポリシーを作成する必要があります。

```json
{
	"operations":[
		{"selectors":["div.ui-dialog"], "collectionNode":"ui-dialog", "nesting":"outer"},
	],

	"collectionNodes":{
		"ui-dialog":{"selectors":["*"],"children":["text", "buttonGroup"], "action":"and", "label":"firstChild", "locator":"block"},
	},

	"labelPolicies":{
		"firstChild":["firstChild"],
	}	
}
```

これによって、`UI-dialog`コレクションノードから構成されている新しいタイプのオペレーションを作成します。このコレクションノードは、最初の子供テキストがラベルになるため、タイトルは`"Create new user"`となります。

Note: もっと多くのHTMLバリエーションをカバーするためにケーススタディを追加して行く予定です。
