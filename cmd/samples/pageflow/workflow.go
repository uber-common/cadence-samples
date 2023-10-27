package main

import (
	"context"
	"time"

	"github.com/pborman/uuid"
	"go.uber.org/cadence"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
)

/**
 * This sample workflow demonstrates how a page flow can be powered by Cadence workflow.
 */

const (
	// ApplicationName is the task list for this sample
	ApplicationName = "pageflow"
	SignalName      = "trigger-signal"
	QueryName       = "state"
)

type State string

const (
	Initialized        State = "initialized"
	Received                 = "received"
	Created                  = "created"
	SubmissionReceived       = "submission-received"
	Submitted                = "submitted"
	Approved                 = "approved"
	Rejected                 = "rejected"
	Withdrawn                = "withdrawn"
)

type Action string

const (
	Create   Action = "create"
	Save            = "save"
	Submit          = "submit"
	Approve         = "approve"
	Reject          = "reject"
	Withdraw        = "withdraw"
)

type signalPayload struct {
	Action  Action
	Content string
}

type QueryResult struct {
	State   State
	Content string
}

func pageWorkflow(ctx workflow.Context) (State, error) {
	logger := workflow.GetLogger(ctx)
	ch := workflow.GetSignalChannel(ctx, SignalName)

	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Second,
		StartToCloseTimeout:    10 * time.Second,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)

	var proposalID string
	var content string
	state := Initialized

	err := workflow.SetQueryHandler(ctx, QueryName, func(includeContent bool) (QueryResult, error) {
		result := QueryResult{State: state}
		if includeContent {
			result.Content = content
		}
		return result, nil
	})
	if err != nil {
		return state, err
	}

	for {
		var signal signalPayload
		if more := ch.Receive(ctx, &signal); !more {
			logger.Info("Signal channel closed")
			return state, cadence.NewCustomError("signal_channel_closed")
		}

		logger.Info("Signal received.", zap.Any("signal", signal))

		switch signal.Action {
		case Create:
			if state == Initialized {
				state = Received
				err := workflow.ExecuteActivity(ctx, createProposal, "test").Get(ctx, &proposalID)
				if err != nil {
					logger.Error("Failed to create proposal.")
				} else {
					logger.Info("State is now created.")
					state = Created
				}
			}
		case Save:
			if signal.Content != "" {
				content = signal.Content
				logger.Info("Content is saved.")
			}
		case Submit:
			if state == Created {
				state = SubmissionReceived
				logger.Info("State is now submission received.")
				err := workflow.ExecuteActivity(ctx, submitProposal, proposalID).Get(ctx, nil)
				if err != nil {
					logger.Error("Failed to submit proposal.")
				} else {
					state = Submitted
					logger.Info("State is now submitted.")
				}
			}
		case Approve:
			if state == Submitted {
				logger.Info("State is now approved.")
				state = Approved
				return state, nil
			}
		case Reject:
			if state == Submitted {
				logger.Info("Proposal got rejected.State is now approved.")
				state = Created
			}
		case Withdraw:
			if state != Approved {
				state = Withdrawn
			}
			return Withdrawn, nil
		}
	}
}

func createProposal(ctx context.Context, topic string) (string, error) {
	proposalID := uuid.New()
	activity.GetLogger(ctx).Sugar().Infof("Creating proposal %v for topic %v", proposalID, topic)
	return proposalID, nil
}

func submitProposal(ctx context.Context, id string) error {
	activity.GetLogger(ctx).Sugar().Infof("Submitting proposal %v", id)
	return nil
}
