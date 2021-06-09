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
		MetricsScope: h.WorkerMetricScope,
		Logger:       h.Logger,
	}

	// Start Worker.
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflowMultiChoice(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "multi_choice_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, multiChoiceWorkflow)
}

func startWorkflowExclusiveChoice(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "single_choice_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, exclusiveChoiceWorkflow)
}

func main() {
	var mode, sampleCase string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker or trigger.")
	flag.StringVar(&sampleCase, "c", "single", "Sample case to run.")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(exclusiveChoiceWorkflow)
		h.RegisterWorkflow(multiChoiceWorkflow)
		h.RegisterActivity(getOrderActivity)
		h.RegisterActivity(orderAppleActivity)
		h.RegisterActivity(orderBananaActivity)
		h.RegisterActivity(orderCherryActivity)
		h.RegisterActivity(orderOrangeActivity)
		h.RegisterActivity(getBasketOrderActivity)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		switch sampleCase {
		case "multi":
			startWorkflowMultiChoice(&h)
		default:
			startWorkflowExclusiveChoice(&h)
		}
	}
}
