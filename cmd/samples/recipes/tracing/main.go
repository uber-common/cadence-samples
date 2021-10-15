package main

import (
	"flag"
	"fmt"
	"io"
	"time"

	"github.com/opentracing/opentracing-go"
	"github.com/pborman/uuid"
	"github.com/uber/jaeger-client-go"
	"github.com/uber/jaeger-client-go/config"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/worker"

	"github.com/uber-common/cadence-samples/cmd/samples/common"
)

// This needs to be done as part of a bootstrap step when the process starts.
// The workers are supposed to be long running.
func startWorkers(h *common.SampleHelper) {
	// Configure worker options.
	workerOptions := worker.Options{
		MetricsScope: h.WorkerMetricScope,
		Logger:       h.Logger,
		FeatureFlags: client.FeatureFlags{
			WorkflowExecutionAlreadyCompletedErrorEnabled: true,
		},
		Tracer: h.Tracer,
	}
	h.StartWorkers(h.Config.DomainName, ApplicationName, workerOptions)
}

func startWorkflow(h *common.SampleHelper) {
	workflowOptions := client.StartWorkflowOptions{
		ID:                              "helloworld_" + uuid.New(),
		TaskList:                        ApplicationName,
		ExecutionStartToCloseTimeout:    time.Minute,
		DecisionTaskStartToCloseTimeout: time.Minute,
	}
	h.StartWorkflow(workflowOptions, helloWorldWorkflowName, "Cadence")
}

func registerWorkflowAndActivity(
	h *common.SampleHelper,
) {
	h.RegisterWorkflowWithAlias(helloWorldWorkflow, helloWorldWorkflowName)
	h.RegisterActivity(helloWorldActivity)
}

func main() {
	tracer, closer := initJaeger("cadence-tracing-sample")
	defer closer.Close()
	
	var mode string
	flag.StringVar(&mode, "m", "trigger", "Mode is worker, trigger or shadower.")
	flag.Parse()

	var h common.SampleHelper
	h.Tracer = tracer
	h.SetupServiceConfig()

	switch mode {
	case "worker":
		registerWorkflowAndActivity(&h)
		startWorkers(&h)

		// The workers are supposed to be long running process that should not exit.
		// Use select{} to block indefinitely for samples, you can quit by CMD+C.
		select {}
	case "trigger":
		startWorkflow(&h)
	}
}

// initJaeger returns an instance of Jaeger Tracer that samples 100% of traces and logs all spans to stdout.
func initJaeger(service string) (opentracing.Tracer, io.Closer) {
	cfg := &config.Configuration{
		ServiceName: service,
		Sampler: &config.SamplerConfig{
			Type:  "const",
			Param: 1,
		},
		Reporter: &config.ReporterConfig{
			LogSpans: true,
		},
	}
	tracer, closer, err := cfg.NewTracer(config.Logger(jaeger.StdLogger))
	if err != nil {
		panic(fmt.Sprintf("ERROR: cannot init Jaeger: %v\n", err))
	}
	return tracer, closer
}
