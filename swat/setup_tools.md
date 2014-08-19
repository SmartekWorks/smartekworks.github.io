Setup Swat Tools
===

We offer several tools and integrations with other services to help you use SWAT more efficiently.

Setup SWAT Capture Tool
---

Setup Jenkins Integration
---

You can integrate SWAT service with Jenkins to implement a CI with acceptance test. With the integration you can

* Run your cases in SWAT in a Jenkins build.
* View the test progress in Jenkins
* View the test result report in Jenkins

Attention: The Jenkins plugin will be available in the next update.

#### Installing Jenkins Plugin

1. Copy the `swat-execute-plugin.hpi` to `plugins` directory under Jenkins installation directory.
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
3. Choose **Jenkins Request** or **Jenkins Request (Total Set)** from the pull-up list next to the **OK** button.
4. Copy the request string shown in **Request Information** dialog.

Setup JIRA Integration
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
2. Input the configuration string with your BrowserStack account information such as the one below to the **Extensions** field. 
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

* Use the key of `"jira"`, and the configuration map with following keys as value.
 * `"url"`: The URL of JIRA service.
 * `"username"`: The username of JIRA account.
 * `"password"`: The password of JIRA account.
 * `"project"`: The project name for SWAT. The key is not required, SWAT will use the project code of SWAT for the project name in JIRA if you do not set the key. You should ensure that the target project in JIRA exists in both cases.
 