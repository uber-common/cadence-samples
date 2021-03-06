package main

import (
	"context"
	"time"

	"go.uber.org/cadence"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This sample workflow executes unreliable activity with retry policy. If activity execution failed, server will
 * schedule retry based on retry policy configuration. The activity also heartbeat progress so it could resume from
 * reported progress in retry attempt.
 */

// ApplicationName is the task list for this sample
const ApplicationName = "retryactivityGroup"

// retryWorkflow workflow decider
func retryWorkflow(ctx workflow.Context) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute,
		StartToCloseTimeout:    time.Minute * 10,
		HeartbeatTimeout:       time.Second * 10,
		RetryPolicy: &cadence.RetryPolicy{
			InitialInterval:          time.Second,
			BackoffCoefficient:       2.0,
			MaximumInterval:          time.Minute,
			ExpirationInterval:       time.Minute * 5,
			MaximumAttempts:          5,
			NonRetriableErrorReasons: []string{"bad-error"},
		},
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	err := workflow.ExecuteActivity(ctx, batchProcessingActivity, 0, 20, time.Second).Get(ctx, nil)
	if err != nil {
		workflow.GetLogger(ctx).Info("Workflow completed with error.", zap.Error(err))
		return err
	}
	workflow.GetLogger(ctx).Info("Workflow completed.")
	return nil
}

// batchProcessingActivity process batchSize of jobs starting from firstTaskID. This activity will heartbeat to report
// progress, and it could fail sometimes. Use retry policy to retry when it failed, and resume from reported progress.
func batchProcessingActivity(ctx context.Context, firstTaskID, batchSize int, processDelay time.Duration) error {
	logger := activity.GetLogger(ctx)

	i := firstTaskID
	if activity.HasHeartbeatDetails(ctx) {
		// we are retry from a failed attempt, and there is reported progress that we should resume from.
		var completedIdx int
		if err := activity.GetHeartbeatDetails(ctx, &completedIdx); err == nil {
			i = completedIdx + 1
			logger.Info("Resuming from failed attempt", zap.Int("ReportedProgress", completedIdx))
		}
	}

	taskProcessedInThisAttempt := 0 // used to determine when to fail (simulate failure)
	for ; i < firstTaskID+batchSize; i++ {
		// process task i
		logger.Info("processing task", zap.Int("TaskID", i))
		time.Sleep(processDelay) // simulate time spend on processing each task
		activity.RecordHeartbeat(ctx, i)
		taskProcessedInThisAttempt++

		// simulate failure after process 1/3 of the tasks
		if taskProcessedInThisAttempt >= batchSize/3 && i < firstTaskID+batchSize-1 {
			logger.Info("Activity failed, will retry...")
			// Activity could return different error types for different failures so workflow could handle them differently.
			// For example, decide to retry or not based on error reasons.
			return cadence.NewCustomError("some-retryable-error")
		}
	}

	logger.Info("Activity succeed.")
	return nil
}
