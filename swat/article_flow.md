Working with Flow
===

In order to make scenarios easy to reuse and easy to update. it is a good practice to capsulate scenarios as flows.

What is Flow?
---

To put it simple, a flow is just a sub-scenario which can be used as a web operation in scenarios. You can build scenarios easily by reusing this kind of sub-scenarios. And, you don't need to change your scenarios when the interaction changed within the flow.

However, the meaning of flow goes further than than a common sub-scenario.

With flow, you can build scenarios without knowing the interaction of the web application. For example, you can build a scenario based on business rules with flows.

1. Login to internet banking site.
2. Check the balance of the account.
3. Transfer $200 to someone.
4. Check the balance (-$200) of the account. 

You do not need to know how to interact with the internet banking site because flows defined a series of interactions to achieve a certain business purpose. 

Hint: It is a best practice that you make flows with business meaning.

Why Using Flow?
---

Let's summarise the benefits by using flows.

* Scenario is simpler and easier to understand.
* Scenario building is more efficient.
* Test maintenance is easier.
* Building scenarios before page knowledge is available.

Creating Flow
---

To create a flow is just like creating a scenario except that you cannot use flow in flow.

1. Visit **Flow Knowledge** page through menu *Knowledge > Flows*. (**Flow Builder** page will be displayed, if there is no existing flow.)
2. Click <span class="glyphicon glyphicon-plus"></span> button to add a new flow. **Flow Builder** page will be displayed.
3. Drag & drop system operations and web operations. Input parameters of each operations.
4. Usually you need to use variables in a flow just like in a scenario, and they will become the parameters of the flow. You can set the values for them when using this flow in a scenario.
5. Fill in the flow title above the flow and Click **Create** button to complete building a flow.
6. On **Flow Knowledge** page you can find flow information including flow parameters and step parameters.

How to Use Flows?
---

To use a flow in **Test Scenario Builder** is just like using a [Web Operation](ref_web_operation.md#How_to_Use_Web_Operations?). However, there are still several differences between flow and web operation that you need to know:

#### Parameters

The parameters of a flow is from the variables you used in the flow, while those of a web operation are from the page knowledge. As a result, unlike those in web operation, the parameters in flow do not have following features:

* Parameter of types other than `Text`.
* Parameter input mode to switch among different querying mode.
* Alert options to handling alert dialog.

As you will often use flow's parameters as the scenario's parameters, when you drag & drop a flow, the parameters will be filled with variables using the parameter's name automatically.

#### Errors and evidences

As flow is just a container, it has no errors and evidences.

#### Ignoring Flow

Like the policy in ignoring operation by ignoring all parameters, you can ignore the entire flow when you uncheck the **Using Data Option** of all the variables related to the flow in case data dialog. (You can also do so by using case export/import function.) 
