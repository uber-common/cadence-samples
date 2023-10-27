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
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "signal_counter_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Hour,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, sampleSignalCounterWorkflow, 0)
}

func main() {
	var mode string
	var workflowID string
	var signalValue int
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger(start a new workflow), or signal.")
	flag.StringVar(&workflowID, "w", "", "the workflowID to send signal")
	flag.IntVar(&signalValue, "sig", 1, "the value that is sent to the counter workflow")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(sampleSignalCounterWorkflow)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startWorkflow(&h)
	case "signal":
		h.SignalWorkflow(workflowID, "channelA", signalValue)
		h.SignalWorkflow(workflowID, "channelB", signalValue)
	}
}
