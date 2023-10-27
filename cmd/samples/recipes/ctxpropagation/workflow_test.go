package main

import (
	"context"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/.gen/go/shared"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/encoded"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
)

type UnitTestSuite struct {
	suite.Suite
	testsuite.WorkflowTestSuite

	env    *testsuite.TestWorkflowEnvironment
	header *shared.Header
}

func TestUnitTestSuite(t *testing.T) {
	suite.Run(t, new(UnitTestSuite))
}

func (s *UnitTestSuite) SetupTest() {
	// Set Context Propagators and Headers, these will be shared across all Context objects in the test
	contextPropagators := []workflow.ContextPropagator{NewContextPropagator()}
	s.header = &shared.Header{
		Fields: make(map[string][]byte),
	}
	s.SetContextPropagators(contextPropagators)
	s.SetHeader(s.header)

	workerOptions := worker.Options{
		ContextPropagators: contextPropagators,
	}

	s.env = s.NewTestWorkflowEnvironment()
	s.env.RegisterWorkflow(sampleCtxPropWorkflow)
	s.env.RegisterActivityWithOptions(sampleActivity, activity.RegisterOptions{Name: "sampleActivity"})
	s.env.SetWorkerOptions(workerOptions)
}

func (s *UnitTestSuite) Test_CtxPropWorkflow() {
	expectedCall := []string{
		"sampleActivity",
	}

	var activityCalled []string
	values := Values{Key: "sampleKey", Value: "sampleValue"}
	// Place the values to be propagated in the header
	SetValuesInHeader(values, s.header)

	s.env.SetOnActivityStartedListener(func(activityInfo *activity.Info, ctx context.Context, args encoded.Values) {
		activityType := activityInfo.ActivityType.Name
		activityCalled = append(activityCalled, activityType)
		if activityType != expectedCall[0] {
			panic("unexpected activity call")
		}
		actualValuesInCtx := ctx.Value(propagateKey).(Values)
		if actualValuesInCtx.Key != values.Key {
			panic("there was a problem propagating Values, the key field doesn't match")
		}
		if actualValuesInCtx.Value != values.Value {
			panic("there was a problem propagating Values, the value field doesn't match")
		}
	})
	s.env.ExecuteWorkflow(sampleCtxPropWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
	s.Equal(expectedCall, activityCalled)
}
