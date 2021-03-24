import fastify from 'fastify';
import { v4 as uuidv4 } from 'uuid';

const server = fastify({ logger: true });

server.route({
  method: 'POST',
  url: '/products',
  schema: {
    body: {
      description: {
        minLength: 1,
        type: 'string',
      },
      name: {
        minLength: 1,
        type: 'string',
      },
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
    },
  },
  handler: async (request, reply) => {
    // artificial delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    return {
      description: request.body.description,
      id: uuidv4(),
      name: request.body.name,
      status: 'DRAFT',
    };
  }
});

server.get('/products/:productId', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

server.put('/products/:productId', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

server.put('/products/:productId/approve', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

server.put('/products/:productId/reject', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

server.put('/products/:productId/submit', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

server.put('/products/:productId/withdraw', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
});

const start = async () => {
  try {
    await server.listen(4000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
