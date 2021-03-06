Setup Execution Services
===

SWAT not only helps you to build scenarios more efficiently, but also offers local execution service or supports cloud execution service to run those scenarios on various platforms.

Setup Local Execution Server
---

#### Requirements

|         | Requirements
| ------- | -----------
| CPU     | 2.2 GHz (Single Core) or above
| Memory  | 2048 MB
| OS      | Windows XP or above, Mac OS X 10.6 or above, Ubuntu 10.4 or above (Other linux distribution may also work)
| Browser | Internet Explorer 6 or above, the latest Firefox, the latest Chrome, the latest Safari
| Others  | You must have Java SDK 7 installed on your target desktop/VM. 

#### Installation

1. Visit **Execution Service Monitor** page through menu *Management > Execution Services* in SWAT service.
2. Click <span class="glyphicon glyphicon-download-alt"></span> button and select **Download Install Package**.
3. Confirm the setup information and click "Download", a zip file named `waas-xxx.zip` will be downloaded to your local computer.
4. Extract the zip file to the installation directory on your target computer.
6. Modify the configuration file, `account.ini` under the installation directory according the following section.
7. Execute `startup.bat` (`startup.sh` on Mac or Linux) under the installation directory to start the local execution server.
8. Visit **Execution Service Monitor** page through menu *Management > Execution Services* again, and you can find the entry of your local execution server.
9. Execute `shutdown.bat` (`shutdown.sh` on Mac or Linux) under the installation directory to stop the local execution server.

Note: When you start local execution server on Windows 8, you may find a warning message showing "Could not open/create prefs root node Software\JavaSoft\Prefs at root 0x80000002. Windows RegCreateKeyEx(...) returned error code 5.". You can ignore this message, as it will not influence the execution. You can also remove this message by adding the key `HKEY_LOCAL_MACHINE\Software\JavaSoft\Prefs` to registry.

#### Configuration File

The Configuration file, `account.ini` is a JAVA property file with following keys:

* `waasCode`: **(Optional)** The code of the execution server. You can specify the code when you create execution in order to execute the scenario on a specific execution server. You can only use combination of alphabets and digits under 16 characters. You do not need to set it if you do not want this function.
* `privateMode`: **(Optional)** Use `true` or `false` to decide whether or not to accept execution tasks with unspecified `waasCode`. The default value is `false`. The value will be ignored if you do not set `waasCode` for the execution server.
* `serverUrl`: **(Required)** The serverUrl of your SWAT account. You can get this information from **Account Settings** page.
* `apiKey`: **(Required)** The apiKey of your SWAT account. You can get this information from **Account Settings** page.
* `secretKey`: **(Required)** The secretKey of your SWAT account. You can get this information from **Account Settings** page.
* `swatProxy.enable`: **(Optional)** Use `true` or `false` to decide whether or not to use proxy to connect to SWAT service. The default value is `false`.
* `swatProxy.host`: **(Optional)** The host of the proxy. The value will be ignored if `swatProxy.enable` is `false`.
* `swatProxy.port`: **(Optional)** The port of the proxy. You must use number here. The value will be ignored if `swatProxy.enable` is `false`.
* `swatProxy.username`: **(Optional)** The username of the proxy. The value will be ignored if `swatProxy.enable` is `false`.
* `swatProxy.password`: **(Optional)** The password of the proxy. The value will be ignored if `swatProxy.enable` is `false`.
* `execProxy.enable`: **(Optional)** Use `true` or `false` to decide whether or not to use proxy in the execution browser. As SWAT cannot handle the authentication dialog of browser in execution. You can only use proxy without username and password. The default value is `false`.
* `execProxy.host`: **(Optional)** The host of the proxy. The value will be ignored if `execProxy.enable` is `false`.
* `execProxy.port`: **(Optional)** The port of the proxy. The value will be ignored if `execProxy.enable` is `false`.
* `driverParallelization`: **(Required)** The maximum parallel sessions allowed in the local execution server. As you can only run one IE session on a computer, the value will be ignored in this case.
* `downloadDir`: **(Optional)** The default download directory of your browser. You cannot use **Obtain Download** system operation if you do not set the value. Please add double backslash on Windows, such as `C:\\Downloads`.
* `firefoxProfile`: **(Optional)** The path of Firefox profile which your want to start the testing browser with. This is useful when you want to test on Firefox with special settings or addons. Please add double backslash on Windows, such as `C:\\MyProfile`.

