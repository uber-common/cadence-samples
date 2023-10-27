package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/encoded"
	"go.uber.org/cadence/testsuite"
)

type UnitTestSuite struct {
	suite.Suite
	testsuite.WorkflowTestSuite

	env *testsuite.TestWorkflowEnvironment
}

func TestUnitTestSuite(t *testing.T) {
	suite.Run(t, new(UnitTestSuite))
}

func (s *UnitTestSuite) SetupTest() {
	s.env = s.NewTestWorkflowEnvironment()
	s.env.RegisterWorkflow(sampleGreetingsWorkflow)
	s.env.RegisterActivity(getGreetingActivity)
	s.env.RegisterActivity(getNameActivity)
	s.env.RegisterActivity(sayGreetingActivity)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_SampleGreetingsWorkflow() {
	sayGreetingActivityName := "github.com/uber-common/cadence-samples/cmd/samples/recipes/greetings.sayGreetingActivity"
	var startCalled, endCalled bool
	s.env.SetOnActivityStartedListener(func(activityInfo *activity.Info, ctx context.Context, args encoded.Values) {
		if sayGreetingActivityName == activityInfo.ActivityType.Name {
			var greeting, name string
			args.Get(&greeting, &name)
			s.Equal("Hello", greeting)
			s.Equal("Cadence", name)
			startCalled = true
		}
	})
	s.env.SetOnActivityCompletedListener(func(activityInfo *activity.Info, result encoded.Value, err error) {
		if sayGreetingActivityName == activityInfo.ActivityType.Name {
			var sayResult string
			result.Get(&sayResult)
			s.Equal("Greeting: Hello Cadence!\n", sayResult)
			endCalled = true
		}
	})

	s.env.ExecuteWorkflow(sampleGreetingsWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
	s.True(startCalled)
	s.True(endCalled)
}
