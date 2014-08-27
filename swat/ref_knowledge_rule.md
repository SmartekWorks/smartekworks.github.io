Knowledge Rule DSL
===

Note: This page is currently under construction. We will complete the documentation as soon as possible.

SWAT Knowledge rule is a kind of Domain-specific language to define how to interact the web page. Though SWAT knowledge engine has the ability to analyse web pages, it needs knowledge rules to help handle the specific implementation of web pages. 

What is Knowledge Rule for?
---

You will have a default knowledge rule for each site by default, in which we defined the most common interactions in web pages. You can modified the default knowledge rule for following purposes.

* To add an operation without interactive HTML tags. It is usually necessary when you use Javascript or JS library to make a non-interactive HTML tag such as `DIV` interactive. You can find the sample in [User Guide](guide_tuning.md#Tuning_Page_Parsing).
* To change the default operation size. Mostly the default will extract operations in proper size according to general usability. However, sometimes you may want to merge several operations to be a bigger one or split one into several smaller operations.
* To change the policy of obtaining label of operations and nodes. When extracting operations and nodes, SWAT will try to obtain a label from the HTML for the title of the object. You can define how to do so, if you find the default rule does not fit your web page.
* To change the policy of locating operations and nodes in execution. As execution service interacts dynamic pages instead of static pages, you need to locator policy for reliable automation. Though HTML attributes such as `id` and `name` etc can works for a locator, most web applications do not have a good unified locator policy. As you can set different locating polices for different nodes, operations in a knowledge rule, you can handle the issue according to your implementation.

Note: The default rule will be updated occasionally for better compatibility. We are also planning to offer several template rules for different kinds of implementations.

Basics of Knowledge Rule
---

### Knowledge Rule Management

Knowledge rules are basically designed for a specific group of web pages such as web pages in a web application. Therefore, knowledge rules are managed under a web application or SWAT site. However as you may have several types of implementation in a web application, you can have several rules under a site. You can even add a knowledge rule for a special page, though we do not recommend to do so.

Every version of page knowledge is related to a rule under the same site. SWAT handles the page knowledge based on the related rule, so the knowledge rule cannot be modified once it is used. You can only add a new rule to upgrade the page knowledge, which will add a new version of page knowledge.

### Syntax

Knowledge Rule is a JSON map string with several keys to define the following components. The details of the syntax will be explained later.

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
* `collectionNodes`: Collection node is a group of single nodes with certain relations, such as several inputs in a form which you need to interact one by one, several links in a link list which you need to choose one from the list.
* `operations`: Operation is a special collectionNode which will finally be extracted as the operation of page knowledge.
* `labelPolicies`: Label policy defines how to retrieve a label for a single node and collection node when generating page knowledge.
* `locatorPolicies`: Locator policy defines how to locate a single node and collection node in execution.

Syntax of Core Components
---

### Definition of Single Nodes

Single nodes is a JSON map with keys for the node code of the nodes and value for the defination of the nodes. The node code can be used in a collection node definition. 


```json
{
	"singleNodes":{
		"link":{"selectors":["a[href]", "area[href]"], "decisive":true, "action":"click", "label":"link", "locator":"link"}
	}
}
```

The definition of a single node is also a JSON map containing following keys:

* `"selectors"`: (Required) JSON list of CSS selectors defining nodes in the HTML DOM.
* `"decisive"`: (Required) Whether the node should complete the operation or not. For example, you usually use `true` for buttons, and use `false` for inputs.
* `"action"`: (Required) Type of the interaction of the node. Please refer to the available action code table below.
* `"label"`: (Required) Label policy code defining which label policy should be used for the node.
* `"locator"`: (Required) Locator policy code defining which locator policy should be used for the node.

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

### Definition of Operations

Syntax of Supportive Components
---

### Definition of Label Policies

### Definition of Locator Policies

Design a Good Knowledge Rule
---



Case Studies
---

