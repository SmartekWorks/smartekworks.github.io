ウィンドウとフレーム対応
===

SWATでマルチウィンドウ、マルチフレーム構成のアプリを対応する仕方を説明します。

マルチウィンドウ対応
---

複数ウィンドウを利用するWebアプリがよくあります。例えば、プロダクトリンクをクリックして、新しいウィンドウでプロダクトの詳細が表示されます。また、古いIE専用のモデルダイアログもウィンドウとして実装されています。複数ウィンドウを自動化シナリオで操作する際に通常のシナリオよりちょっとややこしいので、ここで対応方法を紹介します。

#### ナレッジ対応

まず、ウィンドウごとに違う[画面ナレッジ](guide_knowledge.md#SWATナレッジベースについて)として、それぞれ[SWATキャプチャー](setup_tools.md#SWATキャプチャー)でHTMLをキャプチャーして、インポートする必要があります。

Hint: ブラウザツールバーが表示されない子ウィンドウの場合、ウィンドウで右クリックしてキャプチャーメニューを押すことが可能です（Chromeb版のみ）。

#### シナリオ対応

通常**シナリオビルダー**にウィンドウを指定する必要がありません。ある画面のあるオペレーションをドラッグ＆ドロップしてシナリオを作成します。実行する際に、SWATが複数ウィンドウの中で操作したい画面を自動的に探してオペレーションを実行することになります。

しかし、複数似たようなウィンドウの場合（例えば同じ対象オペレーションを持っている）、対象ウィンドウを探すために下記のように追加情報を定義する必要です。

* [ウィンドウ制御](ref_sys_operation.md#オペレーション_-_ウィンドウ制御)システムオペレーションで明示的にウィンドウの切り替えを定義します。
* 実行中に正しく対象画面を見つけるために、対象画面の[画面識別情報](ref_mq_rule.md#ブラウザウィンドウを特定)を定義します。

Hint: 画面エビデンスの取得及び一部ウィンドウと関係するシステムオペレーション（例えば**画面検証**、**画面変数設定**など）が現在一番トップであるウィンドウに対して実行することで、必要に応じて、対象ウィンドウに切り替える必要が有ります。

マルチフレーム対応
---

複数ウィンドウのWebアプリと比べて、`frame`もしくは`iframe`を利用する多フレームのWebアプリがもっと複雑です。なぜなら、複数物理的なHTMLが存在するほか、多階層の親子関係もケアしなければけません。ここでこのようなWebアプリの対応方法を紹介します。

#### ナレッジ対応

ブラウザのHTML保存機能を利用すると一番外枠のHTMLしか保存できないため、マルチフレームの場合、[SWATキャプチャー](setup_tools.md#SWATキャプチャー)を利用してキャプチャする必要があります。そうすると、すべてのフレームのHTMLがまとめて一つの`SHTM`ファイルに固められ、１画面としてインポートされることにあります。

Note: ブラウザのセキュリティ仕組みのため、異なるドメインのフレーム内容がキャプチャすることができません。

#### シナリオ対応

ナレッジインポートが正しくできますと、フレームの構成情報もナレッジに含まれますので、シナリオ実行する際に、対象フレームの自動的に探すことができます。この機能を有効にするために、

When the `SHTM` file are imported into SWAT knowledge base, the frame hierachy are also stored. SWAT will take advantage of this hierachy information during execution, and automatically locate the frame which the operation belongs to. Beforehand, you need to configurate the `frameSearchDepth` pamameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution).

If the frame nesting depth is less than `3`, please set the parameter as follows:

```json
{"frameSearchDepth": 3}
``` 

If there's no frame in this site, please disable frame search to expedite the execution as follows:

```json
{"frameSearchDepth": 0}
``` 

#### How to Take Frame Screenshot

SWAT takes screenshot evidence for the whole page by default, but sometimes part of one frame will be overlapped by the others if this frame is scrollable. We provide the capability to take screenshot for designated frames, based on the `name` or `id` attributes of the frame / iframe.

Here's the sample for `scrollableFrames` parameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution): 

```json
{"scrollableFrames": ["name":"frame1", "id":"frame2"]}
``` 
