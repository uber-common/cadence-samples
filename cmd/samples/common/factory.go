package common

import (
	"github.com/opentracing/opentracing-go"
	"github.com/uber-go/tally"
	"go.uber.org/cadence/client"
	"go.uber.org/cadence/encoded"
	"go.uber.org/cadence/workflow"
	"go.uber.org/yarpc"
	"go.uber.org/zap"
)

const (
	_cadenceClientName      = "cadence-client"
	_cadenceFrontendService = "cadence-frontend"
)

// WorkflowClientBuilder build client to cadence service
type WorkflowClientBuilder struct {
	hostPort       string
	dispatcher     *yarpc.Dispatcher
	domain         string
	clientIdentity string
	metricsScope   tally.Scope
	Logger         *zap.Logger
	ctxProps       []workflow.ContextPropagator
	dataConverter  encoded.DataConverter
	tracer         opentracing.Tracer
}

// NewBuilder creates a new WorkflowClientBuilder
func NewBuilder(logger *zap.Logger) *WorkflowClientBuilder {
	return &WorkflowClientBuilder{
		Logger: logger,
	}
}

// SetHostPort sets the hostport for the builder
func (b *WorkflowClientBuilder) SetHostPort(hostport string) *WorkflowClientBuilder {
	b.hostPort = hostport
	return b
}

// SetDomain sets the domain for the builder
func (b *WorkflowClientBuilder) SetDomain(domain string) *WorkflowClientBuilder {
	b.domain = domain
	return b
}

// SetClientIdentity sets the identity for the builder
func (b *WorkflowClientBuilder) SetClientIdentity(identity string) *WorkflowClientBuilder {
	b.clientIdentity = identity
	return b
}

// SetMetricsScope sets the metrics scope for the builder
func (b *WorkflowClientBuilder) SetMetricsScope(metricsScope tally.Scope) *WorkflowClientBuilder {
	b.metricsScope = metricsScope
	return b
}

// SetDispatcher sets the dispatcher for the builder
func (b *WorkflowClientBuilder) SetDispatcher(dispatcher *yarpc.Dispatcher) *WorkflowClientBuilder {
	b.dispatcher = dispatcher
	return b
}

// SetContextPropagators sets the context propagators for the builder
func (b *WorkflowClientBuilder) SetContextPropagators(ctxProps []workflow.ContextPropagator) *WorkflowClientBuilder {
	b.ctxProps = ctxProps
	return b
}

// SetDataConverter sets the data converter for the builder
func (b *WorkflowClientBuilder) SetDataConverter(dataConverter encoded.DataConverter) *WorkflowClientBuilder {
	b.dataConverter = dataConverter
	return b
}

// SetTracer sets the tracer for the builder
func (b *WorkflowClientBuilder) SetTracer(tracer opentracing.Tracer) *WorkflowClientBuilder {
	b.tracer = tracer
	return b
}

// BuildCadenceClient builds a client to cadence service
func (b *WorkflowClientBuilder) BuildCadenceClient() (client.Client, error) {
	service, err := b.BuildServiceClient()
	if err != nil {
		return nil, err
	}

	return client.NewClient(
		service,
		b.domain,
		&client.Options{
			Identity:           b.clientIdentity,
			MetricsScope:       b.metricsScope,
			DataConverter:      b.dataConverter,
			ContextPropagators: b.ctxProps,
			Tracer:             b.tracer,
			FeatureFlags: client.FeatureFlags{
				WorkflowExecutionAlreadyCompletedErrorEnabled: true,
			},
		}), nil
}

// BuildCadenceDomainClient builds a domain client to cadence service
func (b *WorkflowClientBuilder) BuildCadenceDomainClient() (client.DomainClient, error) {
	service, err := b.BuildServiceClient()
	if err != nil {
		return nil, err
	}

	return client.NewDomainClient(
		service,
		&client.Options{
			Identity:           b.clientIdentity,
			MetricsScope:       b.metricsScope,
			ContextPropagators: b.ctxProps,
			FeatureFlags: client.FeatureFlags{
				WorkflowExecutionAlreadyCompletedErrorEnabled: true,
			},
		},
	), nil
}
