package main

import (
	"testing"

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
	s.env.RegisterWorkflow(sampleBranchWorkflow)
	s.env.RegisterWorkflow(sampleParallelWorkflow)
	s.env.RegisterActivity(sampleActivity)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_BranchWorkflow() {
	s.env.ExecuteWorkflow(sampleBranchWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *UnitTestSuite) Test_ParallelWorkflow() {
	s.env.ExecuteWorkflow(sampleParallelWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}
