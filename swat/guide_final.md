Preparing Your Own Project
===

This page tells how to test your own project with SWAT.

Organizing Your Sites
---

Normally only one site is necessary to place all of your HTML pages, but sometimes things are differenct:

* There are more than one physical systems under test.
* There are more than one logical systems hosted on one physical system, e.g., a universal portal to display different pages for users with different roles.

A decent site orgnization will help to manage the page knowledges in order and facilitates the case execution with discriminate settings.

Configuring Page Preview
---

The page preview is very useful in knowledge management and scenario building. The preview needs correct remote URLs to access the correct resource files such as CSS files, because we only import the HTML source without any resource file. Though SWAT will set the URL according to your captureing enviroment if you use HTML files captued by our latest [SWAT Capture Tool](setup_tools.md#SWAT_Capture_Tool), you may want to configure it to use different remote resources.

#### Changing Base URL for Preview

1. Visit **Site Management** page through menu *Management > Sites*, and select site `Bing` on the left.
2. Input `http://www.bing.com/` to **Preview URL**, which will add `http://www.bing.com/` as base URL to relative URLs like `/images/search...` or `..img/a.css`.
3. Save the settings, and you will find images displayed in preview of **Page Knowledge**.

Note: If you are using `https` to access SWAT service, you need to set the browser to accept loading http contents if the resources are from `http`.

Tuning Knowledge Rules
---

As is known, operations are extracted from HTML pages based on the SWAT rule. The built-in default rule can recognize most of the web pages, but sometimes the results might be different from what you expected. Thus we offer the [Knowledge Tuning](guide_tuning.md) function to mitigate such discrepancy.

Hereby we will provide several hints how to fine tune your knowledges:

* If your site is based on some JavaScript GUI framework, such as **jQuery UI**, **Kendo UI**, **ExtJS** and so on, please contact us and we will advise rules to handle those widgets.
* Please lay more emphasis on the common parts across all web pages, such as header, footer, main menu and other global navigations. These parts should be deemed as seperate operations and not mixed with others. If not by default, please tune the rule.
* The default rule leverages the semantics of the HTML tags to combine relative elements into an operation, and it also takes advantage of the visual effect so that the neighbour elements are tended to be made together. However, this principal is not always right, thus please review the operations in the business perspective and tune the rule if necessary.

Designing Business Flows
---

Before diving into the test scenarios and cases, it is better to [design your reusable business flows](article_flow.md). Here're some hints to build proper flows:

* Place the common procedures into flows, such as login, logout, menu navigation and so on.
* Design a flow with business purpose instead of just operation combinations. For example, a **Fund Transfer** flow should have *from account*, *to account* and *amount* as input parameters, so that it could be reused in many scenarios.

Enjoying Test Automation
---

You are recommended to read articles from Article Section for the know-how from different cases. And you can refer to the Reference Section when you need to know the details of the specification.

Have fun with your testing on SWAT! 

