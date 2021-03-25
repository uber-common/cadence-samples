import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import middie from 'middie';
import { v4 as uuidv4 } from 'uuid';
import config from './config.js';
import cadenceMiddleware from './cadence/TChannelClient.js';

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

const createProduct = ({ description, name }) => {
  // TODO - communicate with cadence-server to fetch product information from workflow.

  const product = {
    description,
    id: uuidv4(),
    name,
    status: 'DRAFT',
  };

  products[product.id] = product;

  return product;
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
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    try {
      const product = createProduct({
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
      const product = getProduct(productId);
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
      const product = updateProductDescription({
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
      const product = updateProductState({
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

  try {
    await server.listen(config.server.port);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
