package main

import (
	"context"
	"time"

	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This is the hello world workflow sample.
 */

// ApplicationName is the task list for this sample
const ApplicationName = "helloWorldGroup"

const helloWorldWorkflowName = "helloWorldWorkflow"

// helloWorkflow workflow decider
func helloWorldWorkflow(ctx workflow.Context, name string) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute,
		HeartbeatTimeout:       time.Second * 20,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	logger := workflow.GetLogger(ctx)
	logger.Info("helloworld workflow started")
	var helloworldResult string
	err := workflow.ExecuteActivity(ctx, helloWorldActivity, name).Get(ctx, &helloworldResult)
	if err != nil {
		logger.Error("Activity failed.", zap.Error(err))
		return err
	}

	// Adding a new activity to the workflow will result in a non-determinstic change for the workflow
	// Please check https://cadenceworkflow.io/docs/go-client/workflow-versioning/ for more information
	//
	// Un-commenting the following code and the TestReplayWorkflowHistoryFromFile in replay_test.go
	// will fail due to the non-determinstic change
	//
	// If you have a completed workflow execution without the following code and run the
	// TestWorkflowShadowing in shadow_test.go or start the worker in shadow mode (using -m shadower)
	// those two shadowing check will also fail due to the non-deterministic change
	//
	// err := workflow.ExecuteActivity(ctx, helloWorldActivity, name).Get(ctx, &helloworldResult)
	// if err != nil {
	// 	logger.Error("Activity failed.", zap.Error(err))
	// 	return err
	// }

	logger.Info("Workflow sleep.")

	// time.Sleep(time.Second * 20)

	logger.Info("Workflow completed.", zap.String("Result", helloworldResult))

	return nil
}

func helloWorldActivity(ctx context.Context, name string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("helloworld activity started")
	return "Hello " + name + "!", nil
}
