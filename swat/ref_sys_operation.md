System Operation
===

System operation is a set of pre-defined operation offering support for handling browser or scenarios.

Attention: Some of the features may not be avaialbe until next update.

How to Use System Operations?
---

The usage of system operation is much alike to the [Web Operation](ref_web_operation.md#How_to_Use_Web_Operations?). You just need to drag & drop a system operation onto a scenario flow or flow, and fill the parameters for the operation. However, there are still several differences between the system operation and web operation that you need to know:

#### Parameters

Unlike those in web operation, the parameters in system operation do not have following features:

* Using parameter option to ignoring or not to ignoring the parameter.
* Parameter input mode to switch among different querying mode.
* Alert options to handling alert dialog.

#### Errors and evidences

Each system operation has its own pre-defined errors and evidences. Please refer to the specification of all system operations below.

#### Using Variable

* You cannot set a variables in **Variable Name** or **Session Name** parameter. These parameters exist in **Set Value**, **API Call** and **Session Control** operation.
* As you cannot switch the select typed parameter to query mode in system operations, you cannot set a variable in such kind of fields such as **Action** in **Navigation Control** operation.

#### Ignoring Parameter and Operation

* You cannot ignore parameters of system operation by ignoring variables, but you can ignore the operation by ignoring all the variables used in the operation. 
* As you cannot use variables in system operations such as **Navigation Control**, **Additional Information** operation, you cannot ignore those operation too.

Operation - Go to URL
---

Go to a specific URL in the current browser session and window. 

##### Parameters

| Parameters | Explanation
| ---------- | -----------
| Site       | Site managed in SWAT. SWAT will use the execution related settings of the site after this operation.
| URL        | Relative URL to the target server URL of the **Site**. You can also use full URL starting with `http://`, `https://`, `file://` to ignore the target server URL. 

##### Notes

* A new default browser session and window will be create if there is no sessions.

##### Errors

* The generated URL from **URL** and the target server URL of the **Site** is blank or invalid. (in execution)

##### Evidences

* Screenshot
* HTML

Operation - Wait in Browser 
---

Wait a short period of time in the current browser session and window. You usually need this operation when you want to wait for updates triggered by javascript.

##### Parameters

| Parameters | Explanation
| ---------- | -----------
| Duration   | Seconds to wait in the current browser session and window.

##### Notes

* You should take care of session timeout when you wait for a long period of time.
* There is an idle timeout (about 90 seconds) in cloud execution service. If the wait period exceeds the timeout, the execution will be interrupted.

##### Errors

* The value of **Duration** is blank or is not a natural number. (in validation and execution)

##### Evidences

* Screenshot
* HTML

Operation - Navigation Control 
---

Simulate the navigation control function of browser.

##### Parameters

| Parameters | Explanation
| ---------- | -----------
| Action     | browsers' navigation control function: `Forward`, `Back`, `Reload`.

##### Notes

* This system operation currently does not work on *Safari*.
* Browsers may not ensure the `Back` and `Reload` actions work after a form submission.

##### Errors

* Execute this system operation on *Safari*. (in execution)

##### Evidences

* Screenshot
* HTML

Operation - Obtain Download
---

Obtain the downloaded file in the last operation and save it as an evidence. It is a little tricky to use this system operation, please read the *Notes* part carefully.

Note: To simulate a actual download and upload action may be not a good practice because it involves OS function and causes scenario unstable.

##### Parameters

| Parameters    | Explanation
| ------------- | -----------
| Wait Duration | Seconds to wait for finishing downloading the file.

##### Notes

* This system operation only works in local execution service.
* You should ensure that the file started downloading to a specific local directory in the previous operation. We offer configuration for auto downloading on Chrome and Firefox. However, you need to config browsers to bypass save file dialog and not to open file directly in other browsers.
* You need to set *DownloadDir* with the path of download directory in your local execution service. Please refer to [Execution Services](setup_execservices.md#Configuration_File) for the configuration.

##### Errors

* The value of **Wait Duration** is blank or is not a natural number. (in validation and execution)
* Execute this system operation in cloud execution service. (in execution)
* The downloaded file cannot be found because of download failure or invalid download directory. (in execution)

##### Evidences

* Downloaded file

Operation - Window Control
---

Find the target window and manipulate it.

##### Parameters

| Parameters     | Explanation
| -----------    | -----------
| Window Name    | The window name of the target window. Leave it blank to bypass this condition.
| Matching Rules | The matching rules of the target window. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of matching rule. Leave it blank to bypass this condition.
| Action         | `Activate` for switching the target window to the current window. `Close` for closing the target window.

##### Notes

* If both **Window Name** and **Matching Rules** are designated, they should both be satisfied. 
* If both **Window Name** and **Matching Rules** are blank, the current window will be the target window.

##### Errors

* **Matching Rules** do not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation and execution) 
* Target window cannot be found. (in execution)

##### Evidences

* Screenshot
* HTML

Operation - Assertion
---

Assert whether the page in current window is the page you expected.

##### Parameters

| Parameters     | Explanation
| -----------    | -----------
| Matching Rules | Expectation in format of matching rules. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of matching rule. Leave it blank to bypass the assertion.

##### Notes

* Only evidence of assertion operation will be included in normal mode evidence export. So, you can use it with blank **Matching Rules** as a checkpoint of your scenario.

##### Errors

* **Matching Rules** do not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation and execution) 
* Assertion failed. (in execution)

