package main

import (
	"context"
	"errors"
	"testing"
	"time"

	"github.com/stretchr/testify/mock"
	"github.com/stretchr/testify/suite"
	"github.com/uber-common/cadence-samples/cmd/samples/common"
	"go.uber.org/cadence/testsuite"
	"go.uber.org/cadence/worker"
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
	s.env.RegisterWorkflow(mutexWorkflow)
	s.env.RegisterWorkflow(sampleWorkflowWithMutex)
	s.env.RegisterActivity(signalWithStartMutexWorkflowActivity)

	var h common.SampleHelper
	s.env.SetWorkerOptions(worker.Options{
		BackgroundActivityContext: context.WithValue(context.Background(), _sampleHelperContextKey, h),
	})
}

func (s *UnitTestSuite) TearDownTest() {
	s.env.AssertExpectations(s.T())
}

func (s *UnitTestSuite) Test_Workflow_Success() {
	mockResourceID := "mockResourceID"
	MockMutexLock(s.env, mockResourceID, nil)
	s.env.ExecuteWorkflow(sampleWorkflowWithMutex, mockResourceID)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *UnitTestSuite) Test_Workflow_Error() {
	mockResourceID := "mockResourceID"
	MockMutexLock(s.env, mockResourceID, errors.New("bad-error"))
	s.env.ExecuteWorkflow(sampleWorkflowWithMutex, mockResourceID)

	s.True(s.env.IsWorkflowCompleted())
	s.EqualError(s.env.GetWorkflowError(), "bad-error")
}

func (s *UnitTestSuite) Test_MutexWorkflow_Success() {
	mockNamespace := "mockNamespace"
	mockResourceID := "mockResourceID"
	mockUnlockTimeout := 10 * time.Minute
	mockSenderWorkflowID := "mockSenderWorkflowID"
	s.env.RegisterDelayedCallback(func() {
		s.env.SignalWorkflow(RequestLockSignalName, mockSenderWorkflowID)
	}, time.Millisecond*0)
	s.env.RegisterDelayedCallback(func() {
		s.env.SignalWorkflow("unlock-event-mockSenderWorkflowID", "releaseLock")
	}, time.Millisecond*0)
	s.env.OnSignalExternalWorkflow(mock.Anything, mockSenderWorkflowID, "",
		AcquireLockSignalName, mock.Anything).Return(nil)

	s.env.ExecuteWorkflow(
		mutexWorkflow,
		mockNamespace,
		mockResourceID,
		mockUnlockTimeout,
	)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}

func (s *UnitTestSuite) Test_MutexWorkflow_TimeoutSuccess() {
	mockNamespace := "mockNamespace"
	mockResourceID := "mockResourceID"
	mockUnlockTimeout := 10 * time.Minute
	mockSenderWorkflowID := "mockSenderWorkflowID"
	s.env.RegisterDelayedCallback(func() {
		s.env.SignalWorkflow(RequestLockSignalName, mockSenderWorkflowID)
	}, time.Millisecond*0)
	s.env.OnSignalExternalWorkflow(mock.Anything, mockSenderWorkflowID, "",
		AcquireLockSignalName, mock.Anything).Return(nil)

	s.env.ExecuteWorkflow(
		mutexWorkflow,
		mockNamespace,
		mockResourceID,
		mockUnlockTimeout,
	)

	s.True(s.env.IsWorkflowCompleted())
	s.NoError(s.env.GetWorkflowError())
}
