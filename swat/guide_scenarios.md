#### Scenario Management

We use following containers to manage scenarios for different management process.

* **Project**: The top management container for grouping a number of test sets.
* **Test Set**: The main management container for manage scenarios, executions and issues. You can set some default settings on test set, and you can also export/import test cases on test set level.
* **Scenario Group**: The smallest management container for grouping a number of scenarios. You can use tags on scenario group to filter the scenarios within test set. You can also use some special tags such as `before`, `after` to implement groups of scenarios with special attribute.
