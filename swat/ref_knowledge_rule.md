Knowledge Rule DSL
===

SWAT Knowledge rule is a kind of Domain-specific language to describe how to interact with a web page. Though SWAT knowledge engine has the ability to analyse web pages, it needs knowledge rules to help handle some specific implementations of web pages. 

What is Knowledge Rule for?
---

You will have a default knowledge rule for each site by default, in which the most common interactions are defined. You can modify a default knowledge rule for the following purposes.

* To add an operation without interactive HTML tags. It is usually necessary when you use Javascript or JS library to make a non-interactive HTML tag such as `div` interactive. You can find a sample in [User Guide](guide_tuning.md#Tuning_Page_Parsing).
* To change the default operation size. Mostly the default rule will extract operations in proper size according to the general usability. However, sometimes you may want to merge several operations to a bigger one or split one into several smaller operations. You can do so by modify the default rule.
* To change the policy of how to locate the operations and the nodes in execution. As cases are usually executed on dynamic pages instead of static pages, you need a locator policy for reliable automation. Ad most web applications do not have a good unified locator policy such as using HTML attributes such as `id` and `name`, you may need to set different locating polices for different nodes, operations in the knowledge rule.
* To change the policy of how to obtain the label of operations and nodes. SWAT will try to obtain the label from the HTML for the title of the object when extracting operations and nodes. You can change the default policy to a more suitable one for your web application.

Note: The default rule will be updated occasionally for better compatibility. We are also planning to offer several template rules for different kinds of implementations.

Basics of Knowledge Rule
---

### Knowledge Rule Management

Knowledge rules are basically designed for a specific group of web pages such as all web pages in a web application. Therefore, knowledge rules are managed under a web application or SWAT site. However as you may have several types of implementation in a web application, you can have several rules under a site. You can even add a knowledge rule for a specific web page, though we do not recommend you do so for maintenance issues.

Each version of page knowledge in SWAT is related to a rule under the same site. SWAT handles the page knowledge based on that rule, so the knowledge rule cannot be modified once it has been used. You can only add a new rule to upgrade the page knowledge, which will add a new version of page knowledge.

### Syntax

Knowledge Rule is a JSON map string with several keys to define the following components. The details of the syntax for each component will be explained later.

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

* `singleNodes`: Single node is an atomic interactive node we need to interact in the operation, such as an input, a button.
* `collectionNodes`: Collection node is a group of single nodes or even other collection nodes with certain relations, such as several inputs in a form which you need to interact one by one, several links in a link list which you need to choose one from the list.
* `operations`: Operation is a special collectionNode which will finally be extracted as the operation of page knowledge.
* `labelPolicies`: Label policy defines how to retrieve the label for a single node and collection node when generating page knowledge.
* `locatorPolicies`: Locator policy defines how to locate a single node and a collection node in execution.

The `singleNodes`, `collectionNodes` and `operations` are the most important components and they are required for every rules, while the `labelPolicies` and `locatorPolicies` are not required.

Syntax of Core Components
---

### Definition of Single Nodes

Single nodes are defined as a JSON map with keys for the node code of the nodes and values for the definition. The node code can be referenced from the definition of a collection node. Below is the sample. 

```json
{
	"singleNodes":{
		"link":{"selectors":["a[href]", "area[href]"], "decisive":true, "action":"click", "label":"link", "locator":"link"},
		"radio":{"selectors":["input[type=radio]"], "decisive":false, "action":"click", "label":"fieldRight", "locator":"field", "group":{"by":"name", "label":"group", "locator":"group"}},
	}
}
```

The definition of a single node is a JSON map containing values for following keys:

* `"selectors"`: **(Required)** A JSON list of CSS selectors defining nodes in the HTML DOM.
* `"decisive"`: **(Required)** `true` or `false` indicating whether the node would complete an operation or not. For example, you usually use `true` for buttons, and use `false` for text-boxes.
* `"action"`: **(Required)** Action code indicating the type of node interaction. Please refer to the action code table below.
* `"label"`: **(Optional)** Label policy code indicating which label policy should be used for the node.
* `"locator"`: **(Optional)** Locator policy code indicating which locator policy should be used for the node.
* `"group"`: **(Optional)** A JSON Map defining how to group the single nodes such as a group of radios and checkboxes. The definition contains values for following keys.
 * `"by"`: **(Optional)** The attribute name used to group the nodes. `"name"` is used by default.
 * `"label"`: **(Optional)** Label policy code for the whole group.
 * `"locator"`: **(Optional)** Locator policy code for the whole group.

Action code table:

| Action          | Explanation
| --------------- | -----------
| `"type"`        | Type some text into the node such as a text input.
| `"upload"`      | Set a file path into the node such as a file input.
| `"select"`      | Select the node such as an option of a select.
| `"check"`       | Check the node such as a checkbox.
| `"click"`       | Click the node such as a button.
| `"moveTo"`      | Move mouse cursor to the node such as a hover button.
| `"rightClick"`  | Right click the node such as a link with context menu.
| `"doubleClick"` | Double click the node such as an area with double click interaction.


### Definition of Collection Nodes

Collection nodes are defined as a JSON map with keys for the node code of the nodes and values for the definition. The node code can be referenced from the definition of an operation or a collection node. Below is the sample. 

```json
{
	"collectionNodes":{
		"form":{"selectors":["*"],"children":["text", "textarea", "upload", "checkbox", "radio", "select", "multiSelect", "buttonGroup"], "action":"and", "label":"block", "locator":"block"},
		"buttonGroup":{"selectors":["*"], "children":["button", "link"], "action":"or", "label":"block", "locator":"block"},
	}
}
```

The definition of a collection node is a JSON map containing values for following keys:

* `"selectors"`: **(Required)** A JSON list of CSS selectors defining nodes in the HTML DOM. You can use `"*"` to indicate the same as parent node or the operation.
* `"children"`: **(Required)** A JSON list of single nodes or collection nodes which should be included in the collection node.
* `"action"`: **(Required)** Action code indicating the type of the interaction. Please refer to the action code table below.
* `"label"`: **(Optional)** Label policy code indicating which label policy should be used for the node.
* `"locator"`: **(Optional)** Locator policy code indicating which locator policy should be used for the node.

Action code table:

| Action    | Explanation
| --------- | -----------
| `"and"`   | Interact with each children node one by one.
| `"or"`    | Select a child node from children and interact with it.
| `"multi"` | Select several children nodes from children and interact with them. This action is only used in `multi-select`.


### Definition of Collection Nodes (Repetitive)

Among the collection nodes, you can define a special kind of collection nodes, which contains repetitive, usually dynamic nodes such as a table with rows of different data or a list of search results. Below is the sample. 

```json
{
	"collectionNodes":{
		"list":{"selectors":["ul", "ol"], "children":["list-unit"], "repetitive":true, "similarity":0.90, "combination":2, "percentage":0.5},
		"list-unit":{"selectors":["li"], "children":["buttonGroup"]},
	}
}
```

There are some differences in repetitive collection node definitions. Firstly, you have to define the parent collection node and child collection node in a set. Secondly, You do not need to define `"action"`, `"label"` and `"locator"` because the mechanism of handling repetitive collection node is quite different. At last, you need to define values for following new keys in the parent node.

* `"repetitive"`: **(Required)** It should always be `true` in parent repetitive collection node.
* `"similarity"`: **(Required)** A float number from `0` to `1`, which indicates whether to think similar children nodes are repetitive. the larger is the more strict. 
* `"combination"`: **(Required)** An Integer number from `1` to `9`, which indicates how many neighbour children nodes can be combined as a repetitive unit. For example, you may need to set the combination to `2`, if you use two `tr` with `row-span=2` to make a logical row in a table.
* `"percentage"`: **(Required)** A float number from `0` to `1`, which indicates whether to think the parent node is a repetitive collection nodes. The repetitive children nodes / all children nodes has to be larger than the value to make the parent a valid repetitive node.

Hint: The definition of repetitive node is quite complicated. We recommend you start with the default rule, and make some experiment before modification.

### Definition of Operations

Operations are defined as a JSON list of definitions of operation. As the knowledge engine will analyse the operations in sequence, you should take care of the order too. Below is the sample. 

```json
{
	"operations":[
		{"selectors":["form", "table"], "collectionNode":"form", "nesting":"outer"},
		{"selectors":["map", "ul", "ol", "dl", "nav", "div", "a", "button"], "collectionNode":"buttonGroup", "nesting":"inner"},
	]
}
```

The definition of an operation is a JSON map containing values for following keys:

* `"selectors"`: **(Required)** A JSON list of CSS selectors defining the operation search area in the HTML DOM.
* `"collectionNode"`: **(Required)** The Collection node to be extracted as an operation in the operation search area.
* `"nesting"`: **(Required)** `outer` or `inner` indicating the search sequence in the area. `inner` means to search the operation from bottom of the DOM tree while `outer` means to search from the top of the DOM tree. For example, if the `"selectors"` contains a nested `"div"`, the result will be influenced by the value.


Syntax of Supportive Components
---

### Definition of Label Policies

The label policies are defined as a JSON map. Each entry stands for a single label policy with the key as the policy code which can be referenced in node definitions. Here is the sample:

```json
{
	"labelPolicies":{
		"fieldLeft":["label", "prevSibling", "parentPrevSibling", "parentTdPrevSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"fieldRight":["label", "nextSibling", "parentNextSibling", "alt", "title", "id", "name", "placeholder", "value"],
		"button":["label", "alt", "title", "value", "text", "id", "name"],
	}	
}
```

Each label policy consists of a series of atomic labelling mechanisms in order. All these mechanisms will be processed in sequence until one returns a non-empty string. Detailed explanation could be referenced as below:

| Mechanism    				| Explanation
| --------- 				| -----------
| `"label"` 				| The text of the `<label>` node corresponding to the target node. The `id` value of the target node should be the same as the `for` value of the `<label>` node.
| `"text"` 					| Get the text owned by the target node only, otherwise get the combined text of all children.
| `"prevSibling"`   		| The text of the previous sibling node in DOM tree.
| `"nextSibling"`   		| The text of the next sibling node in DOM tree.
| `"parentPrevSibling"`   	| The text of the previous sibling node of the target's parent node in DOM tree.
| `"parentNextSibling"`  	| The text of the next sibling node of the target's parent node in DOM tree.
| `"parentTdPrevSibling"`   | The text of the previous `<td>` node corresponding to the nearest `<td>` containing the target's parent node in DOM tree.
| `"imgChild"` 				| The `alt` or `title` or `id` value of the `<img>` child node.
| `"firstChild"`   			| The text of the first child node.
| `"alt"`   				| The value of the target node's attribute `alt`.
| `"title"`   				| The value of the target node's attribute `title`.
| `"id"`	   				| The value of the target node's attribute `id`.	
| `"name"`   				| The value of the target node's attribute `name`.
| `"placeholder"`  			| The value of the target node's attribute `placeholder`.
| `"value"`   				| The value of the target node's attribute `value`.


### Definition of Locator Policies

The locator policies are defined as a JSON map. Each entry stands for a single locator policy with the key as the policy code which can be referenced in node definitions. Here is the sample:

```json
{
	"locatorPolicies":{
		"field":["name", "id", "label", "xpath"],
		"button":["id", "name", "value", "label", "xpath"],
		"link":["id", "label", "xpath"],
	}	
}
```
Each locator policy consists of a series of atomic locating mechanisms in order. All these mechanisms will be processed in sequence until one can locate the node uniquely. The output nodes of the previous mechanism will act as the input of the next one. Detailed explanation could be referenced as below:

| Mechanism    	| Explanation
| --------- 	| -----------
| `"name"` 		| Get nodes with the same `name` as the target node.
| `"id"` 		| Get nodes with the same `id` as the target node.
| `"value"`		| Get nodes with the same `value` as the target node.
| `"class"`		| Get nodes with the same `class` as the target node.
| `"xpath"`		| Get nodes with the same `xpath` as the target node. Here the `xpath` is the one relative to its parent in operation knowledge tree.
| `"label"`		| Get nodes with the same `label` as the target node. Here the `label` is the one generated by its label policy.


Case Studies
---

### jQuery UI dialog

The default knowledge rule leverages the standard HTML specification, and sometimes need to be extended especially when some UI library is introduced into the web site. Here is the sample code snippet of a jQuery UI dialog:

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

In regards to the above HTML, the default rule will extract the `<form>` block as one operation, and the `<div class="ui-dialog-buttonset">` block as the other operation. However, we prefer to combining all the elements inside the dialog into one pseudo form. This magic takes place with only one tiny modification to the existing rule as below. 

```json
{
	"operations":[
		{"selectors":["div.ui-dialog", "form", "table"], "collectionNode":"form", "nesting":"outer"},
	]
}
```

Note: Please be noted that "div.ui-dialog" must stands before "form" so that all the child elements could be absorbed.

As a further step to the case above, now the dialog is treated as a `form`, but this is not enough as we want to create a much more personalized rule towards such kind of dialogs. Thus, we need to create an operation rule, a collection node rule and a label policy respectively.

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

Hereby we create a new type of operation which is comprised of an `ui-dialog` collection node. This collection node has several text fields and a group of buttons, with its first child's text as the label: `"Create new user"` accordingly in this case.

Note: More cases would be appended to cover more HTML variations.
