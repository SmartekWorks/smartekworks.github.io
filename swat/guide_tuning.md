Tuning Page Knowledge
===

This page explains how to generate a correct operation model by using a customized knowledge rule and how to edit the pages and operations. 

Note: It is a good practice to do page knowledge tuning in you knowledge base construction, though they are not required.

Tuning Page Parsing
---

SWAT uses knowledge rule to understand the implementation of the page. Though SWAT's default rule can handle common implementations, you usually need to customize the rule to tuning the page parsing if

* There are special JS controlled interactive elements in the web application.
* You uses special implementation policies such as special CSS class to locate the nodes.
* You want to change the default scope, title of operation or nodes.

#### Analysing the Default Parsing

Let's check the default parsing of page `Bing` and `BingSA` first. There is a problem that the `BingSA` do not have operation related to the pull-down list with keyword suggestions. If you examine the HTML from the preview frame you will find the following HTML codes.

```html
<ul class="sa_drw" id="sa_ul">
	<li class="sa_sg" id="sa_0" url="/search?q=test&amp;qs=AS&amp;pq=test&amp;sc=8-4&amp;sp=1&amp;cvid=ae5d962746e843548572eca8e570130f&amp;FORM=QBLH" query="test" nav="sb_form_q;;sa_1;" stype="AS" hc="1" h="ID=autosuggest,5003.1" _ctf="sa_si_T" _ct="sa_0">
		<div class="sa_s"><div class="sa_tm">test</div></div>
	</li>
	...
</ul>
```

It seems that the pull-down list is implemented by a `ul#sa_ul` list with a group of `div.sa_s`. As a there are no interactive tags, SWAT with the default rule does not know it is interactive. Let's tell SWAT this kind of implementation by defining a new knowledge rule.

#### Designing a Rule

The SWAT knowledge rule is a JSON formatted string following [Knowledge Rule DSL](ref_knowledge_rule.md). We need to know the following basic components of the rule.

* `singleNodes`: The definition of single interactive DOM nodes such as button, input.
* `collectionNodes`: The definition of collection of DOM nodes such as list, table, select.
* `operations`: The definition of how to extract the collectionNode to be an operation.

You can view the default rule in following steps:

1. Visit **Knowledge Tuning** page through menu *Knowledge > Tuning*.
2. Choose site `Bing` and page `BingSA`. Click **Default** on **Reset** pull-down button to reset the rule to default rule.
3. The default rule will be displayed.

To make the suggestion list as an operation, we need to

* define a clickable node for `div.sa_s` like `link` does. you will need to append the following entry to `singleNodes`.
```json
"sa_link":{"selectors":["div.sa_s"], "decisive":true, "action":"click", "label":"link", "locator":"link"}, 
```
* define a collection node for `ul#sa_ul` with `sa_link` as its children like `buttonGroup` does. you will need to append the following entry to `collectionNodes`.
```json
"sa_list":{"selectors":["ul#sa_ul"], "children":["sa_link"], "action":"or"},
```
* define an operation for `sa_list`. you will need to append the following entry to `operations`.
```json
{"selectors": ["ul#sa_ul"], "collectionNode":"sa_list", "nesting":"outer"},
```

Hint: Please refer to [Knowledge Rule DSL](ref_knowledge_rule.md) for the detailed reference.

#### Creating a Rule

1. Following the steps above, modified the rule according to the above design. 
2. Click **Preview** button you will see the parsing result of the new rule in **Preview** tab.
3. You will find a new operation named `sa_ul` with a list of clickable items.
4. Switch back to **Rule** tab, click **Save As** button and save the rule with the title `01`.

Note: There are more than one definitions for the same implementation and many considerations to make an efficient rule. We will discuss the best practice to make a good rule in our **Article** section later.

#### Applying the Rule

1. Visit **Site Management** page through menu *Management > Sites*, and select site `Bing` on the left.
2. You can change the **Default Rule** to `01` so that all your import for this site will use this rule by default.
3. Click **Edit Rules** button, and the **Rule Management** page will be displayed.
4. Select rule `01` and you can see the rule you have just saved.
5. Click <span class="caret"></span> next to the **Save** button and select **Apply to Pages** in the pull-down menu. 
6. Check all the pages and apply in the dialog. **Page Knowledge Updater** page will be displayed and SWAT will start parsing the pages.
7. After a while, you will get a parsed page list on the left. `Bing` is with <span class="label label-default">unmodified</span>, because it doesn't contains the suggest list. `BingSA` is with <span class="label label-danger">modified</span>, and you can see the added operation in green.

Editing Pages and Operations
---

Knowledge rule can help you a lot when you have a lot of pages with the similar implementation, which is common for pages in the same web application. Sometimes you still need to change some properties such as title in individual knowledge components. You can do the modification on **Page Knowledge** page.

1. Visit **Page Knowledge** page through menu `Knowledge > Pages`.
2. Select the `hp_table` under `Bing` and you can change the title to `Links`. After saving, you will find the title changed in the left tree.
3. You may also notice that the title of `hp_table` under `BingSA` has also been changed to `Links`. It is because SWAT think that they are the same operation on different pages. You can remove the relation by selecting **Related Operations** in the pull-down of **Save** button.
4. You can also change the title of `sb_form` to `Search` and `sa_ul` to `Suggestion List`. (SWAT don't think the `Search` are the same in two pages this time.)
5. Select the `Search` under `BingSA`. Click <span class="caret"></span> next to the **Save** button and select **Customize Operation** in the pull-down menu. **Operation Customization** page will be displayed.
6. You can find a hidden node named `sa_ghostbox`. We uncheck the node to disable it since we don't need it in execution. You can also change the nodes' title, order here, though we do not need to do so now. 

Next Steps
----

You can try to import your own project and make it automatically tested on SWAT! 

Go to [Preparing your own project](guide_final.md).