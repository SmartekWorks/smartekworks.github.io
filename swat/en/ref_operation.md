System & Web Operation
===

This page explains the details of using system operation and web operation.

Note: This page is currently under construction. We will complete the documentation as soon as possible.

How to use Web Operation
---

How to use System Operation?
---

Operation - Go to URL
---

Go to a certain URL in the current browser session and window. It will start a new browser session and window if necessary.

| Parameters | Explanation
| ---------- | -----------
| Site       | Site managed in SWAT. SWAT will use the execution related settings of the site after this operation.
| URL        | Relative URL to the target server URL of the **Site**. You can also use full URL starting with `http://`, `https://`, `file://` to ignore the target server URL. 

##### Errors

* The generated URL from **URL** and the target server URL of the **Site** is blank or invalid. (in execution)

##### Evidences

* Screenshots
* HTML

Operation - Wait in Browser 
---

Operation - Navigation Control 
---

Operation - Save Download
---

Operation - Window Contorl
---

Find the target window and manipulate it.

| Parameters     | Explanation
| -----------    | -----------
| Window Name    | Find the target window with name. Leave blank to bypass it.
| Matching Rules | Find the target window pass the matching rules. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of matching rule. Leave blank to bypass it.
| Action         | **Activate**: Switch the target window to the current window. **Close**: Close the target window.

##### Notes

* If both **Window Name** and **Matching Rules** are designated, they should both be satisfied. 
* If both **Window Name** and **Matching Rules** are blank, the current window will be the target window.

##### Errors

* **Matching Rules** do not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation or execution) 
* No window can be found. (in execution)

##### Evidences

* Screenshots
* HTML

Operation - Assertion
---

Assert whether the page in current window is the page you expected.

| Parameters     | Explanation
| -----------    | -----------
| Matching Rules | Expectation in format of matching rules. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of matching rule. Leave blank to bypass it.

##### Notes

* Only evidence of assertion operation will be included in normal mode evidence export. So, you can use it with blank **Matching Rules** as a checkpoint of your scenaro.

##### Errors

* **Matching Rules** do not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation or execution) 
* Assertion failed. (in execution)

##### Evidences

* Screenshots
* HTML
* Assertion Result in JSON text format

Operation - Set Value
---

Set a value from the page in current window to a variable, which you can use in the parameters of following operations.

| Parameters    | Explanation
| ------------- | -----------
| Querying Rule | Definiation of the target value in format of Querying rule. Please refer to [Matching & Querying DSL](ref_mq_rule.md) for the details of querying rule. 
| Variable Name | Variable Name to store the value.


##### Errors

* **Query Rule** does not conform [Matching & Querying DSL](ref_mq_rule.md). (in validation or execution) 
* **Variable Name** does not conform rules of variable name. (in validation)
* **Variable Name** has been referenced in the previous operations. (in validation)
* Querying target cannot be found. (in execution)

##### Evidences

* Screenshots
* HTML
* Set Value Result in JSON text format

Operation - Additional Evidences
---

Operation - API Call
---

Operation - Pause Scenario
---

Operation - Session Control
---