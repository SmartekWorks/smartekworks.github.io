Building Scenarios
===

This page explains how to build scenarios and cases with SWAT knowledge base.

Creating Project / Test Set
---

#### Creating Project

SWAT uses project as the top layer management container for grouping a number of test sets.

1. Visit **Project Management** page through menu *Management > Projects*.
2. Click <span class="glyphicon glyphicon-plus"></span> button to add a new project.
3. Fill in **Code** and **Title**, and then create the project.
4. Visit **Projects** page through menu *Test*. You can see the newly created project.

#### Creating Test Set

Test set is the main container for managing scenarios, executions and issues. With it you can set default execution settings for scenarios, and you can also export/import test cases on test set level. 

1. Visit **Projects** page through menu *Test*.
2. Click the newly created project and select **Create new test set** under it.
3. Fill in **Code** and **Title**, and then create the test set.
5. After the creation of test set, the **Scenarios** page of this test set will be displayed. 
6. You will find a default scenario group with the code `SG0001` has been created by default in the test set.

#### About the Scenario Group

Scenario group is a group of scenarios in the test set. The main purpose is to categorise you scenario, and you can use tags on scenario groups to filter the scenarios within test set.

Hint: You can also use some special tags such as `before`, `after` to define a group of scenarios working as AOP interceptors.

Creating Scenario
---

Though to design a good scenario is not easy, it is simple to create a scenario in SWAT. 

1. Visit **Scenarios** page of the test set we created.
2. Click <span class="caret"></span> on the right of the default scenario group `SG0001` and select **Add scenario**. **Test Scenario Builder** page will be displayed. 
3. **Test Scenario Builder** is divided into three main areas:
 * **Left**: Tree of building blocks, such as system operations, flows and web operations from knowledge base.
 * **Upper Right**: Scenario flow of building block.
 * **Lower Right**: Properties of the selected building block on the scenario flow, including parameters and description.
4. The **Go to URL** system operation will be automatically inserted to the new scenario flow. It will start a browser and visit the URL of your test site.
5. To build a scenario, you should drag some system operations, flows, web operations from left and drop them to the scenario flow on the right. 
6. For each operation, you need to input the parameters for the data in execution.
7. Fill in the scenario title above the scenario flow and Click **Create** button to complete building a scenario.
8. The **Scenarios** page will be displayed and you can see the newly created scenario under the default scenario group `SG0001`.

Hint: You can click <span class="glyphicon glyphicon-eye-open"></span> besides the search box to open a help/summary/preview window for system operations, flows and web operations.

Building the Sample Scenario
---

1. On **Test Scenario Builder** of the new Scenario, click the default **Go to URL** system operation.
2. We need to select `Bing` for **Site** and leave the **URL** blank, which means that we visit the home page of site *Bing*.
3. Switch the site of the left tree to site *Bing*, and then you will see page *Bing* and *BingSA*.
4. Drag & drop the *Search* operation under *Bing* to the scenario flow. The operation will be appended to the flow and be activated. 
5. On the <span class="glyphicon glyphicon-th-list"></span> tab of operation property, the text-box named **Enter your search ...** refers to the search box and 
the select named **Action** refers to all actions under this operation. (There is only one search button in this operation.)
6. Though you can enter a keyword directly in the text-box, we prefer to using variable here. So you fill in **Enter your search ...** with `{Keyword}`. (Please refer to [Web Operation](ref_web_operation.md#Using_Variable) for details of using variables.)
7. For our sample scenario, we need to select an item in suggestion list instead of clicking *Search* button. So, we have to uncheck the checkbox after **Action** to ignore the parameter. (Please refer to [Web Operation](ref_web_operation.md#Ignoring_Parameter) for details of ignoring parameter.)
8. Drag & drop the *Suggestion List* under *BingSA* to the scenario flow, and you will see a select named **sa_list** on the data tab. The content of the list is from the page knowledge we imported before.
9. As the list will change according to the input, we choose **Index Query Mode** of the list by clicking <span class="glyphicon glyphicon-refresh"></span> icon after the select twice. Then Input `{Index}` in the filed, which means that the item on the position `{Index}` should be selected during execution. (Please refer to [Web Operation](ref_web_operation.md#Querying_Modes) for details of querying modes.)
10. The sample scenario is done.

Adding Cases to Scenario
---

You can add different sets of data to a scenario as different cases if you use variables in the scenario. With data separated from scenario, you can easily reuse your scenario with with different inputs.

1. Visit **Scenarios** page of the test set we created.
2. Click <span class="caret"></span> on the right of the newly created scenario `S0001` and select **Add case**. A dialog will be displayed with **Title** and **KeyWord** and **Index**, which are the names of variables we defined in the scenario.
3. Fill in **Title** with whatever you like. Fill in **Keyword** with `automation` and **Index** with `2`, which means you enter `automation` to the search box and select the second suggestion on the suggestion list.
4. Repeat the above steps to add another cases with `test` and `-1` for **Keyword** and **Index**. You will select the last suggestion on the suggest list in this case.

Hint: You can export/import case table of test set in Excel format. By doing so, you can easily add/modify/delete cases in Excel.

Next Steps
----

Now we know how to build scenarios and cases. The next step is to run these cases on the execution service.

Go to [Executing Cases](guide_execution.md).