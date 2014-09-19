Setup SWAT Tools and Integrations
===

We offer several tools and integrations with other services to help you use SWAT more efficiently.

SWAT Capture Tool
---

**SWAT Capture Tool** is a browser extension to capture the HTMLs from you web application which is used in SWAT page knowledge import. SWAT also support HTMLs you save by using *Save As HTML* function of your browser. However, as **SWAT Capture Tool** can handle frame structure in web application and capture realtime rendered HTML, you should use it if the web application is in the above cases.

**SWAT Capture Tool** is currently offered on Google Chrome, Mozilla Firefox and Internet Explorer.

Attention: As some extensions will modify the DOM of you web pages, it is recommended to uninstall them before using **SWAT Capture Tool**.

### Google Chrome

#### Requirements

* Google Chrome 31 or above 

#### Installing the Extension

1. Start Chrome browser and visit the [SWAT Capture Tool page](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie) in Chrome Web Store.
2. Click <span class="glyphicon glyphicon-plus"></span> **Free** button to install the extension. Then you will find ![SWAT icon](assets/images/extension.png) icon on toolbar.

#### Using the Extension

1. Visit any web pages and click ![SWAT icon](assets/images/extension.png) icon. 
2. An SHTML type file will be saved to your default download directory automatically.

### Mozilla Firefox

#### Requirements

* Mozilla Firefox 29 or above 

#### Installing the Add-on

1. Start Firefox browser and visit the [SWAT Capture Tool page](https://addons.mozilla.org/firefox/addon/firefoxswatcapture/) in the online Firefox Add-ons Marketplace.
2. Click <span class="glyphicon glyphicon-plus"></span> **Add to Firefox** button to install the add-on. Then you will find ![SWAT icon](assets/images/extension.png) icon on toolbar.

#### Using the Add-on

1. Visit any web pages and click ![SWAT icon](assets/images/extension.png) icon. 
2. Select the target folder and change the filename as you wish in **Save As** dialog, and save.
3. An SHTML type file will be saved to the target folder.

### Internet Explorer

#### Requirements

* Internet Explorer 9 or above
* Internet Explorer 32bit
* [.NET Framework 4.0](http://www.microsoft.com/en-US/download/details.aspx?id=17718)

#### Installing the Extension

1. Download the installation package from [here](http://www.smartekworks.com/tools/swat-ie-capture.zip).
2. Extract the zip file to the installation directory on the target computer.
3. Run `cmd.exe` as Administrator to open an DOS prompt.
4. In the DOS prompt, go to the installation directory and run `install.bat`.

In some cases, an error message: *Could not load file or assembly or one of its dependencies. Operation is not supported. (Exception from HRESULT: 0x80131515)* will be displayed. You need to unblock the DLL file with following steps, then redo the above installation from step 3.

1. Open the installation folder in Windows Explorer.
2. Right click one of the DLL file, and choose Properties from the context menu.
3. Click the Unblock button in the lower right-hand corner of the resulting dialog.
4. Do the same on another DLL file.

#### Using the Extension

1. Run Internet Explorer 32bit as Administrator. Then you will find ![SWAT icon](assets/images/extension.png) icon on toolbar.
2. Visit any web pages and click ![SWAT icon](assets/images/extension.png) icon. 
3. Select the target folder and change the filename as you wish in **Save As** dialog, and save.
4. An SHTML type file will be saved to the target folder.

Jenkins Integration
---

You can integrate SWAT service with Jenkins to implement a CI with acceptance test. With the integration you can

* Run your cases in SWAT in a Jenkins build.
* View the test progress in Jenkins
* View the test result report in Jenkins

#### Installing Jenkins Plugin

1. Copy the [swat-execute-plugin.hpi](http://www.smartekworks.com/tools/swat-execute-plugin.hpi) to `plugins` directory under Jenkins installation directory.
2. Restart the Jenkins and login.
3. Visit **Configure System** page through *Manage Jenkins > Configure System*, you will find **SWAT Execution** section added.
4. Fill in the following parameters and save.
 * **Server URL**: The serverUrl of your SWAT account. You can get this information from **Account Settings** page.
 * **Api key**: The apiKey of your SWAT account. You can get this information from **Account Settings** page.
 * **Secret key**: The secretKey of your SWAT account. You can get this information from **Account Settings** page.
 * **Progress query interval**: Seconds between each progress query. The default value is `30`.

#### Configuring Jenkins Build

1. Create a project (free-style software project) for executing SWAT cases in Jenkins.
2. In the **Build** section, add build step **SWAT Execution** and fill in the **Request Information** with SWAT execution request string.
3. In the **Post-build Actions** section, add post-build action **Publish JUnit test result report** and fill in **Test report XMLs** with `swat_result.xml`.
4. Save the project.

#### Obtaining Execution Request String

1. Visit **Scenarios** page in the target test set in SWAT service.
2. Select the target cases and click **Execute** button.
3. Modify the options if needed just as creating a new execution.
4. Instead of clicking **OK** button, choose **Jenkins Request** or **Jenkins Request (Total Set)** from the pull-up list next to the **OK** button.
5. The **Request Information** dialog will show up with the request string you needed for configuring Jenkins.

JIRA Integration
---

SWAT can use JIRA to replace the internal issue management system. With the integration you can

* Create a issue in JIRA project from SWAT.
* Find the issues related to a certain test result.
* Switch between SWAT page and your JIRA project page seamlessly.

Note: You should ensure that SWAT service can access JIRA service when using the integration. For this reason, usually you can use JIRA OnDemond or JIRA package in SWAT package, while you can only use JIRA OnDemond in SWAT cloud service.

#### Configuring JIRA

* You need at least one JIRA Project.
* Issue types with the following name used by SWAT should be added to the project.
 * `bug`, `duplicate`, `enhancement`, `question`, `others`

#### Configuring SWAT

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Input the configuration string with your JIRA account information such as the one below to the **Extensions** field. 
```json
{
	"jira":{
		"url":"https://xxxx.atlassian.net", 
		"username":"Demo", 
		"password":"Demo", 
		"project":"demo"
	}
}
```

#### Configuration String

The configuration string is a JSON map with following rules:

* Use the key `"jira"`, and the configuration map with following keys as value.
 * `"url"`: The URL of JIRA service.
 * `"username"`: The username of JIRA account.
 * `"password"`: The password of JIRA account.
 * `"project"`: The project name for SWAT. The key is not required, SWAT will use the project code of SWAT for the project name in JIRA if you do not set the key. You should ensure that the target project in JIRA exists in both cases.
 
Agent API Integration
---

During a scenario you can call a web service to execute an extended operation such as DB access and file manipulation. You need build an agent server with your extended operation conforming to the [Agent API specification](ref_agent_api.md) specification. Please refer to [DB Access and File Manipulation](article_api_call.md) for details.

Though you can input the URL of the API directly in **API Call** system operation, you can setup an integration in SWAT, so that you can select the defined API in **API Call** system operation. 

#### Configuring SWAT

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Input the configuration string with your API information such as the one below to the **Extensions** field.
```json
{
	"agent_api":{
		"Obtain server log":"http://xxx.xxx.xxx.xxx:xxx/log/webserver",
		"Obtain db diff":"http://xxx.xxx.xxx.xxx:xxx/db/diff",
		"Initialize db":"http://xxx.xxx.xxx.xxx:xxx/db/initialize"
	}
}
```

#### Configuration String

The configuration string is a JSON map with following rules:

* Use the key `"agent_api"` and an API map.
* The key of the API map is the name and the value is the URL.
* The configuration string can also contain the key `"jira"` if you are using JIRA integration.
