Importing Pages
===

This page explains how to generate the web operation models from you web application page.

Installing SWAT Capture tool
---

**SWAT Capture Tool** is a browser extension to capture the HTMLs from you web application which is used in SWAT page knowledge import. SWAT also support HTMLs you save by using *Save As HTML* function of your browser. However, as **SWAT Capture Tool** can handle frame structure in web application and capture realtime rendered HTML, you should use it if the web application is in the above cases.

**SWAT Capture Tool** is currently offered on Google Chrome and Internet Explorer. we will use Chrome in this guide. Please refer to [Setup Tools and Integrations](setup_tools.md#SWAT_Capture_Tool) for details of the setup. 

To install and use the extension in Chrome is simple. Just follow the steps below

1. Start Chrome browser and visit the [SWAT Capture Tool page](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie) in Chrome Web Store.
2. Click <span class="glyphicon glyphicon-plus"></span> **Free** button to install the extension. Then you will find ![SWAT icon](assets/images/extension.png) icon on toolbar.
3. Visit any web pages and click ![SWAT icon](assets/images/extension.png) icon. 
4. An SHTML type file will be saved to your default download directory automatically.

Preparing HTMLs for import
---

In the *Bing Search Assistant* sample scenario, you need two HTMLs, one the search page and the search page with search assistant.

1. Visit http://www.bing.com in your browser with **SWAT Capture Tool**.
2. Click ![SWAT icon](assets/images/extension.png) icon after the search page is loaded. A file named `Bing.shtml` will be saved.
3. Input any keyword in the search box and wait until search assistant, the pull-down list with keyword suggestions is displayed.
4. Click ![SWAT icon](assets/images/extension.png) icon again to save the search page with search assistant, and rename the file to `BingSA.shtm

Hint: Actually, `BingSA.shtml` contains all the information in `Bing.shtml`. So it is possible that we use only the latter. We will use two pages in this guide for demonstration.

About SWAT Knowledge Base
---

As SWAT is a knowledge-driven automation, it uses a knowledge base supporting scenario building, maintenance and execution. SWAT knowledge base contains followings components:

* **Site**: The management container for managing pages share the same properties, such as charset. It usually correspond to a real site or a web application.
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

Configuring preview
---

The operation preview is very useful in knowledge management and scenario building. However, the preview is usually without CSS because we only import the HTML source without any resource file (except that the HTML uses full URL for the resources). You can configure it to use the remote resources.

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

Next Steps
----

Now, you have your pages imported to SWAT's knowledge base. Before building scenarios with it, you still need to make some adjustment.

Next, let's start learning how to create a customized knowledge rule and how to edit the pages and operations.

Go to [Tuning Page Knowledge](guide_tuning.md).