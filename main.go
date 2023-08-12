package main

import (
	"github.com/uber-common/cadence-samples/worker"
	"log"
	"net/http"
)

func main() {
	worker.StartWorker()
	log.Println("Cadence worker service started at port: 3000")
	err := http.ListenAndServe(":3000", nil)
	if err != nil {
		log.Fatalf("cadence server bootstrap failed: %v", err)
	}
}
