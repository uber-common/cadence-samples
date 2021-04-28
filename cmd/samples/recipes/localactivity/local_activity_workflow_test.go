package main

import (
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
	s.env.RegisterWorkflow(processingWorkflow)
	s.env.RegisterWorkflow(signalHandlingWorkflow)
	s.env.RegisterActivity(activityForCondition0)
	s.env.RegisterActivity(activityForCondition1)
	s.env.RegisterActivity(activityForCondition2)
	s.env.RegisterActivity(activityForCondition3)
	s.env.RegisterActivity(activityForCondition4)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_ProcessingWorkflow_SingleAction() {
	signalData := "_1_"

	// mock activityForCondition1 so it won't wait on real clock
	s.env.OnActivity(activityForCondition1, mock.Anything, signalData).Return("processed_1", nil)

	s.env.ExecuteWorkflow(processingWorkflow, signalData)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())

	var actualResult string
	s.NoError(s.env.GetWorkflowResult(&actualResult))
	s.Equal("processed_1", actualResult)
}

func (s *UnitTestSuite) Test_ProcessingWorkflow_MultiAction() {
	signalData := "_1_, _3_"

	// mock activityForCondition1 so it won't wait on real clock
	s.env.OnActivity(activityForCondition1, mock.Anything, signalData).Return("processed_1", nil)
	s.env.OnActivity(activityForCondition3, mock.Anything, signalData).Return("processed_3", nil)

	s.env.ExecuteWorkflow(processingWorkflow, signalData)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())

	var actualResult string
	s.NoError(s.env.GetWorkflowResult(&actualResult))
	s.Equal("processed_1processed_3", actualResult)
}

func (s *UnitTestSuite) Test_SignalHandlingWorkflow() {
	s.env.OnActivity(activityForCondition1, mock.Anything, "_1_").Return("processed_1", nil)

	s.env.RegisterDelayedCallback(func() {
		s.env.SignalWorkflow("trigger-signal", "_1_")
	}, time.Minute)
	s.env.RegisterDelayedCallback(func() {
		s.env.SignalWorkflow("trigger-signal", "exit")
	}, time.Minute*2)

	s.env.ExecuteWorkflow(signalHandlingWorkflow)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}
