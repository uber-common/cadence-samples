import config from '../server/config';

const baseApiUrl = `${config.server.protocol}://${config.server.hostname}:${config.server.port}`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    console.log('error = ', data.message);
    throw new Error(data.message);
  }
  return data;
};

const ProductService = {
  approveProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/approve`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },

  createProduct: async (product) => {
    const response = await fetch(`${baseApiUrl}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(product),
    });
    return handleResponse(response);
  },

  fetchProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  rejectProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/reject`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },

  submitProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/submit`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },

  updateProductDescription: async ({ description, id }) => {
    const response = await fetch(`${baseApiUrl}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description }),
    });
    return handleResponse(response);
  },

  withdrawProduct: async (productId) => {
    const response = await fetch(`${baseApiUrl}/products/${productId}/withdraw`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },
};

export default ProductService;
