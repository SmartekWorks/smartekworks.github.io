Agent API specification
===

During a scenario you can use an [**API Call** system operation](ref_sys_operation.md#Operation_-_API_Call) to call a web service to execute an extended operation such as DB access and file manipulation. You need build an agent server with your extended operation conforming to the API specification which we will explain here. 

You may also refer to [DB Access and File Manipulation](article_api_call.md) for considerations of using Agent Server.

How does Agent Server Work? 
---

When you execute a case on SWAT local execution service, SWAT tells the local execution server to execute every step of the scenario. Though most of the steps do some operations on web pages in a browser, sometimes you need to do something like accessing DB, manipulating file or notifying someone by email etc. during the scenario. To support such kind of use cases, we need a special step to call an existing web service, which we call agent API. 

There should be an agent server offering the agent API and doing the work such as accessing DB and return the result. After obtaining the result, SWAT will continue to run the steps after.

So, an agent server will be called by local execution server of SWAT, do whatever you implemented for the call, and return the result to SWAT.

Note: **API Call** system operation and agent server only works on local execution service.

Agent API Specification
---

**API Call** system operation will call the Agent API with following specification. You should build your own API implementation conforming to this specification.

#### Request

* URL: URL defined in **API URL** parameter of **API Call** system operation.
* Method: `POST`
* Content-Type: `application/json`
* Parameters: Only one internal parameter named `sessionId` will be set indicating the execution session of the case.
* Body: JSON Map for storing **API Params** parameter of **API Call** system operation.

#### Response 

Agent API should return following response when the call is successful. 

* HTTP Code: `200`
* Content-Type: `application/json`
* Body: JSON Map with following keys
 * `result`: (Optional) A string which can be saved in the variable defined in **Variable Name** parameter of **API Call** system operation. It is required when you set the variable name. 
 * `extraEvidences`: (Optional) A list of files to be saved as evidences in SWAT.
   * `name`: (Required) Name of the file.
   * `type`: (Required) Mime type of the file.
   * `content`: (Required) Content of the binary file. Using BASE64 for encoding.

Agent API should return following response when the call is failed.

* HTTP Code: `404`
* Content-Type: `application/json`
* Body: JSON Map with following keys
 * `code`: (Optional) Error code of the call. Used in error message of SWAT.
 * `message`: (Required) Error message of the call. Used in error message of SWAT.

Note: As the timeout of the request is 10 minutes, you should ensure that agent server complete the procession and return within 10 minutes.

Agent API Sample
---

We will explain an agent API with a user upload application sample. We need to get the *fileNo* from DB and the uploaded file after user uploads the file. After that, we need to search the file's detail in the same application.

#### For SWAT Scenario

Append an **API Call** system operation with following parameters:

* API URL: `http://127.0.0.1/traceUpload`
* API Params: `db=true&file=true`
* Variable Name: `{fileNo}`

After the system operation, you need to append a *Search Uploaded File* web operation using variable `fileNo` to search the file.

#### For Agent Server

When the SWAT execute the above operation, a following JSON POST request will be made:

* URL: `http://127.0.0.1/traceUpload`
* Parameters: `sessionId=12345`
* Body:
```json
{
	"db":"true",
	"file":"true"
}
```

You need to implement an agent server to accept the above request, do the SQL query and read the uploaded file. After that, the agent server should return the following response:

* HTTP Code: `200`
* Content-Type: `application/json`
* Body:
```json
{
	"result":"file0513",
	"extraEvidences":[
		{
			"name":"file0513.pdf",
			"type":"application/pdf",
			"content":"...."
		}
	]
}
```

In this way, the uploaded file named `file0513.pdf` will be save as an evidence for the system operation. And, then the test will use `file0513` to search the file`s detail.
