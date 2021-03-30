import {
  createProduct,
  getProduct,
  handleError,
  updateProductDescription,
  updateProductState,
} from './helpers/index.js';

const initRouter = (router) => {
  router.post('/api/products', async (ctx) => {
    const { cadence, request } = ctx;
    const { description, name } = request.body;

    try {
      const product = await createProduct({
        cadence,
        description,
        name,
      });
      ctx.body = product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  router.get('/api/products/:name', async (ctx) => {
    const { cadence, params } = ctx;
    const { name } = params;

    try {
      const product = await getProduct({
        cadence,
        name,
      });
      ctx.body = product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  // only allows editing of description.
  router.put('/api/products/:name', async (ctx) => {
    const { cadence, params, request } = ctx;
    const { description } = request.body;
    const { name } = params;

    try {
      const product = await updateProductDescription({
        cadence,
        description,
        name,
      });
      ctx.body = product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  router.put('/api/products/:name/:state', async (ctx) => {
    const { cadence, params } = ctx;
    const { name, state } = params;

    try {
      const product = await updateProductState({
        cadence,
        name,
        state,
      });
      ctx.body = product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

};

export default initRouter;
