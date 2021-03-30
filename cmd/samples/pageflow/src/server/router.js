import {
  createProduct,
  getProduct,
  handleError,
  updateProductDescription,
  updateProductState,
} from './helpers/index.js';

const initRouter = (router) => {
  router.post('/api/products', async (ctx) => {
    const { cadence, request, response } = ctx;
    const { description, name } = request.body;

    try {
      const product = await createProduct({
        cadence,
        description,
        name,
      });
      return product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  router.get('/api/products/:name', async (ctx) => {
    const { cadence, request, response } = ctx;
    const { name } = request.params;

    try {
      const product = await getProduct({
        cadence,
        name,
      });
      return product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  // only allows editing of description.
  router.put('/api/products/:name', async (ctx) => {
    const { cadence, request, response } = ctx;
    const { description } = request.body;
    const { name } = request.params;

    try {
      const product = await updateProductDescription({
        cadence,
        description,
        name,
      });
      return product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

  router.put('/api/products/:name/:state', async (ctx) => {
    const { cadence, request, response } = ctx;
    const { name, state } = request.params;

    try {
      const product = await updateProductState({
        cadence,
        name,
        state,
      });
      return product;
    } catch (error) {
      return handleError({ ctx, error });
    }
  });

};

export default initRouter;
