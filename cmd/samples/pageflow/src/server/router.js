import {
  createProduct,
  getProduct,
  handleError,
  updateProductDescription,
  updateProductState,
} from './helpers/index.js';

const initRouter = (server) => {
  // TODO - integrate with cadence-web router instead.

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
      try {
        console.log('router: create');
        const product = await createProduct({
          cadence: request.raw.data.cadence,
          description: request.body.description,
          name: request.body.name,
        });
        return product;
      } catch (error) {
        return handleError({ error, response });
      }
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
        const product = await getProduct(productId);
        return product;
      } catch (error) {
        return handleError({ error, response });
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
        const product = await updateProductDescription({
          description: request.body.description,
          id: productId,
        });
        return product;
      } catch (error) {
        return handleError({ error, response });
      }
    },
  });

  server.route({
    method: 'PUT',
    url: '/products/:productId/:action',
    schema: {
      params: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['approve', 'reject', 'submit', 'withdraw']
          },
          productId: { type: 'string' },
        },
        required: ['action', 'productId'],
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

      const { action, productId: id } = request.params;

      try {
        const product = await updateProductState({
          id,
          action,
        });
        return product;
      } catch (error) {
        return handleError({ error, response });
      }
    },
  });

};

export default initRouter;
