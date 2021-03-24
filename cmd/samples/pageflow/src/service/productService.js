import config from '../server/config';

const baseApiUrl = `${config.server.protocol}://${config.server.hostname}:${config.server.port}`;

const ProductService = {
  approveProduct: productId => {
    // TODO
  },

  createProduct: async (product) => {
    const response = await fetch(`${baseApiUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },

  getProduct: productId => {
    // TODO
  },

  rejectProduct: productId => {
    // TODO
  },

  submitProduct: productId => {
    // TODO
  },

  updateProductDescription: ({ description, id }) => {
    // TODO
  },

  withdrawProduct: productId => {
    // TODO
  },
};

export default ProductService;
