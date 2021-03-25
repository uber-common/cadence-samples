import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import { v4 as uuidv4 } from 'uuid';
import config from './config.js';

const server = fastify({ logger: true });

const products = {};

server.register(fastifyCors);

// helpers

const getProduct = (productId) => {
  const product = products[productId];

  if (!product) {
    throw new Error(`Could not find product with id "${productId}".`);
  }

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

    const product = {
      description: request.body.description,
      id: uuidv4(),
      name: request.body.name,
      status: 'DRAFT',
    };

    products[product.id] = product;

    return product;
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
      return response.code(400).send(error);
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
      const product = getProduct(productId);
      product.description = request.body.description;
      return product;
    } catch (error) {
      return response.code(404).send(error);
    }
  },
});

// only allow SUBMITTED status to move to APPROVED status
server.route({
  method: 'PUT',
  url: '/products/:productId/approve',
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

      if (!['SUBMITTED'].includes(product.status)) {
        return response.code(400).send(new Error(`Unexpected status "${product.status}".`));
      }

      product.status = 'APPROVED';
      return product;
    } catch (error) {
      return response.code(404).send(error);
    }
  },
});

// only allow SUBMITTED status to move to REJECTED status
server.route({
  method: 'PUT',
  url: '/products/:productId/reject',
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

      if (!['SUBMITTED'].includes(product.status)) {
        return response.code(400).send(new Error(`Unexpected status "${product.status}".`));
      }

      product.status = 'REJECTED';
      return product;
    } catch (error) {
      return response.code(404).send(error);
    }
  },
});

// only allow DRAFT, REJECTED, WITHDRAWN status to move to SUBMITTED status
server.route({
  method: 'PUT',
  url: '/products/:productId/submit',
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

      if (!['DRAFT', 'REJECTED', 'WITHDRAWN'].includes(product.status)) {
        return response.code(400).send(new Error(`Unexpected status "${product.status}".`));
      }

      product.status = 'SUBMITTED';
      return product;
    } catch (error) {
      return response.code(404).send(error);
    }
  },
});

// only allow SUBMITTED status to move to WITHDRAWN status
server.route({
  method: 'PUT',
  url: '/products/:productId/withdraw',
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

      if (!['SUBMITTED'].includes(product.status)) {
        return response.code(400).send(new Error(`Unexpected status "${product.status}".`));
      }

      product.status = 'WITHDRAWN';
      return product;
    } catch (error) {
      return response.code(404).send(error);
    }
  },
});



const start = async () => {
  try {
    await server.listen(config.server.port);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
