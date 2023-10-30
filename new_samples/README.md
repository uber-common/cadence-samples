# Cadence Samples
These are some samples to demonstrate various capabilities of Cadence client and server.  You can learn more about cadence at:
* The website: https://cadenceworkflow.io
* Cadence's server: https://github.com/uber/cadence
* Cadence's Go client: https://github.com/uber-go/cadence-client

## Prerequisite
0. Install Cadence CLI. See instruction [here](https://cadenceworkflow.io/docs/cli/).
1. Run the Cadence server: https://github.com/uber/cadence/blob/master/README.md
2. Register the `cadence-samples` domain: https://cadenceworkflow.io/docs/cli/#quick-start or https://github.com/uber/cadence/blob/master/tools/cli/README.md

Detailed workflow histories can be viewed on Cadence UI. Go to `localhost:8088` on your browser for more details.

## Steps to run samples
Simply start the go binary by running
```bash
go run main.go
```
Then you may interact with the samples using Cadence CLI. You may start multiple workers by running
this binary. Here are a list of example CLIs you may use to play with the samples.

### HelloWorld workflow
This workflow takes an input message and greet you as response. Try the following CLI
```bash
cadence --env development \
  --domain cadence-samples \
  workflow start \
  --workflow_type cadence_samples.HelloWorldWorkflow \
  --tl cadence-samples-worker \
  --et 60 \
  --input '{"message":"Uber"}'
```
Try to inspect the log message for the output.

### Signal Workflow
This workflow demonstrate a basic signal workflow. It takes your name as input parameter
and greet you based on languages you pick. To start the workflow, try the following CLI.

```bash
cadence --env development \
  --domain cadence-samples \
  workflow start \
  --workflow_type cadence_samples.SignalGreeterMultiLanguageWorkflow \
  --tl cadence-samples-worker \
  --et 6000 \
  --input '{"name":"Uber"}'
```

A workflow ID and run ID will be return in your terminal. Copy the workflow ID and replace
to the CLI below to trigger the signal. Try to change the input language value and inspect what
happens in the log. Also, try to inspect what happened after you interact with the signal multiple times.

```bash
cadence --env development \
  --domain cadence-samples \
  workflow signal \
  --workflow_id <Your workflow ID> \
  --name "language" \
  --input '"english"'
```

To cancel the workflow, try the following CLI.

```bash
cadence --env development \
  --domain cadence-samples \
  workflow signal \
  --workflow_id <Your workflow ID> \
  --name "cancel" \
  --input 'true'
```
The workflow should have a status of fail.

### Dynamic workflow
This dynamic workflow is very similar to the Hello World workflow above, but instead of passing the
function definition to the activity execution step, we can directly pass an activity name registered to the
worker to run the workflow. Here is a sample CLI.

```bash
cadence --env development \
  --domain cadence-samples \
  workflow start \
  --workflow_type cadence_samples.DynamicWorkflow \
  --tl cadence-samples-worker \
  --et 60 \
  --input '{"message":"Uber"}'
```
Try to inspect the log message for the output.

### Parallel pick first workflow
This example runs two activities in parallel and output the first successful response. Change the 
configuration for `WaitForCancellation` in the activity options will change the behavior of canceling
other unfinished activities. Here is a sample CLI

```bash
cadence --env development \
  --domain cadence-samples \
  workflow start \
  --workflow_type cadence_samples.ParallelBranchPickFirstWorkflow \
  --tl cadence-samples-worker \
  --et 60 \
  --input '{}'
```

### Cancellation  workflow

```bash
cadence --env development \
  --domain cadence-samples \
  workflow start \
  --workflow_type cadence_samples.CancellationWorkflow \
  --tl cadence-samples-worker \
  --et 60 \
  --input '{}'
```
