import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import middie from 'middie';
import config from './config.js';
import initRouter from './router.js';
import cadenceMiddleware from './cadence/TChannelClient.js';

const server = fastify({ logger: true });
server.register(fastifyCors);

// TODO - remove once integrated with cadence-server.
const products = {};

initRouter(server);

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
