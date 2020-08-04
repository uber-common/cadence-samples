package main

import (
	"errors"
	"fmt"

	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This sample workflow demonstrates how to use invoke child workflow from parent workflow execution.  Each child
 * workflow execution is starting a new run and parent execution is notified only after the completion of last run.
 */

// sampleChildWorkflow workflow decider
func sampleChildWorkflow(ctx workflow.Context, totalCount, runCount int) (string, error) {
	logger := workflow.GetLogger(ctx)
	logger.Info("Child workflow execution started.")
	if runCount <= 0 {
		logger.Error("Invalid valid for run count.", zap.Int("RunCount", runCount))
		return "", errors.New("invalid run count")
	}

	totalCount++
	runCount--
	if runCount == 0 {
		result := fmt.Sprintf("Child workflow execution completed after %v runs", totalCount)
		logger.Info("Child workflow completed.", zap.String("Result", result))
		return result, nil
	}

	logger.Info("Child workflow starting new run.", zap.Int("RunCount", runCount), zap.Int("TotalCount",
		totalCount))
	return "", workflow.NewContinueAsNewError(ctx, sampleChildWorkflow, totalCount, runCount)
}
