package main

import (
	"testing"
	"time"

	"github.com/stretchr/testify/require"
	"go.uber.org/cadence/worker"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap/zaptest"

	"github.com/uber-common/cadence-samples/cmd/samples/common"
)

const (
	configFile = "../../../../config/development.yaml"
)

// Make sure cadence-server is running at the address specified in the
// config/development.yaml file before running this test
func TestWorkflowShadowing(t *testing.T) {
	t.Skip("need connection to cadence server")

	shadowOptions := worker.ShadowOptions{
		WorkflowTypes:  []string{"sampleGreetingsWorkflow"},
		WorkflowStatus: []string{"Completed"},
		WorkflowStartTimeFilter: worker.TimeFilter{
			MinTimestamp: time.Now().Add(-time.Hour),
		},
	}

	var helper common.SampleHelper
	helper.SetConfigFile(configFile)
	helper.SetupServiceConfig()
	service, err := helper.Builder.BuildServiceClient()
	require.NoError(t, err)

	shadower, err := worker.NewWorkflowShadower(service, helper.Config.DomainName, shadowOptions, worker.ReplayOptions{}, zaptest.NewLogger(t))
	require.NoError(t, err)

	shadower.RegisterWorkflowWithOptions(sampleGreetingsWorkflow, workflow.RegisterOptions{Name: "sampleGreetingsWorkflow"})

	err = shadower.Run()
	require.NoError(t, err)
}
