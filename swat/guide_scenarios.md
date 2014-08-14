Building Scenarios
===

This page explains how to build a scenario with SWAT knowledge base.

Creating Project / Test Set
---

#### Creating Project

SWAT uses project as the top layer management container for grouping a number of test sets.

1. Visit **Project Management** page with top menu *Management > Projects*.
2. Click <span class="glyphicon glyphicon-plus"></span> button to add a new project.
3. Fill in **Code** and **Title**, and then click **Create** button to create a new project.
4. Visit **Projects** page with top menu *Test*. You can see the newly created project.

#### Creating Test Set

Test set is the main management container for manage scenarios, executions and issues. You can set some default settings on test set, and you can also export/import test cases on test set level. 

1. Visit **Projects** page with top menu *Test*.
2. Click the newly created project and select **Create new test set** under it.
3. Fill in **Code** and **Title**, and then click **Create** button to create a new project.
4. **Default Platform** and **Default Target Server** decide your default execution settings, and they will be explained in [Executing Cases](guide_execution.md).
5. After creation of test set, you will be redirected to the **Scenarios** page in this test set. You can only find a default scenario group with the code `SG0001` in the test set.

#### Working with Scenario Group

Scenario is the smallest management container for grouping a number of scenarios. You can use tags on scenario group to filter the scenarios within test set.

Hint: You can also use some special tags such as `before`, `after` to give some special attribute to groups of scenarios. This will be explained in [Executing Cases](guide_execution.md).

Building Scenario
---

1. Visit **Scenarios** page in the newly created test.
2. Click <span class="caret"></span> on the right of the default scenario group `SG0001` and select **Add scenario**. **Test Scenario Builder** page will be shown. The workspace of **Test Scenario Builder** is devided into three areas:
 * **Left**: Trees of building block, such as system operations, flows, and the most important web operations from knowledge base.
 * **Upper Right**: Area to hold scenario flow of building block.
 * **Lower Right**: Properties of the building block on the scenario flow, including parameters and description.
3. The system operation **Navigate to** has been automatically inserted to the scenario flow. It will start a browser and visit the URL you entered in execution. In our *Bing Scenario*, we just need to select the *Bing* for **Site** and leave the URL blank, which means that we just visit the home page of *Bing*.
4. Switch the site of the left tree to *Bing*, so you can find *Bing* page and *Bing_with_suggestion* page.
5. Click *Bing* on the tree and drag & drop the *Search* operation to the scenario flow. The operation will be appended to the flow and activated.
6. On the <span class="glyphicon glyphicon-th-list"></span> tab of operation property, All the parameters of this operation are presented in a normalized way. The text box named *Enter your search ...* means the input of the search box and the select named *Action* means all actions for this operation. (There is only one search button in this operation)
7. Though you can enter a keyword directly in the search box, we prefer using variable here. To achieve this, you just fill in *Enter your search ...* with `{Keyword}`.
8. In our *Bing Scenario* we need to select an item in suggestion list instead of click *Search* button. So, we have to uncheck the checkbox after *Action*, which means that we will not interact with this element during execution.
9. Put *Suggestion List* under *Bing_with_suggestion* to the scenario flow, and you will see a select named *sa_list* on the data tab. As the list will be changed when you type different word in the search box, we should use dynamic match instead of select one from the list.
10. Click <span class="glyphicon glyphicon-refresh"></span> icon after the select. The select mode will switch to **Text Matching** mode, which will select an item with label containing the value. As we don't know the expected list until the execution. We cannot use this mode in our scenario too.
11. Click <span class="glyphicon glyphicon-refresh"></span> icon again. The select mode will switch to **Index Matching** mode, which will select an item by index. It is good for us, so you can input `{Index}` in the filed.
12. Fill in the scenario title above the scenario flow and Click **Create** button to complete building the scenario.

Hint: Please refer to [System & Web Operation](ref_operation.md) for the detailed reference.

Adding Cases to Scenario
---

If you set any variable in the scenario, You can add different sets of data for variables of the scenario. SWAT use **Case** for a set of data. With data sepprated from scenario, you can easily reuse your scenario with different sets of data. 

1. Visit **Scenarios** page in the newly created test.
2. Click <span class="caret"></span> on the right of the newly created scenario `S0001` and select **Add case**. A dialog with **Title** and inputs related to the scenario variables will show.
3. Fill in **Title** with what you like, and **Keyword** with `test`, **Index** with `2`, which means you enter `test` to the search box and select the second suggestion on the suggestion list.
4. You can add some other case with differnt values of **Keyword** and **Index**.

Hint: You can export case table of test set in Excel file and import it back to the test set. You can easily add/modify/delete cases on Excel file in this way.

Next Steps
----

Now we know how to build scenarios and cases. The next step is running those cases on execution services.

Go to [Executing Cases](guide_execution.md).