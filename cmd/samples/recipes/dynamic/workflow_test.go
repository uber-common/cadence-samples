package main

import (
	"testing"

	"github.com/stretchr/testify/assert"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/testsuite"
)

func TestDynamicWorkflow(t *testing.T) {
	a := assert.New(t)
	s := testsuite.WorkflowTestSuite{}
	env := s.NewTestWorkflowEnvironment()
	env.RegisterWorkflow(sampleGreetingsWorkflow)
	env.RegisterActivityWithOptions(getGreetingActivity, activity.RegisterOptions{
		Name: getGreetingActivityName,
	})
	env.RegisterActivityWithOptions(getNameActivity, activity.RegisterOptions{
		Name: getNameActivityName,
	})
	env.RegisterActivityWithOptions(sayGreetingActivity, activity.RegisterOptions{
		Name: sayGreetingActivityName,
	})

	env.OnActivity(getGreetingActivityName).Return("Greet", nil).Times(1)
	env.OnActivity(getNameActivityName).Return("Name", nil).Times(1)
	env.OnActivity(sayGreetingActivityName, "Greet", "Name").Return("Greet Name", nil).Times(1)

	env.ExecuteWorkflow(sampleGreetingsWorkflow)

	a.True(env.IsWorkflowCompleted())
	a.NoError(env.GetWorkflowError())
	env.AssertExpectations(t)
}
