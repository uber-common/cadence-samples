import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import Long from 'long';
import middie from 'middie';
import moment from 'moment';
import { v4 as uuidv4 } from 'uuid';
import config from './config.js';
import cadenceMiddleware from './cadence/TChannelClient.js';

const momentToLong = m => Long.fromValue(m.unix()).mul(1000000000);

const server = fastify({ logger: true });
server.register(fastifyCors);

// TODO - remove once integrated with cadence-server.
const products = {};

const ALLOWED_ACTION_ON_STATUS_MAP = {
  approve: ['SUBMITTED'],
  reject: ['SUBMITTED'],
  submit: ['DRAFT', 'REJECTED', 'WITHDRAWN'],
  withdraw: ['SUBMITTED'],
};

const ACTION_TO_STATUS_MAP = {
  approve: 'APPROVED',
  reject: 'REJECTED',
  submit: 'SUBMITTED',
  withdraw: 'WITHDRAWN',
};

// errors

class NotFoundError extends Error {
  constructor(id) {
    super();
    this.code = '404';
    this.message = `Could not find product with id '${id}'.`;
    this.name = 'NotFoundError';
  }
}

class UnexpectedStatusError extends Error {
  constructor(status) {
    super();
    this.code = '400';
    this.message = `Unexpected status '${status}'.`
    this.name = 'UnexpectedStatusError';
  }
}

// helpers

const startPageFlowWorkflow = async (cadence) => {
  const workflowId = `${config.cadence.taskList}_${uuidv4()}`;

  const response = await cadence.startWorkflow({
    domain: config.cadence.domain,
    executionStartToCloseTimeoutSeconds: 60,
    requestId: uuidv4(),
    taskList: {
      name: config.cadence.taskList,
    },
    taskStartToCloseTimeoutSeconds: 10,
    workflowId: workflowId,
    workflowType: {
      name: config.cadence.workflowType,
    },
  });

  const { runId } = response;
  return {
    workflowId,
    runId,
  };
};

const getPageFlowWorkflowExecution = async (cadence) => {
  const response = await cadence.openWorkflows({
    domain: config.cadence.domain,
    StartTimeFilter: {
      earliestTime: momentToLong(moment().subtract(30, 'days')),
      latestTime: momentToLong(moment()),
    }
  });

  // TODO - need a way to filter this list based on workflow type...

  return response.executions[0].execution;
};

const signalPageWorkflow = ({ action, cadence, content, workflowExecution }) => {
  const input = {
    Action: action,
    Content: content,
  };

  return cadence.signalWorkflow({
    domain: config.cadence.domain,
    workflowExecution,
    signalName: 'trigger-signal',
    input: Buffer.from(JSON.stringify(input), 'utf8'),
  });
};

const queryPageWorkflow = async ({ cadence, workflowExecution }) => {
  console.log('here:', workflowExecution);
  return cadence.queryWorkflow({
    domain: config.cadence.domain,
    workflowExecution,
    query: 'state',
  });
};

const createProduct = async ({ cadence, description, name }) => {


  const workflowExecution = await startPageFlowWorkflow(cadence);
  console.log('workflowExecution = ', workflowExecution);

  const product = {
    description,
    name,
  };

  await signalPageWorkflow({
    action: 'create',
    cadence,
    content: product,
    workflowExecution,
  });

  const queryResult = await queryPageWorkflow({ cadence, workflowExecution });

  console.log('queryResult = ', queryResult);

  // TODO - need to query workflow here...

  return {};
};

const getProduct = (id) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.
  const product = products[id];

  if (!product) {
    throw new NotFoundError(id);
  }

  return product;
};

const handleError = ({ error, response }) => {
  return response.code(error.code || '500').send(JSON.stringify(error));
};

const updateProductDescription = ({ description, id }) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.

  const product = getProduct(id);
  product.description = description;
  return product;
};

const updateProductState = ({ action, id }) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.

  const product = getProduct(id);

  if (!ALLOWED_ACTION_ON_STATUS_MAP[action].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  product.status = ACTION_TO_STATUS_MAP[action];
  return product;
};

// routes

server.route({
  method: 'POST',
  url: '/products',
  schema: {
    body: {
      type: 'object',
      properties: {
        description: {
          minLength: 1,
          type: 'string',
        },
        name: {
          minLength: 1,
          type: 'string',
        },
      },
      required: ['description', 'name'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, response) => {
    try {
      const product = await createProduct({
        cadence: request.raw.data.cadence,
        description: request.body.description,
        name: request.body.name,
      });
      return product;
    } catch (error) {
      return handleError({ error, response });
    }
  }
});

server.route({
  method: 'GET',
  url: '/products/:productId',
  schema: {
    params: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
      },
      required: ['productId'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, response) => {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { productId } = request.params;

    try {
      const product = await getProduct(productId);
      return product;
    } catch (error) {
      return handleError({ error, response });
    }
  }
});

// only allow editing of description.
server.route({
  method: 'PUT',
  url: '/products/:productId',
  schema: {
    body: {
      type: 'object',
      properties: {
        description: {
          minLength: 1,
          type: 'string',
        },
      },
      required: ['description'],
    },
    params: {
      type: 'object',
      properties: {
        productId: { type: 'string' },
      },
      required: ['productId'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, response) => {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { productId } = request.params;

    try {
      const product = await updateProductDescription({
        description: request.body.description,
        id: productId,
      });
      return product;
    } catch (error) {
      return handleError({ error, response });
    }
  },
});

server.route({
  method: 'PUT',
  url: '/products/:productId/:action',
  schema: {
    params: {
      type: 'object',
      properties: {
        action: {
          type: 'string',
          enum: ['approve', 'reject', 'submit', 'withdraw']
        },
        productId: { type: 'string' },
      },
      required: ['action', 'productId'],
    },
    response: {
      200: {
        type: 'object',
        properties: {
          description: { type: 'string' },
          id: { type: 'string' },
          name: { type: 'string' },
          status: { type: 'string' },
        },
      },
      400: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
      404: {
        type: 'object',
        properties: {
          message: { type: 'string' },
        },
      },
    },
  },
  handler: async (request, response) => {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const { action, productId: id } = request.params;

    try {
      const product = await updateProductState({
        id,
        action,
      });
      return product;
    } catch (error) {
      return handleError({ error, response });
    }
  },
});

const start = async () => {
  await server.register(middie);

  server.use(cadenceMiddleware);

  server.addHook('onResponse', (request, reply, done) => {
    if (
      request.raw.data &&
      request.raw.data.client &&
      request.raw.data.client.close) {
      request.raw.data.client.close();
    }
    done();
  });

  try {
    await server.listen(config.server.port);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
