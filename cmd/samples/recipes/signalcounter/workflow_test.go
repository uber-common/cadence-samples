package main

import (
	"strings"
	"testing"

	"github.com/stretchr/testify/suite"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/workflow"
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
	s.env.RegisterWorkflow(sampleSignalCounterWorkflow)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_SampleSignalCounterWorkflow() {

	for i:=0; i< 11; i++{
		s.env.RegisterDelayedCallback(func() {
			s.env.SignalWorkflow("channelA", 10)
		}, 0)
	}

	s.env.ExecuteWorkflow(sampleSignalCounterWorkflow, 0)

	s.True(s.env.IsWorkflowCompleted())
	err, ok := s.env.GetWorkflowError().(*workflow.ContinueAsNewError)
	s.True(ok)
	s.True(strings.Contains(err.WorkflowType().Name, "sampleSignalCounterWorkflow"))
	// It should receive and process all 11 signals, even though maxSignalsPerExecution is 10
	s.Equal(110, err.Args()[0])
}
