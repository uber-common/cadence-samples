package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/encoded"
	"go.uber.org/cadence/testsuite"
)

func TestCancelWorkflow(t *testing.T) {
	testSuite := &testsuite.WorkflowTestSuite{}

	canceledActivityName := "canceledActivity"
	skippedActivityName := "skippedActivity"
	cleanupActivityName := "cleanupActivity"

	env := testSuite.NewTestWorkflowEnvironment()
	env.RegisterWorkflow(sampleCancelWorkflow)
	env.RegisterActivityWithOptions(activityToBeCanceled, activity.RegisterOptions{
		Name: canceledActivityName,
	})
	env.RegisterActivityWithOptions(activityToBeSkipped, activity.RegisterOptions{
		Name: skippedActivityName,
	})
	env.RegisterActivityWithOptions(cleanupActivity, activity.RegisterOptions{
		Name: cleanupActivityName,
	})

	canceledActivityCanceled := false
	env.SetOnActivityCanceledListener(func(activityInfo *activity.Info) {
		if activityInfo.ActivityType.Name == canceledActivityName {
			canceledActivityCanceled = true
		}
	})

	skippedActivityExecuted := false
	cleanupActivityCompleted := false
	env.SetOnActivityCompletedListener(func(activityInfo *activity.Info, result encoded.Value, err error) {
		switch activityInfo.ActivityType.Name {
		case cleanupActivityName:
			cleanupActivityCompleted = true
		case skippedActivityName:
			skippedActivityExecuted = true
		}
	})

	env.RegisterDelayedCallback(func() {
		env.CancelWorkflow()
	}, time.Second)

	env.ExecuteWorkflow(sampleCancelWorkflow)

	require.True(t, env.IsWorkflowCompleted())
	require.NoError(t, env.GetWorkflowError())
	require.True(t, canceledActivityCanceled)
	require.False(t, skippedActivityExecuted)
	require.True(t, cleanupActivityCompleted)
}
