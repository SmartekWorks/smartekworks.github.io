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

The page preview is very useful in knowledge management and scenario building. However, the preview is usually without CSS because we only import the HTML source without any resource file (except that the HTML uses full URL for the resources). You can configure it to use the remote resources.

Note: If you are using `https` to access SWAT service, you cannot access the resources with `http`. You can upload the needed resources to SWAT on **Site Management** page and configure them as the remote resources. 

#### Analysing the Resource URL

Use build-in development tools of the browser or extensions such as *Firebugs* to inspect the HTML source in the preview frame. You will find the following types of URL:

* `http://www.bing.com/...`: This type of URL works in our preview, so we don't need to do any thing for it.
* `/images/search...`: This type of URL uses SWAT service domain instead of *Bing* in preview, we have to add domain `http://www.bing.com/` for it.

#### Changing Site Settings

1. Visit **Site Management** page through menu *Management > Sites*, and select site `Bing` on the left.
2. Input `http://www.bing.com/` to **Preview URL**, which will add `http://www.bing.com/` to URLs like `/images/search...`.
3. Save the settings, and you will find images displayed in preview of **Page Knowledge**.

#### Handling Relative URL

Sometimes we may find relative URL such as `img/a.png`, `..img/a.css` in HTML. We have to replace the whole URL to a calculated absolute URL in this case.

1. Visit **Site Management** page through menu *Management > Sites*,
2. Click **Edit** button for **Preview Rules**, and an input dialog for replacing rule string will be displayed. 
3. The rule are a JSON list of map. The key is the source text and the value is the destination text. For example:
```json
[
	{"img/":"http://www.sample.com/a/img/"},
	{"../img/":"http://www.sample.com/a/img/"}
]
```
4. Do not forget saving the settings after you close the dialog.

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
* Integrate similar business procedures and execute them by different parameters. For example, **Transfer from current account** and ** Transfer from saving account** could be integrated as one **Fund Transfer** flow and executed distingishedly with different *account type* parameter.

Enjoying Test Automation
---

You are recommended to read articles from Article Section for the know-how from different cases. And you can refer to the Reference Section when you need to know the details of the specification.

Have fun with your testing on SWAT! 

