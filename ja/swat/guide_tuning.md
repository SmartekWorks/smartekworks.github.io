画面ナレッジ変更
===

このページでは、ナレッジルールを使って画面や操作の編集して、どのように正しいオペレーションモデルを生成するかを説明します. 

Note: 利用者の使い勝手をよくするために、ナレッジベースの構築に画面ナレッジチューニングを行うことをお勧めします.

チューニング画面の解析
---

SWATは画面の実装を理解するナレッジルールを使います。SWATのデフォルトルールは、一般的な実装を想定してますが、往々にして画面解析をしたときにルールをチューニングするカスタマイズが必要になります。

* Webアプリでのインタラクティブな要素を制御する特殊なJSがある場合。
* ノードを見つけるために特別なCSSクラスのような特別な実装ポリシーを使用している場合。
* オペレーションやノードのタイトルをデフォルトスコープへ変更したい場合。

#### デフォルト構文解析の分析

最初、`Bing` and `BingSA`画面のデフォルト構文解析を確認します。 `BingSA`操作は、検索を補佐するプルダウンリストに関係していない問題があります. プレビューフレームからHTMLを調べる場合、以下のHTMLコードを見つけるでしょう。

```html
<ul class="sa_drw" id="sa_ul">
	<li class="sa_sg" id="sa_0" url="/search?q=test&amp;qs=AS&amp;pq=test&amp;sc=8-4&amp;sp=1&amp;cvid=ae5d962746e843548572eca8e570130f&amp;FORM=QBLH" query="test" nav="sb_form_q;;sa_1;" stype="AS" hc="1" h="ID=autosuggest,5003.1" _ctf="sa_si_T" _ct="sa_0">
		<div class="sa_s"><div class="sa_tm">test</div></div>
	</li>
	...
</ul>
```

これは、プルダウンリストが `div.sa_s`のグループと` UL＃1 sa_ul`リストによって実装されているようです。このように対話型のタグが存在しない場合、デフォルトのルールではSWATはそれが対話型と認識しません。新しいナレッジルールを定義することで、SWATにこの種の実装を教え込みます。


#### ルールの設計

SWATナレッジルールは以下ストリングJSONフォーマットです。ルールの基本コンポートを知る必要があります。

* `singleNodes`: ボタンなど、入力として単一のインタラクティブなDOMノードの定義
* `collectionNode`: リスト、テーブル、セレクトのようなDOMノードのコレクションを定義
* `operations`: collectionNodeの抽出方法を操作する定義

以下の手順でデフォルトルールを確認できます。

1. メニュータグのナレッジからチューニングを選択し、**画面チューニング**を開きます。
2. `Bing`サイトの`BingSA`画面を選びます。 ルールボタンをクリックし、プルダウンから**デフォルト**を選択します。
3. デフォルトルールが表示されます。

オペレーションにsuggestionリストを作成するには以下が必要です。

* `link`のような`div.sa_s`のためのクリック可能なノードを定義します。SingleNodesに次のエントリを追加する必要があります。.
```json
"sa_link":{"selectors":["div.sa_s"], "decisive":true, "action":"click", "label":"link", "locator":"link"}, 
```
* `buttonGroup`のようなその子として、sa_link``と`UL＃1 sa_ul`のcollection nodeを定義します。collectionNodesに次のエントリーを追加する必要がります。
```json
"sa_list":{"selectors":["ul#sa_ul"], "children":["sa_link"], "action":"or"},
```
* `sa_list`のためのオペレーションを定義します。 collectionNodesに次のエントリーを追加する必要がります。
```json
{"selectors": ["ul#sa_ul"], "collectionNode":"sa_list", "nesting":"outer"},
```

ヒント： 詳細なリファレンスについては[知識ルールDSL]（ref_knowledge_rule.md）を参照してください。

#### ルールの作成

1. 上記の手順に従うと、上記の設計に応じてルールを変更されます。 
2. **プレビュー**ボタンをクリックし、 **プレビュー**タブで新しいルールの構文解析結果を参照します。
3. クリックタブアイテムで`sa_ul`の新しいオペレーション名を確認します。 
4. **ルール**タブに切り替え、**Save As**ボタンをクリックし、タイトル`01`のルールを保存します。

ノート：効率的にルールを作るためには同じ実装や多くの考慮事項について複数の定義があります。別章の**Article**で、良いルールを作るためのベストプラクティスについて説明します。

#### ルールの適応

1. メニュータグのサービス設定から**サイト設定**選択し、左側の`Bing`を選びます。
2. **解析ルール**を`01`へ変更し、このサイトのすべてのインポートは、このルールを使用することができます。
3. **ルール編集**ボタンをクリックし、**ルール管理**画面を表示させます。
4. ルール `01`を選び、 保存したルールを参照できます。
5. 次に**保存**ボタンのプルダウンメニューから**画面適応**を選択します。
6. 選択した画面にルールを適応の画面を表示され、対象画面の適応を行い、SWATは画面の構文解析を実施します。
7. しばらくしたら、左側に解析された画面リストを取得します。`Bing`は変更されてません、なぜならsuggest listが含まれていないからです。`BingSA`は変更されたので、緑色に追加されたオペレーションが確認できます。

画面編集とオペレーション
---

ナレッジルールは同じWebアプリで共通の画面や似通った実装の画面が多いとき助かります。時にはまだそのような個別のナレッジコンポーネントのタイトルとしていくつかのプロパティを変更する必要があります。

1. メニュータグのナレッジから**ナレッジ画面**を選択します。
2. `Bing`下の`hp_table`を選択、`Links`タイトルを変更します。保存後、左側ツリーでタイトルが変わったことを確認します。
3. また`hp_table`のタイトル下`BingSA`も`Links`に変更されています。SWATは、それらが別のページに同じ操作であると認識しているためです。**保存**ボタンのプルダウンメニューで**関連オペレーション**を選択することでリレーションを削除することができます。
4. また、`sb_form`のタイトルを `Search`、`sa_ul`を `Suggestion List`へ変更できます。（`Search`は今回2画面で同じと思わない）
5. `Search`下の`BingSA`を選択します。 次に**保存**ボタンのプルダウンメニューから **カスタマイズオペレーション**選択します。 **オペレーションカスタマイズ**画面が表示します。
6. `sa_ghostbox`という隠れたノード名を確認します。 実行時にそれを必要としないので、それを無効にするには、ノードのチェックを外します。今そうする必要はありませんがノードのタイトルを変更することができます。

次へ
----

これで画面ナレッジが使えるようになりました。次はシナリオ作成のためのWebオペレーション使い方を説明します。

Go to [Building Scenarios](guide_scenarios.md).