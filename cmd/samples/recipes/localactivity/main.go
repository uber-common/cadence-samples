package main

import (
	"flag"
	"time"

	"github.com/pborman/uuid"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"

	"github.com/uber-common/cadence-samples/cmd/samples/common"
)

// This needs to be done as part of a bootstrap step when the process starts.
// The workers are supposed to be long running.
func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope: h.Scope,
		Logger:       h.Logger,
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "localactivity_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute * 3,
		DecisionTaskStartToCloseTimeout: time.Minute,
		WorkflowIDReusePolicy:           client.WorkflowIDReusePolicyAllowDuplicate,
	}
	h.StartWorkflow(workflowOptions, signalHandlingWorkflow)
}

func main() {
	var mode, workflowID, signal string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger or query.")
	flag.StringVar(&workflowID, "w", "", "WorkflowID")
	flag.StringVar(&signal, "s", "signal_data", "SignalData")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(processingWorkflow)
		h.RegisterWorkflow(signalHandlingWorkflow)
		h.RegisterActivity(activityForCondition0)
		h.RegisterActivity(activityForCondition1)
		h.RegisterActivity(activityForCondition2)
		h.RegisterActivity(activityForCondition3)
		h.RegisterActivity(activityForCondition4)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startWorkflow(&h)
	case "signal":
		h.SignalWorkflow(workflowID, SignalName, signal)
	}
}