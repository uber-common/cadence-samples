package main

import (
	"context"
	"github.com/google/uuid"
	"github.com/uber-common/cadence-samples/cmd/samples/common"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
	"time"
)

const ApplicationName = "HelloSideEffect"

func SideEffectWorkflow(ctx workflow.Context) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("SideEffectWorkflow started")
	// setup query handler for query type "state"

	value := ""

	err := workflow.SetQueryHandler(ctx, "value", func(input []byte) (string, error) {
		return value, nil
	})
	if err != nil {
		logger.Info("SetQueryHandler failed: " + err.Error())
		return err
	}

	workflow.SideEffect(ctx, func(ctx workflow.Context) interface{} {
		return uuid.New().String()
	}).Get(&value)

	logger.Info("SideEffectWorkflow completed")
	return nil
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "sideffectflow",
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
		WorkflowIDReusePolicy:           client.WorkflowIDReusePolicyAllowDuplicate,
	}
	h.StartWorkflow(workflowOptions, SideEffectWorkflow)
}

func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope: h.WorkerMetricScope,
		Logger:       h.Logger,
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func main() {

	//workflow.Register(SideEffectWorkflow)

	var h common.SampleHelper
	h.SetupServiceConfig()
	h.RegisterWorkflow(SideEffectWorkflow)

	startWorkers(&h)

	// The workers are supposed to be long running process that should not exit.
	// Use select{} to block indefinitely for samples, you can quit by CMD+C.
	startWorkflow(&h)

	workflowClient, err := h.Builder.BuildCadenceClient()
	if err != nil {
		h.Logger.Error("Failed to build cadence client.", zap.Error(err))
		panic(err)
	}

	resp, err := workflowClient.QueryWorkflow(context.Background(), "sideffectflow", "", "value")
	if err != nil {
		h.Logger.Error("Failed to query workflow", zap.Error(err))
		panic("Failed to query workflow.")
	}

	var result interface{}
	if err := resp.Get(&result); err != nil {
		h.Logger.Error("Failed to decode query result", zap.Error(err))
	}
	h.Logger.Info("Received query result", zap.Any("Result", result))
}
