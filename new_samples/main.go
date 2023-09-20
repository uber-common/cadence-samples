package main

import "github.com/uber-common/cadence-samples/new_samples/worker"

func main() {
	for {
		worker.StartWorker()
	}
}
