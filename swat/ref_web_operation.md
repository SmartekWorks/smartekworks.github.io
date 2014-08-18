Web Operation
===

How to Use Web Operations?
---

Web operation is an interactive operation model on a page. SWAT knowledge engine analyses the page, extract the web operation according to knowledge rules. Please refer to [Knowledge Rule DSL](ref_knowledge_rule.md) for details of how to obtain appropriate operations for you page implementation. You can also edit and customize the operation. You can obtain the related information from [Preparing Page Knowledge](guide_knowledge.md).

To use web operation in scenario/flow builder is simple and straightforward. You just need to drag & drop a web operation onto a scenario flow or flow, and fill the parameters for the operation. A parameter may consist of five parts: **Parameter Title**, **Using Parameter Option**, **Parameter Data**, **Querying Mode Switch** and **Alert Options**.

#### Parameter Title

The title of parameter is usually extracted by SWAT knowledge engine automatically. You can also edit the title manually in **Operation Customization** page.

#### Using Parameter Option

The option is a checkbox next to the **Parameter Title**. It is checked by default, which means that the parameter will be used in execution. If you uncheck the node, there will not be any interaction on the node when executing the operation. Please refer to [Ignoring Parameter](#Ignoring_Parameter) for details.

Hint: You will find a checkbox to toggle all ** Using Parameter Option** on the bottom if there are more than five parameters in the operation.

#### Parameter Data & Querying Mode Switch

There are four types of **Parameter Data**: `Text`, `Select`, `Multi-select`, `Execute` for different types of node. 

* `Text`: The actual text inputed in text typed node such as text-box, text area etc.
* `Select`: Options selected in select typed node such as select. Collection with mutually exclusive entries such as radio group, or a group of link/button also belongs to this type.
* `Multi-select`: Options selected in multi-select typed node such as multi-select. Collection with non-exclusive entry such as checkbox group is also included in this type.
* `Execute`: Used for actions without parameter such as a single link. This type of parameter will be displayed as a text-box followed by <span class="glyphicon glyphicon-play"></span>. The text-box is used for setting variable so that you can ignore the parameter. Please refer to [Ignoring Parameter](#Ignoring_Parameter) for details.

If cases of `Select` and `Multi-select` you can switch the querying mode by clicking **Querying Mode Switch**, the <span class="glyphicon glyphicon-refresh"></span> icon next to the **Parameter Data**. Please refer to [Querying Modes](#Querying_Modes) for details.

#### Alert Options

Alert options which are displayed under **Parameter Data** will only be available for a node with alert. You can define a node with alert and for how long should SWAT wait for the alert in **Operation Customization**. There are three options to handle the alert.

* `Accept`: Accept the alert by clicking **OK**.
* `Dismiss`: Dismiss the alert by clicking **Cancel**.
* `No Alert`: Alert will not appear.

Please refer to [Window, Frame, Alert, AJAX](guide_scenes.md) for how to work with alert in your scenario.

Attention: An unexpected alert will cause error in execution, and the operation will also return error if an alert expected to handle doesn't appear. 

#### Errors

Web operation may encounter various of error in validation and in execution. Most common errors a listed below:

* Parameter data is not valid. (in validation and execution)
Value of parameter in `Text Query`, `Index Query` is not valid. Please refer to [Querying Modes](#Querying_Modes) for details.
* Cannot find target page. (in execution)
This error occurs when no page is satisfied the matching rules defined in page identification of the target page.
* Cannot find target operation. (in execution)
The expected operation does not exist.
* Cannot find target node. (in execution)
The expected node does not exist.
* Cannot find target sub-node. (in execution)
Cannot find the matched result based on the input of parameter in querying mode.

#### Evidences

All web operation will take the following basic evidences after execution.

* Screenshots
* HTML

If an operation contains several steps such as input and submission, an extra screenshot will be taken before the last step.

Querying Modes
---

If the parameter is related to a collection node in which you should choose a sub-node, you will have three querying mode for the parameter: `Static Select`, `Text Query`, `Index Query`. You can switch the mode by clicking the <span class="glyphicon glyphicon-refresh"></span> icon next to the parameter data field.

#### Static Select Mode

This is the default mode for parameters related to a collection node. The parameter data field is in form of a select or mulit-select. SWAT will search the sub-node by using properties of your selection defined in page knowledge.

* In multi-select typed node, you can select several sub-nodes.
* This mode is not available when the sub-node itself is a collection node. `Text Query Mode` will be de default mode in this case.
* Variables cannot be used.

#### Text Query Mode

The parameter data field will be displayed as a text-box followed by <span class="glyphicon glyphicon-th-list"></span>. SWAT will search the sub-node by using `equal`, `startWith`, `contain` policies in order until the first matched node is found.

* In multi-select typed node, use `,` to specify several sub-node querying text and use blank to select none. For example, `red, blue` will select the sub-node containing text `red` and the sub-node containing text `blue`.
* In single select typed node, blank is not allowed.
* Variables can be used.

#### Index Query Mode

The parameter data field will be displayed as a text-box followed by <span class="glyphicon glyphicon-font"></span>. SWAT will search the sub-node by the position. Use index `1` and bigger number to specify the first sub-node and after, and use index `-1` and smaller number to specify the last sub-node and before.

* In multi-select typed node, use `,` to specify several sub-node querying index and use blank to select none. For example, `1, 2` will select the sub-node at position `1` and the sub-node at `2`.
* In single select node, only integer except `0` is allowed.
* Variables can be used.

Using Variable
---

You can set a variable in format of `{var}` or `%var%` in the parameter data field to separate the data and scenario. All variables in a scenario/flow except those set by **Set Value**, **API Call** operation will become parameters of the scenario/flow.

Note: The variable set by **Set Value**, **API Call** operation obtains the value from the system operation in execution, so it doest not need outside data source.

Using variable should conform to the following rules:

* The variable name should be a string with only digits, alphabets, Japanese Characters, Chinese Characters and `_`.
* You can use several variables in one parameter data field such as `{var1}abc{var2}`.
* Variable can only be used in a text typed parameter, so you have to switch a parameter with form of select or multi-select to other querying mode before you use variables.
* Validation errors cannot not be detected until execution when you use variable.

Ignoring Parameter
---

Ignoring a parameter means that you do not want to interact with the node corresponding to the parameter in execution. Basically, you can do so by unchecking the **Using Parameter Option** of the parameter. 

Actually, you have several ways to ignore a parameter in execution.

1. Uncheck the **Using Parameter Option** of the parameter in scenario/flow builder.
2. Uncheck the **Using Data Option** of all the variables related to the parameter in case data dialog. (You can also using case export/import function to do so.)
3. Ignore the parameter of the parent node. For example, you may encounter a complex nested node operation such as a table operation with inputs in each row. If you ignore the parent node that selects a row, the child nodes (inputs in row) will be also ignored in execution.
4. Ignore the operation. When an operation is ignored, all the parameters in the operation will be ignored too.

Ignoring Operation
---

It is meaningless that you try to ignore the operation in scenario/flow builder because you can simply not add it. However, sometimes you may need to ignoring an operation in you case. 

Like the policy in ignoring parameter by ignoring variables, you can ignore the entire operation when you uncheck the **Using Data Option** of all the variables related to the operation in case data dialog. (You can also using case export/import function to do so.)

For example, you may have a *Search* operation with a *Search Box* and a *Search Button*, and you use only one variable `{SearchKey}` for the *Search Box*. You can bypass the *Search* operation by unchecking the **Using Data Option** of the variable `SearchKey` in case.

When an operation is ignored, you can not see the operation and evidence in your test result.

Note: To ignore the operation, you need to use at least one variable for the target operation.

Attention: If you ignore all the parameters in an operation, the operation will still be executed without any interaction. Though there is no interaction in execution, you can access the evidences of the operation in test result.
