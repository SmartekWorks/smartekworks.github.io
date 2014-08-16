Working with Flow
===

In order to make the scenario more reusable and make the maintenance easier, it is a good practice to capusulate part of the scenarios as flow.

About Flow Knowledge
---

To put it simple, flow is just a scenario which can be used as an block like a page operation in scenario. In this way, you can reuse this common scenario in different scenarios, which will make scenario building easier.

However, the meaning of flow is much deeper than it looks like.

With flow, you can build you scenario without knowing the interaction of your web application. For example, you can build a scenario with following flow:

1. Login to your internet banking site.
2. Check the balance of your account.
3. Transfer $200 to one of your friend.
4. Check the balance of your account after transfer.

As flows defined a seris of interactions to achieve a certain purpose, you just need to know the business rules without knowing how to interact with your internet banking. The benifits are:

* You can write a scenario with much less steps, as well as efforts. 
* You don't need to change your scenarios when the interaction changed within the flow as long as the business rules are the same.
* You can write the scenarios before the there is any page knowledge from mockup or your test site. 
* Business analyst can also write some scenarios.

Creating Flow
---


Using Flow in Scenario
---


Next Steps
----

Now we've learned about how to use flow to make the scenario building more efficient. You should know how to update your scenarios when you web application has been updated, you will also find flow can make the maintenance easier.

Go to [Automated Test Maintenance](guide_maintenance.md).