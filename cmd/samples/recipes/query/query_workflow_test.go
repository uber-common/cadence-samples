package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"go.uber.org/cadence/testsuite"
)

func Test_QueryWorkflow(t *testing.T) {
	ts := &testsuite.WorkflowTestSuite{}
	env := ts.NewTestWorkflowEnvironment()
	env.RegisterWorkflow(queryWorkflow)

	w := false
	env.RegisterDelayedCallback(func() {
		queryAndVerify(t, env, "waiting on timer")
		w = true
	}, time.Minute*1)

	env.ExecuteWorkflow(queryWorkflow)
	require.True(t, env.IsWorkflowCompleted())
	require.NoError(t, env.GetWorkflowError())
	require.True(t, w, "state at timer not verified")
	queryAndVerify(t, env, "done")
}

func queryAndVerify(t *testing.T, env *testsuite.TestWorkflowEnvironment, expectedState string) {
	result, err := env.QueryWorkflow("state")
	require.NoError(t, err)
	var state string
	err = result.Get(&state)
	require.NoError(t, err)
	require.Equal(t, expectedState, state)
}
