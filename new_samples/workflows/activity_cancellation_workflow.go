package workflows

import (
	"context"
	"errors"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"time"
)

func CancellationWorkflow(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("HelloWorldWorkflow started")

	err := workflow.ExecuteActivity(ctx, CancellationActivity, nil).Get(ctx, nil)
	if err != nil {
		return err
	}

	return nil
}

func CancellationActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("CancelCreationActivity started.")

	// This will pass a cancel context to a mock long-running operation function,
	// which keeps a channel listening to the cancel signal and do something.
	cancelCtx, cancel := context.WithTimeout(ctx, time.Second*5)
	defer cancel()

	err := longRunningOperation(cancelCtx)
	if err != nil {
		return err
	}
	return nil
}

func longRunningOperation(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("Long running operation started. Waiting 10 seconds...")
	for {
		select {
		case <-ctx.Done():
			logger.Error("Oh no. workflow activity is cancelled")
			return errors.New("context cancelled")
		}
	}
}
