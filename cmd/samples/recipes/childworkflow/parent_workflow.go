package main

import (
	"fmt"
	"time"

	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This sample workflow demonstrates how to use invoke child workflow from parent workflow execution.  Each child
 * workflow execution is starting a new run and parent execution is notified only after the completion of last run.
 */

// ApplicationName is the task list for this sample
const ApplicationName = "childWorkflowGroup"

// sampleParentWorkflow workflow decider
func sampleParentWorkflow(ctx workflow.Context) error {
	logger := workflow.GetLogger(ctx)
	execution := workflow.GetInfo(ctx).WorkflowExecution
	// Parent workflow can choose to specify it's own ID for child execution.  Make sure they are unique for each execution.
	var childID string 
        workflow.SideEffect(ctx, func(ctx workflow.Context) interface{} {
		return uuid.New().String()
	}).Get(&childID)
	
	cwo := workflow.ChildWorkflowOptions{
		// If WorkflowID is not specified, cadence will generate a random unique ID for child execution. However, this will cause issue for reset. See https://github.com/uber-go/cadence-client/issues/1045
		WorkflowID:                   childID,
		ExecutionStartToCloseTimeout: time.Minute,
	}
	ctx = workflow.WithChildOptions(ctx, cwo)
	var result string
	err := workflow.ExecuteChildWorkflow(ctx, sampleChildWorkflow, 0, 5).Get(ctx, &result)
	if err != nil {
		logger.Error("Parent execution received child execution failure.", zap.Error(err))
		return err
	}

	logger.Info("Parent execution completed.", zap.String("Result", result))
	return nil
}
