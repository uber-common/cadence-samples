package main

import (
	"context"
	"sync"
	"testing"
	"time"

	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
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
	s.env.RegisterWorkflow(sampleTimerWorkflow)
	s.env.RegisterActivity(orderProcessingActivity)
	s.env.RegisterActivity(sendEmailActivity)
}

func (s *UnitTestSuite) Test_Workflow_FastProcessing() {
	// mock to return immediately to simulate fast processing case
	s.env.OnActivity(orderProcessingActivity, mock.Anything).Return(nil)
	s.env.OnActivity(sendEmailActivity, mock.Anything).Return(func(ctx context.Context) error {
		// in fast processing case, this method should not get called
		s.FailNow("sendEmailActivity should not get called")
		return nil
	})

	s.env.ExecuteWorkflow(sampleTimerWorkflow, time.Minute)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *UnitTestSuite) Test_Workflow_SlowProcessing() {
	wg := &sync.WaitGroup{}
	wg.Add(1)
	s.env.OnActivity(orderProcessingActivity, mock.Anything).Return(func(ctx context.Context) error {
		// simulate slow processing, will complete this activity only after the sendEmailActivity is called.
		wg.Wait()
		return nil
	})
	s.env.OnActivity(sendEmailActivity, mock.Anything).Return(func(ctx context.Context) error {
		wg.Done()
		return nil
	})

	s.env.ExecuteWorkflow(sampleTimerWorkflow, time.Microsecond)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
	s.env.AssertExpectations(s.T())
}
