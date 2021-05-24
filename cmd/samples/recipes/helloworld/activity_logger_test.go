package main

import (
	"context"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/worker"
	"go.uber.org/zap"
	"go.uber.org/zap/zapcore"
	"testing"

	"github.com/stretchr/testify/require"
	"go.uber.org/cadence/activity"
)

func sampleActivity(ctx context.Context) error {
	logger := activity.GetLogger(ctx)
	logger.Info("test logging")
	return nil
}

func Test_Activity_Noop_Logger(t *testing.T) {
	testSuite := &testsuite.WorkflowTestSuite{}
	env := testSuite.NewTestActivityEnvironment()
	logger := zap.NewNop()
	env.SetWorkerOptions(worker.Options{
		Logger: logger,
	})
	env.RegisterActivity(sampleActivity)
	val, err := env.ExecuteActivity(sampleActivity)
	require.Nil(t, err)
	require.True(t, !val.HasValue())
}

func Test_Activity_Print_Logger(t *testing.T) {
	testSuite := &testsuite.WorkflowTestSuite{}
	env := testSuite.NewTestActivityEnvironment()

	logger, err := zap.NewProduction()
	require.Nil(t, err)

	var outputLogs []string
	logger = logger.WithOptions(zap.Hooks(
		func(entry zapcore.Entry) error {
			outputLogs = append(outputLogs, entry.Message)
			return nil
		},
	))

	env.SetWorkerOptions(worker.Options{
		Logger: logger,
	})
	env.RegisterActivity(sampleActivity)

	val, err := env.ExecuteActivity(sampleActivity)

	require.Nil(t, err)
	require.True(t, !val.HasValue())
	require.True(t, len(outputLogs)==1)
	require.True(t, outputLogs[0] == "test logging")
}