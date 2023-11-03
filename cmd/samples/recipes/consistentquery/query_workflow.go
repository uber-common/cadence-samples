package main

import (
	"time"

	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

// ApplicationName is the task list for this sample
const ApplicationName = "queryGroup"

// queryWorkflow is an implementation of cadence workflow to demo how to setup query handler
func queryWorkflow(ctx workflow.Context) error {
	queryResult := 0
	logger := workflow.GetLogger(ctx)
	logger.Info("QueryWorkflow started")
	// setup query handler for query type "state"
	err := workflow.SetQueryHandler(ctx, "state", func(input []byte) (int, error) {
		return queryResult, nil
	})
	if err != nil {
		logger.Info("SetQueryHandler failed: " + err.Error())
		return err
	}

	signalChan := workflow.GetSignalChannel(ctx, "increase")

	s := workflow.NewSelector(ctx)
	s.AddReceive(signalChan, func(c workflow.Channel, more bool) {
		c.Receive(ctx, nil)
		queryResult +=1
		workflow.GetLogger(ctx).Info("Received signal!", zap.String("signal", "increase"))
	})
	workflow.Go(ctx, func(ctx workflow.Context) {
		for  {
			s.Select(ctx)
		}
	})


	// to simulate workflow been blocked on something, we wait for a timer
	workflow.NewTimer(ctx, time.Minute*2).Get(ctx, nil)
	logger.Info("Timer fired")

	logger.Info("QueryWorkflow completed")
	return nil
}
