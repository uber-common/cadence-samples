package main

import (
	"github.com/uber-common/cadence-samples/new_samples/worker"
	"go.uber.org/fx"
)

func main() {
	fx.New(
		fx.Invoke(worker.StartWorker),
	).Run()
}
