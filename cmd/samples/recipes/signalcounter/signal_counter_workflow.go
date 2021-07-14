package main

import (
	"go.uber.org/cadence/workflow"
)

/**
 * This sample workflow continuously counting signals and do continue as new
 */

// ApplicationName is the task list for this sample
const ApplicationName = "signal_counter"
// A workflow execution cannot receive infinite number of signals due to history limit
// By default 10000 is MaximumSignalsPerExecution which can be configured by DynamicConfig of Cadence cluster.
// But it's recommended to do continueAsNew after receiving 100 signals
const maxSignalsPerExecution = 10

// sampleSignalCounterWorkflow Workflow Decider.
func sampleSignalCounterWorkflow(ctx workflow.Context, counter int) error {
		s := workflow.NewSelector(ctx)
		signalsPerExecution := 0
		finished := false
		s.AddReceive(workflow.GetSignalChannel(ctx, "channelA"), func(c workflow.Channel, ok bool) {
			if ok{
				var i int
				c.Receive(ctx, &i)
				counter += i
				signalsPerExecution += 1
				if signalsPerExecution >= maxSignalsPerExecution{
					finished = true
				}
			}
		})
		for {
			if finished {
				return workflow.NewContinueAsNewError(ctx, sampleSignalCounterWorkflow, counter)
			}
			s.Select(ctx)
		}
}