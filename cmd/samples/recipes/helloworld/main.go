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

func startShadower(h *common.SampleHelper) {
	workerOptions := worker.Options{
		MetricsScope:       h.WorkerMetricScope,
		Logger:             h.Logger,
		EnableShadowWorker: true,
		ShadowOptions: worker.ShadowOptions{
			WorkflowTypes:  []string{helloWorldWorkflowName},
			WorkflowStatus: []string{"Completed"},
			ExitCondition: worker.ShadowExitCondition{
				ShadowCount: 10,
			},
		},
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "helloworld_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, helloWorldWorkflowName, "Cadence")
}

func registerWorkflowAndActivity(
	h *common.SampleHelper,
) {
	h.RegisterWorkflowWithAlias(helloWorldWorkflow, helloWorldWorkflowName)
	h.RegisterActivity(helloWorldActivity)
}

func main() {
	var mode string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger or shadower.")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		registerWorkflowAndActivity(&h)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "shadower":
		registerWorkflowAndActivity(&h)
		startShadower(&h)

		select {}
	case "trigger":
		startWorkflow(&h)
	}
}
