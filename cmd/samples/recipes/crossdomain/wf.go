package main

import (
	"context"
	"github.com/google/uuid"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
	"time"
)

// some sample data to be passed around
type Data struct {
	Val string
}

func wf0(ctx workflow.Context) error {
	// first try launching a child workflow in another cluster, active in another region
	logger := workflow.GetLogger(ctx)
	logger.Info("starting child workflow in domain1, cluster 1")
	ctx1 := workflow.WithChildOptions(ctx, workflow.ChildWorkflowOptions{
		Domain:                       domain1,
		WorkflowID:                   "wf-domain-1-" + uuid.New().String(),
		TaskList:                     tasklist1,
		ExecutionStartToCloseTimeout: 1 * time.Minute,
	})
	err := workflow.ExecuteChildWorkflow(ctx1, wf1, Data{Val: "test"}).Get(ctx1, nil)
	if err != nil {
		logger.Error("got error executing child workflow", zap.Error(err))
	}
	logger.Info("Cross-cluster cross-domain workflow completed", zap.Any("return-value", nil))

	// now try a workflow active in the same cluster
	ctx2 := workflow.WithChildOptions(ctx, workflow.ChildWorkflowOptions{
		Domain:                       domain2,
		WorkflowID:                   "wf-domain-2" + uuid.New().String(),
		TaskList:                     tasklist2,
		ExecutionStartToCloseTimeout: 1 * time.Minute,
	})
	err = workflow.ExecuteChildWorkflow(ctx2, wf2, Data{Val: "test"}).Get(ctx2, nil)
	if err != nil {
		logger.Error("got error executing child workflow", zap.Error(err))
	}
	logger.Info("same-cluster cross-domain child-workflow completed.")
	return nil
}

func wf1(ctx workflow.Context, args Data) error {
	if args.Val != "test" {
		panic("wf1 did not receive expected args")
	}
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    4 * time.Minute,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	logger := workflow.GetLogger(ctx)
	logger.Info("workflow wf1 starting activity.")
	err := workflow.ExecuteActivity(ctx, activity1).Get(ctx, nil)
	if err != nil {
		logger.Error("activity error", zap.Error(err))
	}
	logger.Info("workflow wf1 completed activity.")
	logger.Info("workflow wf1 completed.")
	return nil
}

func wf2(ctx workflow.Context, args Data) error {
	logger := workflow.GetLogger(ctx)
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    4 * time.Minute,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	if args.Val != "test" {
		panic("wf1 did not receive expected args")
	}
	err := workflow.ExecuteActivity(ctx, activity2).Get(ctx, nil)
	if err != nil {
		logger.Error("activity error", zap.Error(err))
	}
	logger.Info("workflow wf1 completed.")
	return nil
}

func activity1(ctx context.Context) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("activity 1 - running")
	return "Hello - activity 1", nil
}

func activity2(ctx context.Context) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("activity 2 - running")
	return "Hello - activity 2", nil
}
