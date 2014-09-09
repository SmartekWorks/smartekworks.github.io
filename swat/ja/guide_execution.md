Executing Cases
===

This page explains how to execute cases and work with the test result.

Preparing for Execution
---

### Setup Execution Services

Before you can execute your cases, you need to preparing execution services on your SWAT service. SWAT has two kinds of execution services, local execution service and public cloud execution service.

If there is no execution service connected to SWAT, please setup a local execution server on your local machine according to [Execution Services Setup](setup_execservices.md#Setup_Local_Execution_Server).

If you have an BrowserStack account, you can also setup a cloud execution service on SWAT according to [Execution Services Setup](setup_execservices.md#Setup_BrowserStack_Service)

Hint: The BrowserStack Service has already been configured for you if you are using trial account or you purchase the BrowserStack Subscription with SWAT.

### Settings of execution

There are several important settings of your execution. You need to know them before execution.

#### Target Server

**Target Server** decides which server URL you should run the cases against. You can run the same cases against your test server on different stages, such as local development server, integration test server etc. The common practice is that you set the default value in your test set, though you can set or modify the value when you create a new execution.

1. Visit **Scenarios** page in the test set we created in last chapter.
2. Click <span class="glyphicon glyphicon-pencil"></span> button on the right of the title area, and **Test Set Settings** page will be displayed.
3. On **Default Target Server** area, you will see text-box for each site. Fill in *Bing* with `http://www.bing.com` and save.

Hint: You can also set the default value in **Site Management** page. The value will be used by default when you create a new test set.

Attention: The settings of **Target Server** is required for every execution including the sample scenario in this guide.

#### Platform & Window Size

**Platform** decides on which OS/Browser combination you will run the cases. **Window Width** and **Window Height** controls the window size of your browser in execution. They are useful when your web application is responsive. 

You have more detailed settings when you create a new execution. However, it is convenient to have a default choice. Both default settings can be set on SWAT service level. 

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Choose the default value for **Default Platform**, and Fill in the default value for **Window Width (px)** and **Window Height (px)**.
3. Save the settings.

#### Execution Parameters of the Site

Every web application has its own type of implementation such as frame, alert, and its own test requirements. We designed a extendable execution parameters for each site in order to change the detailed execution behaviour. A default set of parameters will be set when you create a new site. You don't need to change the parameters in most situations including the site `Bing`. 

Please refer to chapter [Window, Frame, Alert, AJAX](guide_scenes.md) for how to use the parameters in different scenes.

Executing Selected Cases
---

1. Visit **Scenarios** page in the test set we created in last chapter.
2. Check the checkbox before scenario `S0001`, and all the cases under the scenario will be automatically checked. **Execute** button will be displayed on the button toolbar as well.
3. Click **Execute** button, and **New Execution** page will be displayed.
4. You have several settings on **New Execution** page. However you will usually use the default settings except **Target Platform**. You can also remove cases or change case order from the case list on the right.
5. In **Target Platform**, SWAT will select the platform according to your default settings if it is available. You can also choose different execution services and platforms available in each service. (For multiple platform selection, you need press `Ctrl/Command` or `Shift` key while selecting.)
6. Click **OK** button to create the execution. **Executions** page will be displayed.
7. On **Executions** page, you can view the progress of execution and cases under the execution.

Note: If you select multiple platforms, you will create several executions, one for each platform.

Working with Test Result
---

1. The progress label on the right of the cases will change to a button with **DONE** or **FAIL** status when they has be completed.
2. Click the button with **DONE** or **FAIL** status. **Execution Results** page with the result information will be displayed.
3. Click **Check Evidences** button and **Evidence Viewer** page of the selected test result will be displayed.
4. You can click the thumbnails to view the screenshots of all the test steps in a slide show. You can also click a specific step in the scenario tree on the left to view the details of the step.

In most cases, you need to verify whether the case is OK or not. You can do so in following approaches.

* Use **Evidence Viewer** page to verify the result following the above steps.
* Export the evidences to Excel or other formats for offline check.
* Use **Assertion** system operation to verify the result automatically. (We will discuss this topics in other articles.)

You have several ways to export evidences to an Excel file.

* You can export a single result to Excel or zip file on **Evidence Viewer** page.
* You can export all results from a execution to Excel on **Executions** page.
* You can export all results from several executions to Excel on **Executions** page.
* You can export the latest results of all cases in test set to Excel on **Scenarios** page.

Hint: When exporting to Excel, you can choose normal mode (only evidences of **Assertion** system operation will be exported) or full mode (all evidences will be exported). We recommend that you use normal mode with several **Assertion** system operations in you scenario, which will make the export faster and make it easier to implement auto verification later.

After verification, you can change the test result status to `OK` or `NG`, and create a issue for the result on **Execution Results** page.

Next Steps
----

You can try to make your own test automation on SWAT! You are recommended to read articles from Article Section for the know-how from different cases. And you can refer to the Reference Section when you need to know the details of the specification.