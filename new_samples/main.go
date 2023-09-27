package main

import (
	"fmt"
	"github.com/uber-common/cadence-samples/new_samples/worker"
	"os"
	"os/signal"
	"syscall"
)

func main() {
	worker.StartWorker()

	done := make(chan os.Signal, 1)
	signal.Notify(done, syscall.SIGINT, syscall.SIGTERM)
	fmt.Println("Cadence worker started, press ctrl+c to terminate...")
	<-done
}
