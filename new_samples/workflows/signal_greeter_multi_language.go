package workflows

import (
	"context"
	"errors"
	"fmt"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"go.uber.org/zap"
	"time"
)

// A workflow execution cannot receive infinite number of signals due to history limit
// By default 10000 is MaximumSignalsPerExecution which can be configured by DynamicConfig of Cadence cluster.
// But it's recommended to do continueAsNew after receiving certain number of signals(in production, use a number <1000)
const (
	MaxSignalCount = 3

	LanguageChan = "language"
	CancelChan   = "cancel"
)

type person struct {
	Name string `json:"name"`
}

func SignalGreeterMultiLanguageWorkflow(ctx workflow.Context, person person) error {
	ao := workflow.ActivityOptions{
		ScheduleToStartTimeout: time.Minute * 60,
		StartToCloseTimeout:    time.Minute * 60,
	}
	ctx = workflow.WithActivityOptions(ctx, ao)
	logger := workflow.GetLogger(ctx)
	logger.Info("SignalGreeterMultiLanguageWorkflow started, ", zap.String("Name", person.Name))

	signalCount := 0

	var language string
	var canceled bool
	languageChan := workflow.GetSignalChannel(ctx, LanguageChan)
	cancelChan := workflow.GetSignalChannel(ctx, CancelChan)
	for {
		s := workflow.NewSelector(ctx)
		s.AddReceive(languageChan, func(ch workflow.Channel, ok bool) {
			if ok {
				ch.Receive(ctx, &language)
				signalCount += 1
			}
		})

		s.AddReceive(cancelChan, func(ch workflow.Channel, ok bool) {
			if ok {
				ch.Receive(ctx, &canceled)
			}
		})
		s.Select(ctx)

		if canceled {
			return errors.New("signal workflow canceled")
		}
		if signalCount >= MaxSignalCount {
			return workflow.NewContinueAsNewError(ctx, SignalGreeterMultiLanguageWorkflow, person)
		}

		var greeting string
		err := workflow.ExecuteActivity(ctx, GenerateGreetingMessage, language, person.Name).Get(ctx, &greeting)
		if err != nil {
			return err
		}

		logger.Info("Greeting message", zap.String("Greeting", greeting))
	}
}

func GenerateGreetingMessage(ctx context.Context, language, name string) (string, error) {
	logger := activity.GetLogger(ctx)
	logger.Info("GenerateGreetingMessage started")
	var greeting string
	if language == "english" {
		greeting = "Hello"
	}
	if language == "spanish" {
		greeting = "Hola"
	}
	if language == "french" {
		greeting = "bonjour"
	}
	if greeting == "" {
		return "", errors.New("currently only support english, spanish and french")
	}
	return fmt.Sprintf("%s %s!", greeting, name), nil
}
