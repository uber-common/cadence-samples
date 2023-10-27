package main

import (
	"context"
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
	s.env.RegisterWorkflow(samplePickFirstWorkflow)
	s.env.RegisterActivity(sampleActivity)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_Workflow() {
	s.env.OnActivity(sampleActivity, mock.Anything, mock.Anything, mock.Anything).
		Return(func(ctx context.Context, currentBranchID int, totalDuration time.Duration) (string, error) {
			// make branch 0 super fast so we don't have to wait sleep time in unit test
			if currentBranchID == 0 {
				totalDuration = time.Nanosecond
			}
			return sampleActivity(ctx, currentBranchID, totalDuration)
		}).Once()

	s.env.ExecuteWorkflow(samplePickFirstWorkflow)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}
