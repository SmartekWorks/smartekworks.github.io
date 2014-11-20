Handling Window and Frame
===

This page provides information how to test systems with multiple windows or frame / iframes.

Handling Multiple Windows
---

It is common that multiple windows exist for one web site, for instance, a brand new window to show detail information after you clicks a hyperlink, a mini popup window to provide help messages, or a modal dialog in the old-fashioned IE browser which is also a window indeed. Human being can easily tell the differences across mulitple windows and know which one to proceed, but it's a bit tricky in the world of test automation. We suggest the following guidelines to test such web site.

#### How to Import Knowledge

Each window should be regarded as a separate [Page](guide_knowledge.md#About_SWAT_Knowledge_Base), and saved as `SHTM` type file with [SWAT Capture Tool](setup_tools.md#SWAT_Capture_Tool).

Please import the `SHTM` files for all the windows into SWAT knowledge base.

Hint: The browser toolbar might be disabled in some popup window, you can try right click on this window and click the capture button.

#### How to Locate Window

Normally in **Test Scenario Builder**, we don't need to consider windows. For example, we can drag *Operation A* from **Window Page A** into the builder, and then *Operation B* from **Window  Page B**. During execution, SWAT will try to recognize the current operation from all the open windows, and automatically switch to that window and execute the operation.

However, if the open windows are similar and perhaps have some operations in common, then additional information will be required to locate the window. 

* We can leverage the [Window Control](ref_sys_operation.md#Operation_-_Window_Control) system operation to manually switch to that window.
* [Page Identification](ref_mq_rule.md#Finding_Window_in_Scenario) can also be defined to locate window page during execution.

Hint: Please be noted that the HTML source and screenshot are saved only for the current window. [Assertion](ref_sys_operation.md#Operation_-_Assertion), [Set Value](ref_sys_operation.md#Operation_-_Set_Value) and [Additional Information](ref_sys_operation.md#Operation_-_Additional_Information) system operations are available for the current window as well.

Handling Frames and iFrames
---

Compared to multi-window system, HTML pages with `frame` or `iframe` are much more complicated because actually there's a physical HTML inside each frame and these frames are always nested each other. We suggest the following guidelines to test such web site.

#### How to Import Knowledge

Please use [SWAT Capture Tool](setup_tools.md#SWAT_Capture_Tool) to save the web page as `SHTM` type file. All these physical HTMLs for each frame / iframe are consolidated into this single `SHTM` file, and treated as one logical page in SWAT knowledge base.

Hint: If the frame source is from different domain, it can not be captured due to cross domain security limitation.

#### How to Locate Frame

When the `SHTM` file are imported into SWAT knowledge base, the frame hierachy are also stored. SWAT will take advantage of this hierachy information during execution, and automatically locate the    frame which the operation belongs to. Beforehand, you need to configurate the `frameSearchDepth` pamameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution).

If the frame nesting depth is less than `3`, please set the parameter as follows:

```json
{"frameSearchDepth": 3}
``` 

If there's no frame in this site, please disable frame search to expedite the execution as follows:

```json
{"frameSearchDepth": 0}
``` 

#### How to Take Frame Screenshot

SWAT takes screenshot evidence for the whole page by default, but sometimes part of one frame will be overlapped by the others if this frame is scrollable. We provide the capability to take screenshot for designated frames, based on the `name` or `id` attributes of the frame / iframe.

Here's the sample for `scrollableFrames` parameter in the [Site Execution Settings](guide_execution.md#Settings_of_execution): 

```json
{"scrollableFrames": ["name":"frame1", "id":"frame2"]}
``` 
