package main

import (
	"context"
	"github.com/google/uuid"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
	"time"
)

func wf0(ctx workflow.Context, name string) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("starting child workflow")
	ctx1 := workflow.WithChildOptions(ctx, workflow.ChildWorkflowOptions{
		Domain:                       domain1,
		WorkflowID:                   "wf-domain-1-" + uuid.New().String(),
		TaskList:                     tasklist,
		ExecutionStartToCloseTimeout: 1 * time.Minute,
		//ParentClosePolicy:            client.ParentClosePolicyTerminate,
	})
	var res interface{}
	err := workflow.ExecuteChildWorkflow(ctx1, wf1, "args").Get(ctx1, &res)
	if err != nil {
		logger.Error("got error executing child workflow", zap.Error(err))
	}
	logger.Info("Workflow wf0 completed.", zap.Any("return-value", res))
	return nil
}

func wf1(ctx workflow.Context, name string) error {
	logger := workflow.GetLogger(ctx)
	logger.Info("workflow wf1 completed.")
	return nil
}

func activity0(ctx context.Context) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("activity 1 - runnning")
	return "Hello activity 1!", nil
}
func activity1(ctx context.Context) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("activity 2 - runnning")
	return "Hello - activity 2", nil
}
