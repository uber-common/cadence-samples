package main

import (
	"context"
	"flag"
	"time"

	"github.com/pborman/uuid"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"

	"github.com/uber-common/cadence-samples/cmd/samples/common"
)

const (
	// ApplicationName is the task list for this sample
	ApplicationName = "mutexExample"

	_sampleHelperContextKey = "sampleHelper"
)

// This needs to be done as part of a bootstrap step when the process starts.
// The workers are supposed to be long running.
func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope:              h.WorkerMetricScope,
		Logger:                    h.Logger,
		BackgroundActivityContext: context.WithValue(context.Background(), _sampleHelperContextKey, h),
	}

	// Start Worker.
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

// startTwoWorkflows starts two workflows that operate on the same recourceID
func startTwoWorkflows(h *common.SampleHelper) {
	resourceID := uuid.New()
	h.StartWorkflow(client.StartWorkflowOptions{
		ID:                              "SampleWorkflowWithMutex_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    10 * time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	},
		sampleWorkflowWithMutex,
		resourceID)
	h.StartWorkflow(client.StartWorkflowOptions{
		ID:                              "SampleWorkflowWithMutex_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    10 * time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	},
		sampleWorkflowWithMutex,
		resourceID)
}

func main() {
	var mode string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker or trigger.")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(mutexWorkflow)
		h.RegisterWorkflow(sampleWorkflowWithMutex)
		h.RegisterActivity(signalWithStartMutexWorkflowActivity)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startTwoWorkflows(&h)
	}
}
