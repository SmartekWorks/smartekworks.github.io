Executing Cases
===

This page explains how to execute cases with different execution services.

Preparing Execution Services
---

SWAT has two kinds of execution services, local execution service and public cloud execution service.

#### Local Execution Service

Local Execution Service can be setted up by installing SWAT execution server on you local desktops. The local execution service support is available both in SWAT cloud service and in SWAT package. It is free, though you have to take care of your local environment by yourself and it is not easy to maintain a number of OS/Browser combination. To setup local execution service, you need to do the following tasks.

1. Install browsers you want to use for test.
2. Install Java SDK 7.
3. Install SWAT execution server, which can be downloaded from **Execution Service Monitor** page in your SWAT service.
4. Configure your browser and OS settings for auto testing.

Please refer to [Execution Services Setup](setup_execservices.md) to setup local execution services on you desktop.

#### Public Cloud Execution Service

SWAT cloud service currently supports [BrowserStack](http://www.browserstack.com), a public cloud execution service, while SWAT package does not support public cloud execution service. Before the setup, you need to obtain a BrowserStack account and purchase an automation plan first. Then, you should setup your BrowserStack account information on SWAT.

Hint: We also offer payment and support agent service as a partner of BrowserStack. 

Note: If you are using trial account, the public cloud execution service has already been set up for you, and you cannot access the setup function.

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Input configuration string with your BrowserStack account to the **Cloud Execution** field with the following format. Please refer [Execution Services Setup](setup_execservices.md) to the details of the configuration string.
```json
{
	"browserstack":{
		"enable":true, 
		"username":"Your account name", 
		"accesskey":"Your access key", 
		"parallelization":"The maxium parallel sessions allowed in your subscription",
	}
}
```
3. Save the settings, and then you can run your scenarios on platforms from BrowserStack

Settings for execution
---

#### Target Server

**Target Server** decide which server URL you will run your case against. You can run the same scenario against your local development server, integration test server etc. Though you can set the URL when you create an execution, the more common practice is that you set the default value within your test set.

1. Visit **Scenarios** page in the test set we created in last chapter.
2. Click <span class="glyphicon glyphicon-pencil"></span> button on the right of the title area, and **Test Set Settings** page will be displayed.
3. In **Default Target Server** area, you will see text boxs for each site. Fill in *Bing* with `http://www.bing.com` and save.

Hint: You can also set the default target server for different sites in **Site Management** page. The value will be used as default when you create a new test set.

#### Platform & Window Size

**Platform** decide on which OS/Browser combination you will run your case against. You will have a more detailed settings for the execution services and platforms when you create an execution. However, it is convenient to have a default choice. **Window Width** and **Window Height** settings are useful when your web application is responsive. You can also convenient to set a default value. Both default settings can be set on your SWAT service level.

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Choose the default value for **Default Platform**, and Fill in the default value for **Window Width (px)** and **Window Height (px)**.
3. Save the settings.

#### Execution Parameters for Site

Every web application may have its own type of implementation such as frames, alert, and its own test requirement. We designed a extendable execution parameters for each site in order to change the detailed test behaviour. When you create a new site, a default set of parameters will be set. You don't need to change the parameters in most situations including our `Bing` site. Please refer to chapter [Window, Frame, Alert, AJAX](guide_scenes.md) for how to use the parameters in different scenes.

1. Visit **site management** page through menu *Management > Sites*, and then select *Bing* site.
2. Modify the setting string in **Exec Params** field. Please refer to [Settings DSL](ref_settings_dsl.md) for the details.

Executing Selected Cases
---

1. Visit **Scenarios** page in the test set we created in last chapter.
2. Check the checkbox before scenario `S0001`. All the cases will be automatically checked and **Execute** button will be displayed on the button toolbar.
3. Click **Execute** button, and **New Execution** page will be displayed.
4. You can change the default value **Execution Title**, designate when to start execution, selecting whether to allow cases in this execution running in parallel here. However, the system default is OK for now.
5. In **Target Platform**, SWAT will select the platform according to your default settings if it is available. You can choose different execution service and platform available in that service by yourself. You select multiple platforms with `Ctrl/Command` or `Shift` key being pressed.
6. SWAT will also use the default value of **Window Size** and **Target Server** by default.
7. You can remove cases or change case order from the case list on the left.
8. Click **OK** button to create the execution. **Executions** page will be displayed.
9. You can view the progress of each execution and cases under the execution on **Executions** page.

Note: If you select multiple platforms for the execution, you will create one execution for each platform.

Viewing Test Evidences
---

1. The progress label on the right of the cases will change to a button with **DONE** or **FAIL** status when the execution of the case has be completed.
2. Click the button with **DONE** or **FAIL** status. **Execution Results** page will be displayed.
3. You can review the execution status here. Click **Check Evidences** button. **Evidence Viewer** page of the selected test result will be displayed.
4. You can click the thumbnails to view the screenshots of all the test steps in a slide show.
5. You can also click a specific step in the scenario tree on the left to view the details of that step.

Verifying Test Result
---

After the execution, you can verify whether the case is OK with following approaches.

* Use **Evidence Viewer** page to verify the result.
* Export the evidences to Excel or other formats for offline check.
* Use assertion system operation to verify the result automatically.

Note: Please refer to [System & Web Operation](ref_operation.md) to learn how to implement auto verification with assertion system operation.

After verification, you may change the test result status after you check the evidence and create a issue for the result on **Execution Results** page.

#### Export Evidences

You can export evidences in several ways

* You can export a single result to Excel file or zip file on **Evidence Viewer** page.
* You can export all result in a execution to Excel file on **Executions** page.
* You can export a merged Excel file with several executions on **Executions** page.
* You can export all the latest result in test set to Excel file on **Scenarios** page.

Hint: When you export evidences to Excel files, you can choose from normal mode in which only evidences of assertion system operation will be exported and full mode in which evidences of all the steps will be exported. We recommend that you add some assertion system operation in you scenario and use normal mode, which will make the export more efficient and easier to implement auto verification later.

Next Steps
----

Now we've learned about how to run cases in SWAT and complete the automation of our *Bing* Test. There is still one thing you need to know to make your automation more efficient.

Go to [Working with Flow](guide_flow.md).