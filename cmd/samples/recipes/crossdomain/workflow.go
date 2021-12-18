package main

import (
	"time"

	"go.uber.org/cadence"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This is the hello world workflow sample.
 */

// ApplicationName is the task list for this sample
const ApplicationName = "crossDomainGroup"

const crossDomainParentName = "crossDomainParentWorkflow"
const crossDomainChildName = "crossDomainChildWorkflow"

var childDomainNames = []string{"target-samples-domain0", "target-samples-domain1", "target-samples-domain2"}

const childSignalName = "crossDomainSignal"

func crossDomainParentWorkflow(ctx workflow.Context, name string) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("helloworld workflow started")

	var childFutures []workflow.ChildWorkflowFuture
	for _, childDomainName := range childDomainNames {
		cwo := workflow.ChildWorkflowOptions{
			Domain:                       childDomainName,
			WorkflowID:                   "crossdomain-" + childDomainName,
			ExecutionStartToCloseTimeout: time.Minute,
			ParentClosePolicy:            client.ParentClosePolicyTerminate,
		}
		childCtx := workflow.WithChildOptions(ctx, cwo)
		childCtx = workflow.WithWorkflowDomain(childCtx, childDomainName)
		childFuture := workflow.ExecuteChildWorkflow(childCtx, crossDomainChildWorkflow)
		childFutures = append(childFutures, childFuture)
	}

	// cross domain child workflow
	var childWEs []workflow.Execution
	for idx, childFuture := range childFutures {
		var childWE workflow.Execution
		if err := childFuture.GetChildWorkflowExecution().Get(ctx, &childWE); err != nil {
			logger.Error("start cross domain child failed", zap.Error(err))
			// return err
		}

		childWEs = append(childWEs, childWE)
		logger.Info("cross domain child started",
			zap.String("domainID", childDomainNames[idx]),
			zap.String("workflowID", childWE.ID),
			zap.String("runID", childWE.RunID),
		)
	}

	// fmt.Println("child started, stop the target cluster now!")
	workflow.Sleep(ctx, time.Second*10)

	// workflow.Sleep(ctx, time.Second*20)
	// childWEs := []workflow.Execution{
	// 	{ID: "workflowID0", RunID: "92937c55-f2ab-46cb-afda-c11ea4631610"},
	// 	{ID: "workflowID1", RunID: "92937c55-f2ab-46cb-afda-c11ea4631611"},
	// 	{ID: "workflowID2", RunID: "92937c55-f2ab-46cb-afda-c11ea4631612"},
	// }

	// cross domain signal
	var signalFutures []workflow.Future
	for idx, childDomainName := range childDomainNames {
		childCtx := workflow.WithWorkflowDomain(ctx, childDomainName)
		signalFuture := workflow.SignalExternalWorkflow(childCtx, childWEs[idx].ID, "", childSignalName, []byte(name))
		signalFutures = append(signalFutures, signalFuture)
	}

	for _, signalFuture := range signalFutures {
		if err := signalFuture.Get(ctx, nil); err != nil {
			logger.Error("signal cross domain child failed", zap.Error(err))
			// return err
		}

		logger.Info("signal cross domain child succeeded")
	}

	// cross domain cancel
	var cancelFutures []workflow.Future
	for idx, childDomainName := range childDomainNames {
		childCtx := workflow.WithWorkflowDomain(ctx, childDomainName)
		cancelFuture := workflow.RequestCancelExternalWorkflow(childCtx, childWEs[idx].ID, childWEs[idx].RunID)
		cancelFutures = append(cancelFutures, cancelFuture)
	}

	for _, cancelFuture := range cancelFutures {
		if err := cancelFuture.Get(ctx, nil); err != nil {
			logger.Error("cancel cross domain child failed", zap.Error(err))
			// return err
		}

		logger.Info("cancel cross domain child succeeded")
	}

	for _, childFuture := range childFutures {
		err := childFuture.Get(ctx, nil)
		if !cadence.IsCanceledError(err) {
			logger.Error("cross domain child should be canceled", zap.Error(err))
			// return cadence.NewCustomError("child workflow should be canceled", err.Error())
		}
	}

	logger.Info("cross domain parent workflow completed")

	return nil
}

func crossDomainChildWorkflow(ctx workflow.Context) error {
	signalCh := workflow.GetSignalChannel(ctx, childSignalName)
	var signalVal []byte
	signalCh.Receive(ctx, &signalVal)

	workflowTimeout := time.Second * time.Duration(workflow.GetInfo(ctx).ExecutionStartToCloseTimeoutSeconds)

	// should be canceled by parent rather than timeout
	return workflow.NewTimer(ctx, workflowTimeout).Get(ctx, nil)
}
