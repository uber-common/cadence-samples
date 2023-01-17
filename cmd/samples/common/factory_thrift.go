//go:build !grpc

package common

import (
	"errors"

	"go.uber.org/cadence/.gen/go/cadence/workflowserviceclient"
	"go.uber.org/yarpc"
	"go.uber.org/yarpc/transport/tchannel"
	"go.uber.org/zap"
)

// BuildServiceClient builds a rpc service client to cadence service
func (b *WorkflowClientBuilder) BuildServiceClient() (workflowserviceclient.Interface, error) {
	if err := b.build(); err != nil {
		return nil, err
	}

	if b.dispatcher == nil {
		b.Logger.Fatal("No RPC dispatcher provided to create a connection to Cadence Service")
	}

	clientConfig := b.dispatcher.ClientConfig(_cadenceFrontendService)
	return workflowserviceclient.New(clientConfig), nil
}

func (b *WorkflowClientBuilder) build() error {
	if b.dispatcher != nil {
		return nil
	}

	if len(b.hostPort) == 0 {
		return errors.New("HostPort is empty")
	}

	b.Logger.Debug("Creating RPC dispatcher outbound",
		zap.String("ServiceName", _cadenceFrontendService),
		zap.String("HostPort", b.hostPort))

	ch, err := tchannel.NewChannelTransport(tchannel.ServiceName(_cadenceFrontendService))
	if err != nil {
		panic("Failed to setup tchannel")
	}

	b.dispatcher = yarpc.NewDispatcher(yarpc.Config{
		Name: _cadenceClientName,
		Outbounds: yarpc.Outbounds{
			_cadenceFrontendService: {
				Unary: ch.NewSingleOutbound(b.hostPort),
			},
		},
	})

	if b.dispatcher != nil {
		if err := b.dispatcher.Start(); err != nil {
			b.Logger.Fatal("Failed to create outbound transport channel: %v", zap.Error(err))
		}
	}

	return nil
}