##### Evidences

* Screenshot
* HTML
* Operation result in JSON text format

Operation - Set Value
---

Set a value from the page in current window to a variable, which you can use in the parameters of following operations.

##### Parameters

| Parameters    | Explanation
| ------------- | -----------
| Querying Rule | Definition of the target value in format of querying rule. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of querying rule. 
| Variable Name | Variable Name to store the value.


##### Errors

* **Query Rule** is blank or does not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation and execution) 
* **Variable Name** is blank or does not conform rules of variable name. (in validation and execution)
* **Variable Name** has been referenced in the previous operations. (in validation)
* Querying target cannot be found. (in execution)

##### Evidences

* Screenshot
* HTML
* Operation result in JSON text format

Operation - Additional Information
---

Obtain additional information from the page in current window, including URL and option lists of all selects on the page.

##### Parameters

* None

##### Errors

* None

##### Evidences

* Screenshot
* HTML
* Additional information in JSON text format

Operation - API Call
---

During a scenario you can call an agent server API to execute an extended operation such as DB access and file manipulation. You need build an agent server with your extended operation conforming the [Agent Server API](ref_agent_api.md) specification. Please refer to [DB Access and File Manipulation](article_api_call.md) for details.

##### Parameters

| Parameters    | Explanation
| ------------- | -----------
| API URL       | URL of the API
| API Params    | Parameters for the API, using request query string format such as `Key1=Value1&Key2=Value2`.
| Variable Name | Variable name to store the result in API return. Leave it blank if you do not need to set the value.

##### Notes

* This system operation only works in local execution service.
* The **API URL** can be displayed as a selectable list, if you have setup the integration. Please refer to [Setup Tools and Integrations](setup_tools.md#Agent_Server_API_Integration) for details.
* The API of your agent server should conform the [Agent Server API](ref_agent_api.md) specification.

##### Errors

* **Variable Name** does not conform rules of variable name. (in validation)
* **API Params** does not conform request query string format. (in validation and execution)
* Execute this system operation in cloud execution service. (in execution)
* Cannot communicate correctly with the API by using **API URL** and **API Params**. (in execution) 

##### Evidences

* Returned data in JSON text format

Operation - Pause Scenario
---

Pause the scenario and resume on a certain condition. All browser sessions will be closed and freed when the scenario is paused.

##### Parameters

| Parameters     | Explanation
| -------------  | -----------
| Pause Type     | `Sleep` for pausing a specific time, and `Wake Up` for waking up at a specific date time.
| Pause Duration | Minutes to pause. Works under `Sleep` type.
| Wake Up Date   | Date (`Today`, `Tomorrow`) to resume the paused scenario. Works under `Wake Up` type with **Wake Up Time**.
| Wake Up Time   | Time (by hour) to resume the paused scenario. Works under `Wake Up` type with **Wake Up Date**.

##### Notes

* If the Wake up date time has already been passed when executing this operation, the pause will be bypassed.
* You need to create a new session after resume by using **Go to URL* or **Session Control** operation.

##### Errors

* The value of **Pause Duration** is blank or not a natural number under `Sleep` type. (in validation and execution)

##### Evidences

* None

Operation - Session Control
---

Manipulate multiple browser sessions in scenario. You usually use one session (maybe with multiple windows) in one scenario. However, you need multiple sessions if you want to simulate several users interacting with each other in different browsers.

##### Parameters

| Parameters   | Explanation
| ------------ | -----------
| Action       | `Create` for creating a new browser session, `Activate` for switching a browser session to the current session.
| Session Name | The name of a new session or target session for activating. The session name of the default session is `default`.

##### Notes

* As a scenario executes operations one by one, you can only have one activated session at a time. You need to switch to other sessions before executing operations on it.
* You should take care of session timeout of unactivated sessions.
* There is a maximum parallel sessions defined in both local and cloud execution service. Scenarios with sessions more than the maximum will not be accepted by the execution service.

##### Errors

* **Session Name** does not conform rules of variable name. (in validation)
* Create a new session with an existing **Session Name**. (in execution)
* Activate a session with an non-existed **Session Name**. (in execution)

##### Evidences

* None

