Handling Alert and AJAX
===

JavaScript plays an important role in the modern web sites, and its behaviours such as Alert and AJAX should be well considered during test execution.

Handling Alert
---

JavaScript has three kinds of [Popup Boxes](http://www.w3schools.com/js/js_popup.asp): Alert box, Confirm box, and Prompt box. When one of these boxes pops up, the browser will be halted until the box is confirmed or cancelled. If no action is taken, the execution will be interrupted unexpectedly. We suggest the following guidelines to handle alert.

#### Define Alert in Knowledge

1. Visit **Page Knowledge** page through menu `Knowledge > Pages`.
2. Select the page and operation where alert exists, and then click <span class="caret"></span> next to the **Save** button and select **Customize Operation** in the pull-down menu. **Operation Customization** page will be displayed.
3. Click the element which will trigger the alert, and then select the alert timeout in the drop-down box. This timeout defines the interval from when the element is triggered until the alert pops up.

Hint: For web elements such as `select`, `checkbox`, `radio` and `button group`, the alert timeout should be set at the parent level instead of the child level.

#### Configure Alert in Scenario Builder

1. In **Test Scenario Builder**, click the operation with alert.
2. There're three actions to handle alert:
 * **Accept**: This will click the `OK` button on the pop boxes.
 * **Dismiss**: This will click the `Cancel` button on the pop boxes.
 * **No Alert**: Ignore any alert handling.

If alert is defined but actually not pops up during execution, SWAT will throws a timeout exception which will stops the execution. To adapt to different situations, we provide one site level `ignoreAlertTimeout` parameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution) to define the default behaviour. 

Here's the sample to ignore any timeout exception because of the lack of alert:

```json
{"ignoreAlertTimeout": true}
```

Handling AJAX
---

More and more sites adopt AJAX technique to improve the uesr interaction. This trend introduces much difficulty into the test automation practice, because HTML DOM varies which will break the web element locator mechanism, although the web page seems to be not reloaded. We suggest the following guidelines to handle AJAX web sites.

#### Import Logical Page

In AJAX web sites, normally only part of the pages will refresh through AJAX calls. We recommend using [SWAT Capture Tool](setup_tools.md#SWAT_Capture_Tool) to convert the HTML into `SHTM` file, in the business logical perspective.

#### Enable AJAX in Execution

We provide one site level `enableAjaxWait` parameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution) to faciliate the AJAX execution. 

Here's the sample to wait until all AJAX calls are completed before continuing to the next operation:

```json
{"enableAjaxWait": true}
```

Hint: In cases when `enableAjaxWait` does not work properly, especially in the old version IE explorer, you can drag an [Wait in Browser](ref_sys_operation.md#Operation_-_Wait_in_Browser_) system operation right afterwards to explicitly complete the AJAX calls.
