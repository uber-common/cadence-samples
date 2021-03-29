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
          name: {
            minLength: 1,
            type: 'string',
          },
        },
        required: ['name'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            description: { type: 'string' },
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
    url: '/products/:productName',
    schema: {
      params: {
        type: 'object',
        properties: {
          productName: { type: 'string' },
        },
        required: ['productName'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            description: { type: 'string' },
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
      const { productName } = request.params;

      try {
        const product = await getProduct({
          cadence: request.raw.data.cadence,
          name: productName,
        });
        return product;
      } catch (error) {
        // console.log('error = ', error);
        return handleError({ error, response });
      }
    }
  });

  // only allow editing of description.
  server.route({
    method: 'PUT',
    url: '/products/:productName',
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
          productName: { type: 'string' },
        },
        required: ['productName'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            description: { type: 'string' },
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
      const { productName } = request.params;

      try {
        const product = await updateProductDescription({
          cadence: request.raw.data.cadence,
          description: request.body.description,
          name: productName,
        });
        return product;
      } catch (error) {
        return handleError({ error, response });
      }
    },
  });

  server.route({
    method: 'PUT',
    url: '/products/:productName/:action',
    schema: {
      params: {
        type: 'object',
        properties: {
          action: {
            type: 'string',
            enum: ['approve', 'reject', 'submit', 'withdraw']
          },
          productName: { type: 'string' },
        },
        required: ['action', 'productName'],
      },
      response: {
        200: {
          type: 'object',
          properties: {
            description: { type: 'string' },
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
      const { action, productName: name } = request.params;

      try {
        const product = await updateProductState({
          cadence: request.raw.data.cadence,
          name,
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
