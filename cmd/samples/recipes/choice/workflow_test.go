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
	s.env.RegisterWorkflow(exclusiveChoiceWorkflow)
	s.env.RegisterWorkflow(multiChoiceWorkflow)
	s.env.RegisterActivity(getOrderActivity)
	s.env.RegisterActivity(orderAppleActivity)
	s.env.RegisterActivity(orderBananaActivity)
	s.env.RegisterActivity(orderCherryActivity)
	s.env.RegisterActivity(orderOrangeActivity)
	s.env.RegisterActivity(getBasketOrderActivity)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_ExclusiveChoiceWorkflow() {
	s.env.ExecuteWorkflow(exclusiveChoiceWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *UnitTestSuite) Test_MultiChoiceWorkflow() {
	s.env.ExecuteWorkflow(multiChoiceWorkflow)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}
