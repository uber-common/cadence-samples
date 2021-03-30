import get from 'lodash.get';
import fastify from 'fastify';
import fastifyCors from 'fastify-cors';
import middie from 'middie';
import config from './config.js';
import initRouter from './router.js';
import cadenceMiddleware from './cadence/TChannelClient.js';

const server = fastify({ logger: true });
server.register(fastifyCors);

initRouter(server);

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
