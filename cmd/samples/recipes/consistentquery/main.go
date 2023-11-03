package main

import (
	"flag"
	"fmt"
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

func main() {
	var mode, workflowID, runID, queryType string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger or query.")
	flag.StringVar(&workflowID, "w", "", "WorkflowID")
	flag.StringVar(&runID, "r", "", "RunID")
	flag.StringVar(&queryType, "t", "__stack_trace", "QueryType")
	flag.Parse()

	var h common.SampleHelper
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		h.RegisterWorkflow(queryWorkflow)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		wfID := "query_" + uuid.New()
		workflowOptions := client.StartWorkflowOptions{
			ID:                              wfID,
			TaskList:                        ApplicationName,
			ExecutionStartToCloseTimeout:    time.Hour * 10,
			DecisionTaskStartToCloseTimeout: time.Minute,
		}
		h.StartWorkflow(workflowOptions, queryWorkflow)
		result := -1
		h.ConsistentQueryWorkflow(&result, wfID, "", "state")
		fmt.Println("initial query result after started:", result)

		h.SignalWorkflow(wfID, "increase", nil)
		h.ConsistentQueryWorkflow(&result, wfID, "", "state")
		fmt.Println("query after 1 increase:", result)

		h.SignalWorkflow(wfID, "increase", nil)
		h.SignalWorkflow(wfID, "increase", nil)
		h.SignalWorkflow(wfID, "increase", nil)
		h.SignalWorkflow(wfID, "increase", nil)
		h.ConsistentQueryWorkflow(&result, wfID, "", "state")
		fmt.Println("query after 1 +4 increase:", result)
	}
}
