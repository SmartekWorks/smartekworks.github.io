実行API仕様
===

SWATで作成したシナリオ・ケースをUIから実行するほかに、実行APIを通して実行と実行状況取得することが可能です。この実行APIを利用して、Jenkinsと連動するプラッグイン（[ツールと外部連携のセットアップ](setup_tools.md#Jenkinsとの連携)を参照してください。）を提供しております。自社の運用ツールからでもこのAPIを利用して実行を呼び出すことが可能です。

実行開始API仕様
---

実行開始APIで開始できる実行で含めるケースが一つのテストセット配下の一部、もしくはすべてのケースです。

#### リクエスト

* URL: `http://<SWATのaccessKey>:<SWATのsecretKey>@<SWAT ServerのURL>/api/swat/execution/start`
* Method: `POST`
* Content-Type: `application/json`
* Parameters: なし
* Body: SWATの新規実行画面の**ケース実行リクエスト生成（Jenkins）**ボタンで生成されるリクエスト情報のJSON文字列。例えば、

```json
{
	"project_code": "AT",
	"testset_code": "ACPT002",
	"title": "E20141022 22:58",
	"execStart": "immediately",
	"scheduledDate": "",
	"execMode": "sequential",
	"execParams": "",
	"waasCode": "ws_any_code",
	"targetPlatforms": [
		"win7_firefox" 
	],
	"windowWidth": "1024",
	"windowHeight": "768",
	"targetServerUrl": {},
	"cases": [
		"*" 
	]
}
```

#### レスポンス 

実行APIはコールが成功するときに、次の応答を返します。 

* HTTP Code: `200`
* Content-Type: `application/json`
* Body: 以下キーを持つJSONマップ
 * `executionIds`: 実行開始した実行IDのJSON配列。例えば

```json
{"executionIds":[1, 2]}
```

実行APIはコールが失敗した時、次の応答を返します。

* HTTP Code: `404`
* Content-Type: `application/json`
* Body:なし

実行結果クエリーAPI仕様
---

実行開始APIで実行を開始させた後に実行結果クエリーAPIで実行の進捗を取得できます。

#### リクエスト

* URL: `http://<SWATのaccessKey>:<SWATのsecretKey>@<SWAT ServerのURL>/api/swat/execution/query`
* Method: `POST`
* Content-Type: `application/json`
* Parameters: なし
* Body: 以下キーを持つJSONマップ。
 * `executionIds`: 実行開始した実行IDのJSON配列。例えば

```json
{"executionIds":[1, 2]}
```

#### レスポンス 

実行APIはコールが成功するときに、次の応答を返します。 

* HTTP Code: `200`
* Content-Type: `application/json`
* Body: 以下キーを持つJSONマップ。
 * `status`: `started`（実行中）、`ended`（実行完了）。 
 * `allCount`: クエリー対象に含む全てのケース数。
 * `executions`: 以下のキーを持つ各実行の進行状況を含むJSONマップ。
   * `id`: 実行ID。
   * `title`: 実行のタイトル。
   * `status`: `started`（実行中）、`ended`（実行完了）。
   * `completed`: 以下のキーを持つ各実行完了したケースの情報を含むJSONマップ。
     * `id`: ケース結果ID。
     * `caseTitle`: ケースのタイトル。
     * `status`: `fail`（実行失敗）、 `success`（実行成功）。
     * `execError`: エラーメッセージ。
     * `time`: ケースの実行時間（秒）。

```json
{
	"status": "started",
	"allCount": 5,
	"executions": [
		{
			"id": 1,
			"title": "title",
			"status": "ended",
			"completed": [
				{
					"id": 1,
					"caseTitle": "Test Case Title",
					"status": "Result Status",
					"execError": "Error Message",
					"time": 200
				}
			]
		}
	]
}
```

実行APIはコールが失敗した時、次の応答を返します。

* HTTP Code: `404`
* Content-Type: `application/json`
* Body:なし