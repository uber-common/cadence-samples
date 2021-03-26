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

console.log('here???');

initRouter(server);

const start = async () => {
  console.log('start???');

  await server.register(middie);

  server.use(cadenceMiddleware);

  server.addHook('onResponse', (request, reply, done) => {
    console.log('onResponse called?');
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
