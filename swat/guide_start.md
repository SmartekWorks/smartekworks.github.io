Getting Started with SWAT
===

This page provides information you need to know before starting this guide.

About this Guide
---

In the [Introduction](index.md) you got a taste of what SWAT is and how it works. In this guide we are going to take you through the fundamentals of using SWAT to make your test automated.

We will teach you following steps on how to use SWAT:

* Construct the page knowledge base of you web application.
* Build scenarios with page knowledge.
* Run test cases on different platforms.

We will try to cover SWAT functions as much as possible in this guide. However, to keep the guide simple, we will offer links to the detailed instructions, specifications and articles if we can. Finally, you are also encouraged to explore SWAT through SWAT's intuitive web based UI.

About the Sample Scenario
---

We will use a simple scenario on *Bing Search Assistant* in this guide to demonstrate how to use SWAT in most common cases. Below is the scenario:

1. Visit *Bing* (http://www.bing.com).
2. Input any keyword in the search box.
3. Wait until search assistant, the pull-down list with keyword suggestions is displayed.
4. Select a keyword from the list.
5. *Bing* returns a search result page with the selected keyword.

There are some more you need to know when you deal with web application with frame, multi-window, alert and AJAX. Please refer to chapter [Window, Frame](article_window.md) and [Alert, AJAX](article_ajax.md) for the know-how after completing this guide.

Preparing SWAT Service
---

We are offering both SWAT cloud service and SWAT package.

If you are using SWAT package, you need to setup SWAT package on your private server first. Please refer to [Setup SWAT Server](setup_swat.md) for the instructions on how to setup SWAT package.

If you are using SWAT cloud service, you need the URL of your SWAT cloud service.

In either case, you need a user account with full permission to complete this guide.

Login to SWAT
---

Visit the URL of SWAT service and login with the user ID and password of your user account, and the **Projects** page will be displayed after login.

The top menu in SWAT service consists following sections.

* **Test**: This is where you work on you test scenarios.
* **Knowledge**: This is where you work on knowledge that you use to build scenarios, such as operations, pages and flows.
* **Management**: This is where you manage the service settings.

Note: Please use the Internet Explorer 10 or above, latest Chrome, latest Firefox and latest Safari to view SWAT service.

Next Steps
----

Next, you need to construct the page knowledge base with which you can build scenarios without coding.

Go to [Importing Pages](guide_knowledge.md).