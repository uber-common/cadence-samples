This sample workflow demos how to use consistent query API to get the current state of running workflow.

query_workflow.go shows how to setup a custom workflow query handler
query_workflow_test.go shows how to unit-test query functionality

Steps to run this sample:
1) You need a cadence service running. See details in cmd/samples/README.md
2) Run the following command to start worker
```
./bin/query -m worker
```
3) Run the following command to trigger a workflow execution. You should see workflowID and runID print out on screen.
```
./bin/query -m trigger
```

It will start a workflow and then using signal+consistent query to operate the workflow. 
