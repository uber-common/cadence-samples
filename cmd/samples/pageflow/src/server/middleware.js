import cors from '@koa/cors';

const initMiddleware = (app) => {
  app.use(cors());
};

export default initMiddleware;
