package main

import (
	"flag"
	"fmt"
	"github.com/pborman/uuid"
	"github.com/uber-common/cadence-samples/cmd/samples/common"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"time"
)

// This needs to be done as part of a bootstrap step when the process starts.
// The workers are supposed to be long running.
func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope: h.WorkerMetricScope,
		Logger:       h.Logger,
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) *workflow.Execution {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "pageflow_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: 10 * time.Second,
	}
	return h.StartWorkflow(workflowOptions, pageWorkflow)
}

func queryState(h *common.SampleHelper, execution *workflow.Execution) *QueryResult {
	var result QueryResult
	err := h.ConsistentQueryWorkflow(&result, execution.ID, execution.RunID, QueryName, true)
	if err != nil {
		panic("failed to query workflow")
	}

	return &result
}

func assertState(expected, actual State) {
	if expected != actual {
		message := fmt.Sprintf("Workflow in wrong state. Expected %v Actual %v", expected, actual)
		panic(message)
	}
}

func main() {
	var mode, sampleCase string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker or trigger.")
	flag.StringVar(&sampleCase, "c", "", "Sample case to run.")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(pageWorkflow)
		h.RegisterActivity(createProposal)
		h.RegisterActivity(submitProposal)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		execution := startWorkflow(&h)
		state := queryState(&h, execution)
		assertState(Initialized, state.State)

		h.SignalWorkflow(execution.ID, SignalName, &signalPayload{Action: Create})
		state = queryState(&h, execution)
		assertState(Received, state.State)
		time.Sleep(time.Second)
		state = queryState(&h, execution)
		assertState(Created, state.State)

		content := "test content"
		h.SignalWorkflow(execution.ID, SignalName, &signalPayload{Action: Save, Content: content})
		state = queryState(&h, execution)
		assertState(Created, state.State)
		if state.Content != content {
			panic(fmt.Sprintf("state content %v is different than expected %v", content, state.Content))
		}

		h.SignalWorkflow(execution.ID, SignalName, &signalPayload{Action: Submit})
		state = queryState(&h, execution)
		assertState(SubmissionReceived, state.State)
		time.Sleep(time.Second)
		state = queryState(&h, execution)
		assertState(Submitted, state.State)

		h.SignalWorkflow(execution.ID, SignalName, &signalPayload{Action: Approve})
		state = queryState(&h, execution)
		assertState(Approved, state.State)
	}
}
