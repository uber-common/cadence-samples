import app from 'cadence-web/server/index.js';
import router from 'cadence-web/server/routes.js';
import initMiddleware from './middleware.js';
import initRouter from './router.js';
import config from './config.js';

const { port } = config.server;

const run = async () => {
  initRouter(router);
  initMiddleware(app);
  app.init({ useWebpack: false }).listen(port);
  console.log('node server up and listening on port ' + port);
};

run();
