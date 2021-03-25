import config from '../server/config';

const baseApiUrl = `${config.server.protocol}://${config.server.hostname}:${config.server.port}`;

const ProductService = {
  approveProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/approve`, {
      method: 'PUT',
    });
    return response.json();
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

  fetchProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}`, {
      method: 'GET',
    });
    return response.json();
  },

  rejectProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/reject`, {
      method: 'PUT',
    });
    return response.json();
  },

  submitProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/submit`, {
      method: 'PUT',
    });
    return response.json();
  },

  updateProductDescription: async ({ description, id }) => {
    const response = await fetch(`${baseApiUrl}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description }),
    });
    return response.json();
  },

  withdrawProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/withdraw`, {
      method: 'PUT',
    });
    return response.json();
  },
};

export default ProductService;
