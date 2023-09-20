package main

import (
	"github.com/uber-common/cadence-samples/new_samples/worker"
	"github.com/uber-common/cadence-samples/new_samples/workflows"
	"go.uber.org/cadence/activity"
	"go.uber.org/cadence/workflow"
	"log"
	"net/http"
)

func init() {
	// HelloWorld workflow
	workflow.RegisterWithOptions(workflows.HelloWorldWorkflow, workflow.RegisterOptions{Name: "cadence_samples.HelloWorldWorkflow"})
	activity.RegisterWithOptions(workflows.HelloWorldActivity, activity.RegisterOptions{Name: "cadence_samples.HelloWorldActivity"})
}

func main() {
	worker.StartWorker()
	log.Println("Cadence worker service started at port: 3000")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatalf("cadence server bootstrap failed: %v", err)
	}
}
