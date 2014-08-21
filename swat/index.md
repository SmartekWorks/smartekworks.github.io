Introduction
===

### SWAT - Smart Web Application Testing

SWAT is a code-less UI testing automation tool for web application, which helps you test web applications by simulating how a real user would interact with your app. SWAT is designed to implement and maintain you test automation more easily. 

With the web mining technology, SWAT understands the interaction of web pages, so that you can implement and maintain the automation without writing/modifying code against the view layer or DOM. SWAT also follows BDD (Behaviour-driven Development) methodology, so that you can write user stories as and executable acceptance criteria.

We offer SWAT cloud service for a more accessible and flexible use and SWAT package that can be run on a private server.

What can I use SWAT for?
---

#### Acceptance test

SWAT supports building you test scenarios on the level of business domain without the need for knowledge of web page implementation. It is easy for the designers without special skills on development to build the test scenario for acceptance test. 

With the automation, you can usually run your acceptance test as a regression test. SWAT also supports integration with Jenkins so that you can build a CI process with acceptance test.

#### Browser compatibility test

SWAT provides local execution server based on Selenium WebDriver supporting various of local OS/browser combinations. It is easy to run cases on different platforms to test whether the rendering or action of javascript of your web application is correct on different combinations.

SWAT cloud service also supports running scenarios on [BrowserStack](http://www.browserstack.com), a public cloud execution service. You can easily test you web application on cloud with 300+ platforms from BrowserStack.

Why SWAT?
---

* Not requiring test engineers to build test scenarios and cases.
* Relieving the pain of test ware maintenance by automatic knowledge analysis. 
* Realising unified management and easy-to-use user experience with management server + web UI architecture.
* Supporting execution on various OS/browser combinations of desktop and mobile devices.
* Providing a more flexible monthly subscription SaaS model with low rate for both cloud service and package.

How does SWAT work?
---

SWAT adopts "Scenario-building & Replay" approach to do the automation of UI testing automation for web application. Instead of capturing your actual operations, modifying generated script and running the script, you just need the following steps in SWAT.

1. Importing HTML captures to SWAT 
SWAT's knowledge engine analyses web pages and extracts all the interactive operation models.
2. Building Scenario
Test designers connect different operation models to build a scenario.
3. Executing Scenario
SWAT's knowledge engine explains and executes the scenarios on the real browser.

Who should use SWAT?
---

The answer may depend on your current development/test process. However, there are several considerations on this question.

The biggest difference between SWAT and other automation tools/frameworks is that SWAT makes it possible for business analyst/designers to do the automated test. Therefore, they can use SWAT to build scenarios and cases.

However, to make an efficient automation, you need practices such as implementing auto verification, customizing the knowledge engine to generate operation models more precisely. knowledge in HTML, CSS, Javascript and development experiences are needed for these practices. Therefore, a good test engineer is recommended to help the SWAT use, especially in the automation deployment phase.

In conclusion, you may assigning a test team with test designers and one test engineer, skipping the test implementation phase, which is normally needed in test automation of waterfall styled development. You may also let the product owner use SWAT to do the test with the help from other developers in an agile team. If you are a developer, you can use SWAT to save much of your precious time writing/modifying test code.

Next Steps
----

#### Obtaining SWAT Trial Account

Visit [SWAT trial application page (Japanese only)](http://www.smartekworks.com/trial.html) or mail [us](mailto:sales@smartekworks.com) to apply for a trial account. 

#### The SWAT User Guide

[Learn SWAT in depth](guide_start.md).