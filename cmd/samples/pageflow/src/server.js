import fastify from 'fastify';

const server = fastify({ logger: true });

server.post('/products', async (request, reply) => {
  // TODO

  // artificial delay
  await new Promise(resolve => setTimeout(resolve, 2000));

  return { hello: 'world' };
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

const start = async () => {
  try {
    await server.listen(4000);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
}

start();
