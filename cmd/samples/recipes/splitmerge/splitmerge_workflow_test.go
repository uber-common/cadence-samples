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
	s.env.RegisterWorkflow(sampleSplitMergeWorkflow)
	s.env.RegisterActivity(chunkProcessingActivity)
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_Workflow() {
	workerCount := 5

	s.env.ExecuteWorkflow(sampleSplitMergeWorkflow, workerCount)
	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())

	var result ChunkResult
	s.env.GetWorkflowResult(&result)

	totalItem, totalSum := 0, 0
	for i := 1; i <= workerCount; i++ {
		totalItem += i
		totalSum += i * i
	}

	s.Equal(totalItem, result.NumberOfItemsInChunk)
	s.Equal(totalSum, result.SumInChunk)
}
