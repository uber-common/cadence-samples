# Cadence Samples
These are some samples to demonstrate various capabilities of Cadence client and server.  You can learn more about cadence at:
* Cadence: https://github.com/uber/cadence
* Cadence Client: https://github.com/uber-go/cadence-client

## Prerequisite
0. Install Cadence CLI. See instruction [here](https://cadenceworkflow.io/docs/cli/).
1. Run Cadence Server

    See instructions for running the Cadence Server: https://github.com/uber/cadence/blob/master/README.md
2. Register a domain 

    See instructions for using CLI to register a domain(name as "cadence-samples-domain"): https://cadenceworkflow.io/docs/cli/#quick-start or https://github.com/uber/cadence/blob/master/tools/cli/README.md



## Steps to run samples
Simply start the go binary by running
```bash
go run main.go
```
The worker will listen to `localhost:3000`. Then you may interact with the samples using Cadence CLI.
Here are a list of example CLIs you may use to play with the samples.

### HelloWorld workflow
This workflow takes an input message and greet you as response. Try the following CLI
```bash
cadence --env development \
--domain cadence-samples-domain \
workflow start \
--workflow_type cadence_samples.HelloWorldWorkflow \
--tl cadence-samples-worker \
--et 60 \
--input '{"message":"Uber"}'
```
Try to inspect the log message for the output.