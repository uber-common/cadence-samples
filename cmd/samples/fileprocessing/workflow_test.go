package main

import (
	"context"
	"strings"
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
	s.env.RegisterWorkflow(sampleFileProcessingWorkflow)
	s.env.RegisterActivityWithOptions(downloadFileActivity, activity.RegisterOptions{
		Name: downloadFileActivityName,
	})
	s.env.RegisterActivityWithOptions(processFileActivity, activity.RegisterOptions{
		Name: processFileActivityName,
	})
	s.env.RegisterActivityWithOptions(uploadFileActivity, activity.RegisterOptions{
		Name: uploadFileActivityName,
	})
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_SampleFileProcessingWorkflow() {
	fileID := "test-file-id"
	expectedCall := []string{
		"downloadFileActivity",
		"processFileActivity",
		"uploadFileActivity",
	}

	var activityCalled []string
	s.env.SetOnActivityStartedListener(func(activityInfo *activity.Info, ctx context.Context, args encoded.Values) {
		activityType := activityInfo.ActivityType.Name
		if strings.HasPrefix(activityType, "internalSession") {
			return
		}
		activityCalled = append(activityCalled, activityType)
		switch activityType {
		case expectedCall[0]:
			var input string
			s.NoError(args.Get(&input))
			s.Equal(fileID, input)
		case expectedCall[1]:
			var input fileInfo
			s.NoError(args.Get(&input))
			s.Equal(input.HostID, HostID)
		case expectedCall[2]:
			var input fileInfo
			s.NoError(args.Get(&input))
			s.Equal(input.HostID, HostID)
		default:
			panic("unexpected activity call")
		}
	})
	s.env.ExecuteWorkflow(sampleFileProcessingWorkflow, fileID)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
	s.Equal(expectedCall, activityCalled)
}
