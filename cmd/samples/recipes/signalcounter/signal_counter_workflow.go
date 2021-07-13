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
		s.AddReceive(workflow.GetSignalChannel(ctx, "channelA"), func(c workflow.Channel, ok bool) {
			if ok{
				var i int
				c.Receive(ctx, &i)
				counter += i
				signalsPerExecution += 1
			}
		})
		s.AddReceive(workflow.GetSignalChannel(ctx, "channelB"), func(c workflow.Channel, ok bool) {
			if ok{
				var i int
				c.Receive(ctx, &i)
				counter += i
				signalsPerExecution += 1
			}
		})

		var drainedAllSignalsInDecisionTask bool
		s.AddDefault(func() {
			// this indicate that we have drained all signals within the decision task, and it's safe to do a continueAsNew
			drainedAllSignalsInDecisionTask = true
		})

		for {
			if signalsPerExecution >= maxSignalsPerExecution && drainedAllSignalsInDecisionTask{
				return workflow.NewContinueAsNewError(ctx, sampleSignalCounterWorkflow, counter)
			}
			s.Select(ctx)
		}
}