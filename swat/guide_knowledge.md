Preparing Page Knowledge
===

This page explains how to get the interactive operation models, the basic blocks of your scenario from you web application page.

Installing HTML capturing tool
---

SWAT HTML capturing tool is a browser extension to capture the HTML from you web application page which can be later imported to SWAT. We currently provide the extension for Chrome and Internet Explorer.

Note: SWAT also accepts HTML file you saved by using Save As HTML function from your browser. However you need the plugin if the web application is frame based or you want to capture the realtime rendered HTML.

#### Chrome

1. Start Chrome browser and visit the [extension page](https://chrome.google.com/webstore/detail/lblhhpmbencpjckcgehlfndpibomonie) in Chrome Web Store.
2. Install the extension, and then you will see the ![SWAT icon](asserts/images/extension.png) on the toolbar.
3. Visit any web pages and click the extension icon. An SHTML file will be saved automatically in your default download directory.

Note: The file format SHTML is just a container of HTML.

#### Internet Explorer

The installation and use of extension for Internet Explorer is a little tricky. Please refer to [SWAT Tools Setup](setup_tools.md) for the details.

Preparing HTMLs for import
---

In our guide we will build an automated test for searching function in *[Bing](http://www.bing.com)* based on the following story.

```
When a keyword was inputed in search box in www.bing.com.
Then a pull-down list of suggested keywords will appear.
When click an entry in the pull-down list.
Then a search result page with the keyword of the selected entry will be returned.
```

In order to build the above scenario, we need the knowledge of search page of *Bing*.

1. Visit `http://www.bing.com` and click the extension icon. A file named `Bing.shtml` will be saved automatically.
2. As the above page does not contain information about pull-down list of suggested keywords, we need to grab another search page after the pull-down list is shown. Type `test` in the search box and capture the SHTML when the the pull-down list is shown.
3. Rename the SHTML file to `Bing_with_suggestion.shtml`. SWAT will use the file name as the default page name in its knowledge base.
4. Make a zip file containing `Bing.shtml` and `Bing_with_suggestion.shtml`. (This step is optional.)

Hint: As the `Bing_with_suggestion.shtml` contains all the information we need in `Bing.shtml`, we can actually just use `Bing_with_suggestion.shtml` alone for the above scenario. We uses two HTMLs in this guide for demonstrating multiple pages.

About SWAT Knowledge Base
---

As SWAT is a knowledge-driven automation, it contains a knowledge base supporting scenario building, maintenance and execution. The knowledge base contains the followings components:

* **Site**: The management container for manage pages with common properties (such as encoding etc.) and rules for them. It usually corresponds to a real site or a web application.
* **Page**: The page in your web application. 
* **Operation**: The interactive operation on the page, such as *Login*, *Search the site*. It contains information of a set of interactive element and how to interact with them.
* **Node**: The interactive element on the page such as text box, button.
* **Rule**: The rules used for SWAT to understand operations/nodes on the page.
* **Flow**: A web application work flow with a certain business meaning. It contains serveral steps of operations. We will cover this part on [Working with Flows](guide_flows.md).

Hint: Though construct a good knowledge base at the beginning may be with a little effort, the work will make the following scenario building much more efficient. And, you usually just need to do the work once.

Creating a Site
---

We first need to add a new site for *Bing* in SWAT knowledge base.

1. Visit **site management** page with top menu `Management > Sites`.
2. Click <span class="glyphicon glyphicon-plus"></span> button to add a new site.
3. Use Bing as the site title and set the HTML Charset to UTF-8 (It is needed before page import).
4. Leave other configuration default since we will change the configure later when we needed.
5. Click **Create** button to create the site.

Attention: SWAT has the limitation on the maximum site according to the subscription. Please contact your administrator (or [us](mailto:sales@smartekworks.com) in case of trial) if you cannot add a new site.

Importing Pages
---

1. Visit **Page Knowledge** page with top menu `Knowledge > Pages`.
2. There is a pull-down list of sites under the **Search** text box. Select the site `Bing` that you have just created to switch to the `Bing` site.
3. Click <span class="glyphicon glyphicon-plus"></span> button to add new pages.
4. Make sure the **Target Site** is `Bing`, and choose the zip file we have created for the source file. You can also choose SHTML, HTML file for import.
5. **File Name Charset** is used for file name in zip file. As we used English file name, we don't need to change the option.
6. You can select a **Parsing Rule** the parsing during this import. We will use the default one this time. 
7. Click **Start** button, and then SWAT will start parsing your page. You will get a parsed page list with <span class="label label-success">Added</span> on the left.
8. Click **Back** button, you can find the two pages under the `Bing` Site. 
9. Click the `Bing_with_suggestion` page, and you will find two operations under it. You can see the preview of the page the right.
10. If you select the operation, you will find the element in the operation be highlighted. In this way, you will know that one operation is for the menu and the other is for the search.

#### Configuring the preview

You can access the operation preview in knowledge management and scenario building, and you will find the preview very useful. However as we only captured HTML source without any resource file, usually you can not view the preview elegantly except that the HTML uses full URL for the resources. It is a good practice for you to configure the preview for the site after you first import.

Firstly, we need a brief check on the HTML source of `Bing` to decide how to configure. So, we use build-in development tools of the browser or extensions like **Firebugs** to inspect the HTML source in the preview frame. You will find the following style of resources.

* `http://www.bing.com/...`: This kind of URL is valid in our preview, so we don't need to do any thing for this.
* `/images/search...`: This kind of URL uses SWAT service domain instead of *Bing* in our preview, we have to add the absolute domain `http://www.bing.com/` for them.
* Fortunately, we don't have relative URL such as `img/a.png`, `..img/a.css` etc. We have to replace the whole URL to a calculated absolute URL in this case.

Secondly, we will need to configure the preview in the settings of `Bing` Site.

1. Visit **site management** page with top menu `Management > Sites`, and select `Bing` Site on the left.
2. Input `http://www.bing.com/` to **Preview URL**, which will added `http://www.bing.com/` to URLs like `/images/search...`.
3. Though there is no relative URL this time, you should know how to replace the URL. Click **Edit** button after **Preview Rules**. You will see a input dialog for you to write replacing rules. The rule are a JSON list of map. The key is the source text and the value is the destination text. For example:
```json
[
	{"img/", "http://www.sample.com/a/img/"},
	{"../img/", "http://www.sample.com/a/img/"}
]
```
4. Click **Save** button, and visit **Page Knowledge**, you will find you can view the preview with images this time.

Tuning Page Paring
---

If you examine the `search` operation under `Bing_with_suggestion` carefully, you will find that the suggestion list is not included in this operation. It is because that the suggestion list is implemented with non-intractive tag and javascript. SWAT with default rule didn't know such kind of HTML implementation when parsing the page. Let's tell SWAT this kind of implementation by defining a new rule.

#### Creating a Rule

1. Visit **Knowledge Tuning** page with top menu `Knowledge > Tuning`.
2. Choose `Bing` Site and `Bing_with_suggestion` Page. Click **Default** on **Reset** pull-down button to reset the rule to default rule that we used for last import.
3. You will see a JSON formatted rule text in the rule text area. Click **Preview** button you will see the current parsing result.
4. Switch back to **Rule** tab. Before modifying the rule, we need to know the implementation of suggestion list by ourself. You will find the following HTML source from preview of `Bing_with_suggestion` by using inspection tools.
```
<ul class="sa_drw" id="sa_ul">
	<li class="sa_sg" id="sa_0" url="/search?q=test&amp;qs=AS&amp;pq=test&amp;sc=8-4&amp;sp=1&amp;cvid=ae5d962746e843548572eca8e570130f&amp;FORM=QBLH" query="test" nav="sb_form_q;;sa_1;" stype="AS" hc="1" h="ID=autosuggest,5003.1" _ctf="sa_si_T" _ct="sa_0">
		<div class="sa_s"><div class="sa_tm">test</div></div>
...
```
From the source you will know it is a special `ul#sa_ul` list with a group of interactive `li.sa_sg`.
5. We can simply tell swat to handle 'div.sa_s' as a link, so that the list definition in the default rule can do the remaining work. We can also create a new type of operation, without interfering the default ones. We choose the later in this guide, because you can know a little more about the rule in this approach.
6. In the `singleNodes` map of the rule, duplicate `link` entry with key `sa_link` and selector `li.sa_sg`. In this way, we defined a new link like node.
7. In the `collectionNodes` map of the rule, duplicate `buttonGroup` entry with name `sa_list` and selector `ul#sa_ul`. In the `children` list, we should add `sa_link` instead of `button`, `link`. In this way, we define a suggest list as an interactive collection. We don't duplicate the `list` collection node here, because it is complicated for supporting repetition.
8. Finally, we need add a new entry as below at the first place in `operations` list, which means that we will handle our special structure before handling other default rules.
```json
{"selectors": ["ul#sa_ul"], "collectionNode":"sa_list", "nesting":"outer"},
```
The rule tells SWAT to search `ul#sa_ul` for all the `sa_list` and make them operations.
9. Click **Preview** button again, to see the new result. You will find a new operation named `sa_ul` with a list of clickable items.
10. Switch back to **Rule** tab, click **Save As** button and save with the title `01`.

Hint: Please refer to [Knowledge Rule DSL](ref_knowledge_rule.md) for the detailed reference.

#### Applying the Rule

1. Visit **site management** page with top menu `Management > Sites`, and select `Bing` Site on the left.
2. You can change the **Default Rule** to `01` so that all your import for this site will use this rule by default.
3. Click the next **Edit Rules** button, which will bring you to the **Rule Management** page.
4. Select rule `01` and you can see the rule you have just saved.
5. Select **Apply to Pages** in the pull-down menu after **Save** button. Check all the pages and apply.
6. SWAT will start parsing your page. After a while, you will get a parsed page list on the left. `Bing` is with <span class="label label-default">unmodified</span>, because it doesn't contains the suggest list. `Bing_with_suggestion` is with <span class="label label-danger">modified</span>, and you can see the added operation in green.

Customizing Knowledge
---

Knowledge rule can help you a lot when you have a lot of pages with the same implementation style, which is common for pages in the same web application. Sometimes you still need to change the individual knowledge components such as label etc. You can customize the knowledge through SWAT UI.

1. Visit **Page Knowledge** page with top menu `Knowledge > Pages`.
2. Select the `sc_hs1..` under `Bing` and you can change the title to `Links`. After saving, you will find the title will be changed in the left tree.
3. You may also noticed that the title of `sc_hs1..` under `Bing_with_suggestion` has also been changed to `Links`. It is because SWAT assume that they are the same operation on different pages. You can change such kind of relation by selecting **Related Operations** in the pull-down after **Save** button.
4. You can also change the title of `sa_ul` to `Suggestion List`
5. Select the `Search` under `Bing_with_suggestion` and select **Customize Operation** in the pull-down after **Save** button.
6. You will find a node named `sa_ghostbox` hidden on the page. We uncheck the node to disable it since we don't need it in interaction. You can change the nodes' title, order here. 

Next Steps
----

You page knowledge is now ready to use.

Next, let's start learning how to retrieve interactive operation models by importing page HTMLs from your web application to SWAT.

Go to [Building Scenarios](guide_scenarios.md).