Importing Pages
===

This page explains how to generate the web operation models from your web application page.

Installing SWAT Capture tool
---

**SWAT Capture Tool** is a browser extension to capture the HTMLs from your web application which is used in SWAT page knowledge import. SWAT also support HTMLs you save by using *Save As HTML* function of your browser. However, as **SWAT Capture Tool** can handle frame structure in web application and capture realtime rendered HTML, you should use it if the web application is in the above cases.

**SWAT Capture Tool** is currently offered on Google Chrome, Mozilla Firefox and Internet Explorer. we will use Chrome in this guide. Please refer to [Setup Tools and Integrations](setup_tools.md#SWAT_Capture_Tool) for details of the setup. 

To install and use the extension in Chrome is simple. Just follow the steps below

1. Start Chrome browser and visit the [SWAT Capture Tool page](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie) in Chrome Web Store.
2. Click <span class="glyphicon glyphicon-plus"></span> **Free** button to install the extension. Then you will find ![SWAT icon](/swat/assets/images/extension.png) icon on toolbar.
3. Visit any web pages and click ![SWAT icon](/swat/assets/images/extension.png) icon. 
4. An SHTML type file will be saved to your default download directory automatically.

Preparing HTMLs for import
---

In the *Bing Search Assistant* sample scenario, you need two HTMLs, one the search page and the search page with search assistant.

1. Visit http://www.bing.com in your browser with **SWAT Capture Tool**.
2. Click ![SWAT icon](/swat/assets/images/extension.png) icon after the search page is loaded. A file named `Bing.shtml` will be saved.
3. Input any keyword in the search box and wait until search assistant, the pull-down list with keyword suggestions is displayed.
4. Click ![SWAT icon](/swat/assets/images/extension.png) icon again to save the search page with search assistant, and rename the file to `BingSA.shtm

Hint: Actually, `BingSA.shtml` contains all the information in `Bing.shtml`. So it is possible that we use only the latter. We will use two pages in this guide for demonstration.

About SWAT Knowledge Base
---

As SWAT is a knowledge-driven automation, it uses a knowledge base supporting scenario building, maintenance and execution. SWAT knowledge base contains followings components:

* **Site**: The management container for managing pages share the same properties, such as charset. It usually corresponds to a real site or a web application.
* **Page**: The page in your web application. 
* **Rule**: The knowledge rule used for SWAT to understand the implementation of the page.
* **Operation**: The interactive operation on the page, such as *Login*, *Search*. It contains information of a interactive node set.
* **Node**: The interactive node in the operation, such as text-box, button.
* **Flow**: A web application workflow with a certain business meaning. It contains several steps of operations. We will explain it in [Working with Flows](article_flow.md).

Hint: Though construct a good knowledge base at the beginning is with some efforts, the work will make the following steps such as scenario building much more efficient.

Creating a Site
---

We first need to add a new site for *Bing* in SWAT knowledge base.

1. Visit **site management** page through menu *Management > Sites*.
2. Click <span class="glyphicon glyphicon-plus"></span> button to add a new site.
3. Use `Bing` as the **Title** and set the **HTML Charset** to `UTF-8`.
4. Leave other configuration with the default values and create the site.

Note: SWAT has a limitation on the maximum site in your subscription. Please contact your administrator (or [us](mailto:sales@smartekworks.com) in case of trial) if no more site can be created.

Importing Pages
---

1. Visit **Page Knowledge** page through menu `Knowledge > Pages`.
2. Select the site `Bing` from the pull-down list of sites under the **Search** text-box. The page knowledge tree of site `Bing` will be displayed.
3. Click <span class="glyphicon glyphicon-plus"></span> button and **Page Knowledge Updater** page will be displayed for construction.
4. Make a zip file of `Bing.shtml` and `BingSA.shtml`. (You can also import the file one by one.)
4. Make sure the **Target Site** is `Bing`, and choose the zip file for the **Source File**.
5. **File Name Charset** refers to the encoding of file name in zip file. As we used English file name, we don't need to change this option.
6. You can also select a customized **Parsing Rule** for import. We use the default one now since we do not have any customized one. 
7. Click **Start** button, and then SWAT will start parsing the HTMLs. The progress will be displayed on the left.
8. After the parse is completed, `Bing` and `BingSA` with <span class="label label-success">Added</span> will be displayed.
9. Click **Back** button, and you can now find the two new pages in the page knowledge tree. 
9. Select page `Bing`, and you will find two operations under it. 
10. If you select the operation, you will find the nodes in the operation be highlighted. (one operation is for the menu and the other is for the search.)

Editing Pages and Operations
---

Sometimes you need to change some properties such as title in individual knowledge components. You can do the modification on **Page Knowledge** page.

1. Visit **Page Knowledge** page through menu `Knowledge > Pages`.
2. Select the `hp_table` under `Bing` and you can change the title to `Links`. After saving, you will find the title changed in the left tree.
3. You can also change the title of `sb_form` to `Search` and `sa_ul` to `Suggestion List`. 

Next Steps
----

Now, you have your pages imported to SWAT's knowledge base. Next, you will learn how to use the web operation to build a scenario.

Go to [Building Scenarios](guide_scenarios.md).