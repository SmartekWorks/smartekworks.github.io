DSLナレッジルール
===

SWATのナレッジルールは、Web画面と対話する方法を説明するためのドメイン固有言語の一種です。SWATナレッジエンジンは、ウェブ画面を分析する能力を持っているが、ウェブ画面のいくつか特別な実装を取扱うためにはナレッジルールを必要です。

ナレッジルールとは何か？
---

最も一般的な画面の作りで定義されているデフォルトでは、各サイトはデフォルトのナレッジ·ルールを持ちます。以下の目的のために、デフォルトのナレッジ·ルールを変更することができます。

* インタラクティブなHTMLタグなしにオペレーションを追加する。 そのようなdiv`インタラクティブ`のような非対話型のHTMLタグを作成するJavascriptやJSのライブラリを使用する際には通常必要です。[User Guide](guide_tuning.md#Tuning_Page_Parsing).でサンプルが参照できます。
* デフォルトのオペレーションサイズを変更します。主にデフォルトの規則は、一般的な使いやすさに応じて適切なサイズでのオペレーションを抽出します。しかし、時には1より大きい複数の操作をマージしたり、いくつか小さな演算を分割することができます。デフォルトルールを変更することによって可能です。
* オペレーションの検索方法の方針と実行中のノードを変更します。場合によっては、静的画面が動的画面上で実行されているとして、信頼性の高い自動化のためのロケータ方針が必要。殆どのWebアプリケーションは`id``name`のようなHTMLを使い、統一されたロケーター方針を持ちません。ナレッジルールのオペレーションで異なるノードの異なるロケーター方針設定することが必要。、
* オペレーションとノードのラベルを取得する方法の方針を変更します。SWATはオペレーションとノードを抽出する際にオブジェクトのタイトルのHTMLからラベルを取得しようとします。 Webアプリケーションの適切なかたちのにデフォルトポリシーを変更することができます。

ノート: デフォルトルールは、より良い互換性のために随時更新されます。 また異なる種類の実装のためにいくつかのテンプレートルールを提供する予定です。

ナレッジルールの基礎
---

### ナレッジルールの管理

ナレッジルールは、WebアプリケーションのすべてのWeb画面を特定グループで設計されています。そのため、ナレッジルールは、WebアプリケーションやSWATサイトの下で管理されています。Webアプリケーションでの実装にはいくつかのタイプを持っているため、サイトの下に、いくつかのルールを設定できます。お勧めしませんが、メンテナンスを楽にするために特定のWeb画面のナレッジルールを追加することができます。

SWATの画面ナレッジの各バージョンは、同じサイトの下の規則に関連しています。SWATはそのルールに基づいて画面ナレッジを扱うので、それが使用された後、ナレッジルールを変更することはできません。画面ナレッジの新しいバージョンを追加するには、画面ナレッジをアップグレードし、新しいルールを追加することができます。

### 構文

ナレッジルールは、以下のコンポーネントを定義し、いくつかのキーを使用するJSON　MAP文字列です。各コンポーネントの構文の詳細については後述します。

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

* `singleNodes`: シングルノードは、入力としてのボタンで、オペレーションで対話する必要があるアトミック対話型のノードです。
* `collectionNodes`: コレクションノードはシングルノードや更に特定の関係で他のコレクションノードの集まり、そのような一つずつ対話する必要がある形で、いくつかの入力として、リンクリスト内のいくつかのリンクは、リストから1つを選択する必要があります。
* `operations`: オペレーションは最終的にページナレッジのオペレーションとして抽出される特別なcollectionNodeです。
* `labelPolicies`: ラベルポリシーは、画面ナレッジを生成する際に、単一ノードと収集ノードのラベルを取得する方法を定義します。
* `locatorPolicies`: ロケータポリシーは、単一ノードと実行中の収集ノードを配置する方法を定義します。

`singleNodes`、`collectionNodes`、`operations`は最も重要なコンポーネントです。それらはすべてのルールのために必要とされ、`labelPolicies`、`locatorPolicies`は必要としません。

コアコンポーネントの構文
---

### シングルノードの定義

シングルノードは、ノードと値を定義するノードコードのキーを使用してJSON MAPが定義されます。 ノードコードは収集ノードの定義から参照することができます。 下記サンプルを参照。 

```json
{
	"singleNodes":{
		"link":{"selectors":["a[href]", "area[href]"], "decisive":true, "action":"click", "label":"link", "locator":"link"}
		"radio":{"selectors":["input[type=radio]"], "decisive":false, "action":"click", "label":"fieldRight", "locator":"field", "group":{"by":"name", "label":"group", "locator":"group"}},
	}
}
```

単一ノードの定義は、以下キーの値を含むJSON MAPです。

* `"selectors"`: **(Required)** HTML DOM内のノードを定義するCSSセレクタのJSONリスト。
* `"decisive"`: **(Required)** `成功`か`失敗` のノードがオペレーションを完了するか、しないかどうかを示す。たとえば、通常のボタンには `成功`を使用し、テキストボックスには`失敗`を使用します。
* `"action"`: **(Required)** ノードとの対話のタイプを示すアクションコード。下記のアクションコード表を参照してください。
* `"label"`: **(Optional)** ラベルポリシーコードはラベルポリシーがノードに使用されることを示します。
* `"locator"`: **(Optional)** ロケーターポリシーコードはロケーターポリシーがノードに使用されることを示します。
* `"group"`: **(Optional)** JSON Mapはどのグループの単一ノードに、ラジオやチェックボックスのグループとするか定義します。 定義には以下のキーが含まれます。
 * `"by"`: **(Optional)** ノードをグループ化するために使用する属性名。 `"名前"`がデフォルトで使用されます。
 * `"label"`: **(Optional)** グループ全体のラベルポリシーコード。
 * `"locator"`: **(Optional)** グループ全体のロケーターポリシーコード。

アクションコードテーブル:

| Action          | 説明
| --------------- | -----------
| `"type"`        | テキスト入力などのノードにテキストを入力。
| `"upload"`      | ファイル入力などのノードにファイルパスを設定。
| `"select"`      | 選択のオプションなどのコードを選択
| `"check"`       | チェックボックスなどのノードをチェック
| `"click"`       | ボタンなどのノードをクリック
| `"moveTo"`      | バーボタンとしてノードにマウスカーソルを移動
| `"rightClick"`  | コンテキストメニューのリンクなどのノードを右クリック
| `"doubleClick"` | インターラクションをダブルクリックし領域などのノードをダブルクリック


### Definition of Collection Nodes

Collection nodes are defined as a JSON map with keys for the node code of the nodes and values for the definition. The node code can be referenced from the definition of an operation or a collection node. Below is the sample. 

```json
{
	"コレクションノードの定義"
	{
		"form":{"selectors":["*"],"children":["text", "textarea", "upload", "checkbox", "radio", "select", "multiSelect", "buttonGroup"], "action":"and", "label":"block", "locator":"block"},
		"buttonGroup":{"selectors":["*"], "children":["button", "link"], "action":"or", "label":"block", "locator":"block"},
	}
}
```

コレクションノードの定義は、以下キーの値を含むJSON MAPです。:

* `"selectors"`: **(Required)** HTML DOM内のノードを定義するCSSセレクタのJSONのリスト. 親ノードまたはオペレーションと同じことを示すために`" *"`使用することができます。
* `"children"`: **(Required)** コレクションノードに含まれるべき単一ノードまたはコレクションノードのJSON形式のリスト。
* `"action"`: **(Required)** インタラクションの種類を示すアクションコード。下記のアクションコード表を参照。
* `"label"`: **(Optional)** ラベルポリシーコードはノードに使用されるラベルポリシーを示す
* `"locator"`: **(Optional)**ロケータポリシーコードはノードに使用されるロケーターポリシーを示す

アクションコードテーブル

| Action    | 説明
| --------- | -----------
| `"and"`   | 1対１で各々子供たちが対話.
| `"or"`    | 子供たちから子ノードを選択し対話する。
| `"multi"` | 子どもたちから複数の子ノードを選択し、それらと対話。このアクションは、`マルチSELECT`で使用。

### コレクションのノードの定義（繰り返し）

コレクションノードで、異なるデータ行や検索結果の一覧として動的ノードが繰り返し含まれるような、特別な種類を定義することができます. 以下はサンプルです。 

```json
{
	"collectionNodes":{
		"list":{"selectors":["ul", "ol"], "children":["list-unit"], "repetitive":true, "similarity":0.90, "combination":2, "percentage":0.5},
		"list-unit":{"selectors":["li"], "children":["buttonGroup"]},
	}
}
```

繰返しコレクションノードの定義にいくつかの違いがあります。まず、セット内の親コレクションノードと子コレクションノードを定義する必要があります。次に、`"アクション"を定義する必要はありません`、 `"ラベル"`と`"ロケータ"`繰返しコレクターノードを処理するメカニズムが全く異なるためです。最後に、親ノードに新しいキーを以下の値で定義する必要があります。

* `"repetitive"`: **(Required)** 常に親の繰返しコレクションノードでは` true`にする必要があります。
* `"similarity"`: **(Required)** 同じような子ノードが繰返しを示すfloat番号は0から1にします。大きいほど、より厳格。
* `"combination"`: **(Required)** 多くの隣人の子ノードは繰返す単位として組み合わせることができる性数値は1から9までです。例えば、テーブルに論理行を作る`row-span=2`で`tr`を2つ使うなら、'2'に組み合わせを設定する必要があります。
* `"percentage"`: **(Required)** 親ノードを考えているかどうかを示すフロート数 `0'から`1`は、繰返しコレクションノードです。.繰返し子ノード/すべての子ノードは、親の有効な繰返しノード値よりも大きくなければなりません。

ヒント: 繰返しノードの定義は非常に複雑です。まずはデフォルトのルールで始め、変更する場合はいくつか試しを行うことをお勧めします。

### オペレーションの定義
オペレーションは、JSON形式のリストとして定義されます。ナレッジエンジンはシーケンス内の業務を分析したように、順番に注意する必要があります。以下がサンプルです。 

```json
{
	"operations":[
		{"selectors":["form", "table"], "collectionNode":"form", "nesting":"outer"},
		{"selectors":["map", "ul", "ol", "dl", "nav", "div", "a", "button"], "collectionNode":"buttonGroup", "nesting":"inner"},
	]
}
```

オペレーションの定義は、以下キーの値を含むJSON MAPです。

* `"selectors"`: **(Required)** HTML DOMのオペレーション検索領域を定義するCSSセレクタのJSONのリスト
* `"collectionNode"`: **(Required)** コレクションノードは、オペレーション探索領域での動作として抽出
* `"nesting"`: **(Required)** `outer` か `inner`はエリア内の検索順序を示します。  `inner`はDOMツリーの一番下からの操作を検索することを意味し、`outer`は、DOMツリーのトップから検索することを意味します。例えば、セレクターにネスト`"div"`が含まれているなら、結果は値により影響を受けます。


持的コンポーネントの構文
---

###ラベルポリシーの定義

ラベルポリシーはJSON mapとして定義されます。 各エントリは、ノード定義で参照できるポリシーコードのようなキーを持つ単一のラベルポリシーの略です。ここにサンプルを示します。

```json
{
	"labelPolicies":{
		"fieldLeft":["label", "prevSibling", "parentPrevSibling", "parentTdPrevSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"fieldRight":["label", "nextSibling", "parentNextSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"button":["label", "alt", "title", "value", "text", "id", "name"],
	}	
}
```

各ラベルポリシーは、順番に、原子ラベリングメカニズムのシリーズで構成されています。すべてのこれらのメカニズムは空でない文字列を一つ返すまで順に処理されます。詳細な説明は、以下参照ください。

| Mechanism    				| 説明
| --------- 				| -----------
| `"label"` 				| ターゲットノードに対応する```<ラベル>` ``ノードのテキスト。 ターゲットノードの`id`値が``<ラベル>`` ノードの` for`値と同じでなければなりません。
| `"text"` 					| ターゲットノードが所有するテキストを取得しそれ以外の場合はすべての子供の合計テキストを取得。
| `"prevSibling"`   		| DOMツリー内の直前の兄弟関係ノードのテキスト。
| `"nextSibling"`   		| DOMツリー内の直後の兄弟関係ノードのテキスト。
| `"parentPrevSibling"`   	| DOMツリー内のターゲット親ノードに対して直前の兄弟関係ノードのテキスト。
| `"parentNextSibling"`  	| DOMツリー内のターゲット親ノードに対して直後の兄弟関係ノードのテキスト。
| `"parentTdPrevSibling"`   | `<TD>` ノード前のテキストは DOMツリー内のターゲットの親ノードを含む最寄り```<TD>` ``に対応します。
| `"imgChild"` 				| 子ノード ```<img>```の`id`、`alt`、`title`値。
| `"firstChild"`   			| 最初の子ノードのテキスト。
| `"alt"`   				| ターゲットノード属性の値 `alt`.
| `"title"`   				| ターゲットノード属性の値 `title`.
| `"id"`	   				| ターゲットノード属性の値 `id`.	
| `"name"`   				| ターゲットノード属性の値 `name`.
| `"placeholder"`  			| ターゲットノード属性の値 `placeholder`.
| `"value"`   				| ターゲットノード属性の値 `value`.


### ロケータポリシーの定義

ロケータポリシーは、JSON　MAPとして定義されます。各エントリは、ノード定義で参照できるポリシーコードのようなキーを使用し、単一のロケータポリシーのことです。ここでサンプルを参照。

```json
{
	"locatorPolicies":{
		"field":["name", "id", "label", "xpath"],
		"button":["id", "name", "value", "label", "xpath"],
		"link":["id", "label", "xpath"],
	}	
}
```
各ロケータポリシーは、順番に、原子の位置決めメカニズムのシリーズで構成されます。すべてのこれらのメカニズムは一意のノードを見つけるまで順に処理されます。前回のメカニズムの出力ノードは、次回1の入力として機能します。詳細な説明は以下参照
 Mechanism    	| 説明
| --------- 	| -----------
| `"name"` 		| ターゲットノードと同じ`name`でノードを取得する。
| `"id"` 		| ターゲットノードと同じ`id`でノードを取得する。
| `"value"`		| ターゲットノードと同じ`value`でノードを取得する。
| `"class"`		| ターゲットノードと同じ`class`でノードを取得する。
| `"xpath"`		| ターゲットノードと同じ`xpath`でノードを取得する。 ここで`xpath`はオペレーションナレッジツリー内の親への1つのつながりです。
| `"label"`		| ターゲットノードと同じ`label`でノードを取得する。 ここで`label`はラベルポリシーによって生成されたものです。


ケーススタディ
---

### 既存のデフォルトルールを拡張

デフォルトのナレッジ·ルールは、標準のHTML仕様を活用し、時には、いくつかのUIライブラリはウェブサイトに導入される時に特別に拡張される必要があります。 ここではjQueryUIダイアログのサンプルコードスニペットです。

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

上記のHTMLに関して、デフォルトルールは1オペレーションとして`<form>`ブロックを抽出し、他のオペレーションとして`<divクラス=" UI-ダイアログbuttonset">`ブロックします。しかし、1擬似フォームにダイアログ内のすべての要素を組み合わせることをします。この魔法は、以下のように、既存のルールに一つだけの小さな修正を加えて行われます。

```json
{
	"operations":[
		{"selectors":["div.ui-dialog", "form", "table"], "collectionNode":"form", "nesting":"outer"},
	]
}
```

ヒント: すべての子要素を一緒にすることができるように、"div.ui-dialog"は"form"以前に置かなければならない点を注意ください。

### 新ルールの作成

上記ケースの更なるステップとして新ルールを作成します, 今ダイアログは`form`として扱います。しかし、これはそのようなダイアログに対して多くのパーソナライズされたルールを作成したいのであれば、十分ではありません。そこで、それぞれオペレーションルール、コレクションノードルールとラベルポリシーを作成する必要があります。

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

これによって、`UI-dialog`コレクションノードから構成されているオペレーションの新しいタイプを作成します。このコレクションノードは、ラベとしての最初の子供テキストを複数のテキストフィールドとボタングループで成り立っています。 それに応じて、 "新しいユーザー″を作成します。

ノート: 以上のケースはHTMLバリエーションをカバーするために追加されます。
