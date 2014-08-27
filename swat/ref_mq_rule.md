Matching & Querying DSL
===

Matching rules and querying rules are used to assert conditions on a web page and retrieve values from a web page accordingly. You usually do not need to use either types of rules if build a simple scenario and want it run automatically in you browser. However, you may need these rules to improve test efficiency and help you build complicated scenarios.

Why Using Matching Rules?
---

Matching rules are written in a kind of Domain-specific language, which we can use to assert conditions on a web page. You can use matching rules in the following functions of SWAT.

#### Scenario Auto-Verification

You can use [**Assertion** system operation](ref_sys_operation.md#Operation_-_Assertion) to add checkpoints to a scenario. You need to set matching rules as a parameter of the system operation, and when executing it, SWAT will check whether the page in the activated window pass the matching rules or not. If the conditions are not satisfied, the execution will report error. Therefore, if you design a scenario with adequate assertions, you can tell the test passed or not without checking every screenshots manually.

Though to build such kind of auto-verification tests needs some efforts, it can greatly increase test efficiency and it is mostly required in regression tests.

#### Finding Window in Scenario

You can use [**Window Control** system operation](ref_sys_operation.md#Operation_-_Window_Control) to find the target window and manipulate it. You need to set matching rules as a parameter of the system operation, and when executing it, SWAT find the first window which pass the matching rules and switch it to the current window or close it.

#### Page Identification

You can define matching rules as an identification of the page knowledge by following steps:

1. Visit **Page Knowledge** page through menu `Knowledge > Pages`.
2. Select the target page in the tree on the left.
3. Click <span class="caret"></span> next to the **Save** button and select **Page Identification** in the pull-down menu. A **Matching Rules of Page Identification** dialog will be displayed.
4. Input the matching rules in the text area and save.

If you define the identification of a page, SWAT will check the whether the page pass the matching rules or not before executing operation on that page. It helps to avoid executing operation on the wrong page which is similar to the target page. 

Matching Rule DSL
---

Matching rule is a JSON map string with the assertion condition. In SWAT, you usually use matching rules, which is a JSON list containing several matching rule.

```json
[
	{"target":"url", "have_text":"contract"},
	{"target":"title", "equal_text":"Search Results"}
]
```

### Syntax

The JSON map contains three type of keys:

* `"frame"`: (Optional) The target frame's name or ID. SWAT will use the main HTML if the key is not defined. (You can ignore the key if your web application does not use frames.)
```json
{"frame":"main", "have_text":"Success"}
```
* `"target"`: (Optional) The target of the evaluation. You can use the following values. The default value is `"body"`.
```json
{"target":"url", "have_text":"contract"}
```
 * `"url"`: URL of the page.
 * `"title"`: Title of the page.
 * `"alert"`: Text of the all alerts appeared in the previous operation. (`"alert"` type is only available in **Assertion** system operation.)
 * *Selector String*: An area in the page (first matched frame if you have `"frame"` key) defined by CSS selector such as `"body"`, `"#Main"`. We recommend you use `"body"` unless you have several logical pages implemented in areas of a physical page.
* *Evaluation*: (Required) You can use several types of evaluations by specifying following keys and values
```json
{"target":"title", "equal_text":"Search Results"}
{"have_css":{"css":"button#btnOK", "with_text":"Go"}}
```
 * `"equal_text"`: The target text should equal to the string value of the key.
 * `"not_equal_text"`: The target text should not equal to the string value of the key.
 * `"have_text"`: The target text should contain the string value of the key.
 * `"not_have_text"`: The target text should not contain the string value of the key.
 * `"have_css"`: The target area should contain a node defined in the value of the key. It is only valid when `"target"` is a selector string.
 * `"not_have_css"`: The target area should not contain a node defined in the value of the key. It is only valid when `"target"` is a selector string.

The value of `"have_css"` and `"not_have_css"` is a JSON map contains following keys:

```json
{"have_css":{"css":"button#btnOK", "with_text":"Go"}}
```

* `"css"`: (Required) a node defined by CSS selector.
* `"with_text"`: (Optional) You can add condition to `"css"` by defining that the `text` of the node should equal to the string value of the key.
* `"with_part_text"`: (Optional) You can add condition to `"css"` by defining that the `text` of the node should contain the string value of the key. SWAT will bypass this condition by default.
* `"with_value"`: (Optional) You can add condition to `"css"` by defining that the `value` of the node should equal to the string value of the key. SWAT will bypass this condition by default.
* `"with_href"`: (Optional) You can add condition to `"css"` by defining that the `href` of the node should equal to the string value of the key. As the href is from the actual DOM, it is the full URL instead of the relative URL you may defined in HTML. If you need use the `href` you defined in HTML, you can use CSS select with attribute match. SWAT will bypass this condition by default.
* `"with_index"`: (Optional) You can add condition to `"css"` by defining that the index (starting from `1`) of the matched node should equal to the number value of the key. SWAT will bypass this condition by default.
* `"enabled"`: (Optional) You can add condition to `"css"` by defining whether the node should be enabled or not (true/false). SWAT will bypass this condition by default.
* `"selected"`: (Optional) You can add condition to `"css"` by defining whether the node should be selected or not (true/false). SWAT will bypass this condition by default.
* `"displayed"`: (Optional) You can add condition to `"css"` by defining whether the node should be displayed or not (true/false). SWAT will use `true` by default.

### Samples

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

Why Using Querying Rules?
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

* `"frame"`: (Optional) The target frame's name or ID. SWAT will use the main HTML if the key is not defined. (You can ignore the key if your web application does not use frames.)
```json
{"frame":"main", "source":"#orderNo", "css_key":"text"}
```
* `"source"`: (Required) The source of the value. You can use the following values.
```json
{"source":"#selectGender", "css_key":"value"}
```
 * `"url"`: URL of the page. You need to use `"query_key"` to retrieve the value of a parameter of the query string.
 * `"title"`: Title of the page.
 * `"alert"`: Text of the last alert appeared in the previous operation.
 * *Selector String*: A node in the page (first matched frame if you have `"frame"` key) defined by CSS selector. You need to use `"css_key"` to retrieve the text or attribute of the node.
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