#### Upgrade

As the the only user data in local execution server is the configuration file, you normally do not need to upgrade, but install a new local execution server.

#### Next Steps

To enable execution on various types, versions of OS and Browsers are not a easy task, because there are a lot of settings of you OSes and browsers may influence the execution. We offer several suggestions to made the process easier.

* Check [Configure Local Environment](#Configure_Local_Environment) section frequently, as we will update the information on how to config the local environment.
* Update your local execution server to the latest version, as we will include some of the solution to execution problems in our local execution server.
* Search the internet for information on Selenium Web Driver, which is currently our main execution engine.
* Use cloud execution service, since the provider will handle most of the settings of OSes and browsers.

Setup BrowserStack Service
---

In cloud service, SWAT offers support for [BrowserStack](http://www.browserstack.com), a public cloud execution service. To use the BrowserStack service, you need to obtain a BrowserStack account and purchase an automation plan first. (As the partner of BrowserStack, we also offer optional payment and support agent service.) Then, you should setup your BrowserStack account information on SWAT before you can use the service. 

Hint: The BrowserStack Service has already been configured for you if you are using trial account or you purchase the BrowserStack Subscription with SWAT.

1. Visit **Account Settings** page through menu *Management > Account Settings*.
2. Input the configuration string with your BrowserStack account information such as the one below to the **Cloud Execution** field. 
```json
{
	"browserstack":{
		"enable":true, 
		"username":"Demo", 
		"accesskey":"abcdefgabcdefg", 
		"parallelization":2
	}
}
```

#### Configuration String

The configuration string is a JSON map with following rules:

* Use the key of `"browserstack"`, and the configuration map with following keys as value.
 * `"enable"`: **(Optional)** Use `true` or `false` to decide whether to use the service or not. The default value is `false`.
 * `"username"`: **(Required)** The username of BrowserStack account.
 * `"accesskey"`: **(Required)** The accesskey of BrowserStack account.
 * `"parallelization"`: **(Required)** The maximum parallel sessions allowed of BrowserStack subscription.
 * `"local"`: **(Optional)** Use `true` or `false` to decide whether to use BrowserStack Local Testing or not. The default value is `false`.
 
Note: Please refer to the documentation of BrowserStack for how to get the account information and how to use Local Testing.

Configure Local Environment
---

The following are the configurations for problems that you most likely to meet.

#### Internet Explorer

You should use the following settings to ensure the execution:

* On IE 7 or higher on Windows Vista or Windows 7, you must set the Protected Mode settings for each zone to be the same value. The value can be on or off, as long as it is the same for every zone. To set the Protected Mode settings, choose "Internet Options..." from the Tools menu, and click on the Security tab. For each zone, there will be a check box at the bottom of the tab labeled "Enable Protected Mode".
* Additionally, "Enhanced Protected Mode" must be disabled for IE 10 and higher. This option is found in the Advanced tab of the Internet Options dialog.
* The browser zoom level must be set to 100% so that the native mouse events can be set to the correct coordinates.
* For IE 11 only, you will need to set a registry entry on the target computer so that the driver can maintain a connection to the instance of Internet Explorer it creates. You can find the reg file in `tools` directory of your local execution server or download the reg file [here](http://www.smartekworks.com/tools/ie11-get-window-handles.zip).
* If the website uses basic authentication, you can use the URL in the format like `http://<username>:<password>@yourdomain`. However, IE does not support this type of URL by default. You have to set a registry entry on the target computer. You can find the reg file in `tools` directory of your local execution server or download the reg file [here](http://www.smartekworks.com/tools/ie-enable-basic-auth.zip).
* The Windows update `KB3025390` will break the IE WebDriver when using IE11, please make sure to uninstall this update in Windows Control Panel.

You should also take care of the following points in execution:

* As the InternetExplorerDriver uses so-called "native", or OS-level events to perform mouse and keyboard operations in the browser, you have to stop other tasks when using the IE driver for execution to ensure no to interfere the execution.
* Screenshot cannot be captured normally in execution during the period that you use remote desktop (RDP) to connect execution environment, which is common when you use VM for execution. You also have to disconnect the RDP connect normally before execution.
* InternetExplorerDriver uses current user's settings and data of IE, which means that cookies from one execution will remains in the next execution. You need to set IE to delete the context data when exit in *Internet Options > General* to ensure the execution starts with a clean context. You can find the reg file in `tools` directory of your local execution server or download the reg file [here](http://www.smartekworks.com/tools/ie-enable-basic-auth.zip).

#### OS X Safari

* Due to the limitation of Safari Driver, scenario with alert handling and **Navigation Control** system operation cannot run properly under Safari.
* As the Safari driver cannot automatically install the extension which is needed to start automation under some latest version of Safari, such as Safari 8 on Yosemite, Safari 6.1 and Safari 7.2, you need to install the extenstion manually. You can find the latest extension file in `tools` directory of your local execution server or download the extension file [here](http://www.smartekworks.com/tools/SafariDriver.safariextz.zip). Please click the extracted file to install the extension. After installation, the installation file will be automatically deleted and you can find the extension in Safari extensions.

#### Windows Firewall

If you execute the scenario for the first on Windows with Windows Firewall enabled, there may be a dialog shown to ask whether allow the communication of `IEDriverServer.exe` or `chromedriver.exe`. Please permit the communication. You can also add the permission manually in your windows firewall settings.

#### Windows IME

If scenarios are executed on a non-English Windows, please make sure the default IME is English. Otherwise, non-English keyboard might be activated and wrong characters would be input.

Configure Site Execution Parameters
---

We provide several execution parameters to suite different sites. The parameters are defined as a JSON string with the following rules:

```json
{
	"webdriverTimeout": 60, 
	"commandInterval": 500, 
	"operationInterval": 500, 
	"frameSearchDepth": 3, 
	"scrollableFrames": [{"name":"frame1"}, {"id":"frame2"}], 
	"scrollableElements": [{"selector":"div.main_menu"}, {"id":"shopping_cart"}], 
	"enableAjaxWait":true,
	"ignoreAlertTimeout":true,
	"evidenceLevel": 2, 
	"matchingLevel": 1
}
```

* `webdriverTimeout`: The timeout for any Selenium WebDriver command in seconds. The default value is `60`.
* `commandInterval`: The time interval between two consecutive Selenium commands in milli-seconds. The default value is `500`.
* `operationInterval`: The time interval between two consecutive SWAT operations in milli-seconds. The default value is `500`.
* `frameSearchDepth`: The max search depth for HTML with nested frames. The default value is `3`, and `0` means no support for frame execution.
* `scrollableFrames`: The list of frames to take individual screenshots. Each frame is identified by its `name` or `id`. The default is an empty array.
* `scrollableElements`: The list of HTML DOM nodes to take individual screenshots. Each node is identified by a CSS `selector` or `id`. The default is an empty array.
* `enableAjaxWait`: Whether wait until all AJAX calls are complete, and then proceed to the next operation. The default value is `false`.
* `ignoreAlertTimeout`: Whether ignore the timeout exception if no alert pops up. The default value is `false`.
* `evidenceLevel`: Different behaviours to take evidence for each operation. The default value is `2`.
 * If level is `1`, we will not capture any HTML source nor screenshots, except for the [Assert](ref_sys_operation.md#Operation_-_Assertion) system operation and the operation with errors.
 * If level is `2`, all HTML source and screenshots will be captured.
* `matchingLevel`: Different web element locator policy during execution. The default value is `1`.
 * If level is `1`, we will try to locate each element  with its DOM attributes directly inside the runtime HTML, which is faster in execution speed.
 * If level is `2`, we will parse the runtime HTML, turn it into SWAT knowledge, match it with the exising knowledge base and then locate the element inside.

