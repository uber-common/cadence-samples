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
		FeatureFlags: client.FeatureFlags{
			WorkflowExecutionAlreadyCompletedErrorEnabled: true,
		},
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "crossdomain_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Second * 10,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, crossDomainParentWorkflow, "Cadence")
}

func registerWorkflowAndActivity(
	h *common.SampleHelper,
) {
	h.RegisterWorkflowWithAlias(crossDomainParentWorkflow, crossDomainParentName)
	h.RegisterWorkflowWithAlias(crossDomainChildWorkflow, crossDomainChildName)
}

func main() {
	var mode string
	var configFile string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger.")
	flag.StringVar(&configFile, "cf", "", "config file path")
	flag.Parse()

	var h common.SampleHelper
	h.SetConfigFile(configFile)
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		registerWorkflowAndActivity(&h)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startWorkflow(&h)
	}
}
