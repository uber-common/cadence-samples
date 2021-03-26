import config from '../server/config';

const baseApiUrl = `${config.server.protocol}://${config.server.hostname}:${config.server.port}`;

const handleResponse = async (response) => {
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message);
  }
  return data;
};

const ProductService = {
  approveProduct: async (productName) => {
    const response = await fetch(`${baseApiUrl}/products/${productName}/approve`, {
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

  fetchProduct: async (productName) => {
    const response = await fetch(`${baseApiUrl}/products/${productName}`, {
      method: 'GET',
    });
    return handleResponse(response);
  },

  rejectProduct: async (productName) => {
    const response = await fetch(`${baseApiUrl}/products/${productName}/reject`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },

  submitProduct: async (productName) => {
    const response = await fetch(`${baseApiUrl}/products/${productName}/submit`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },

  updateProductDescription: async ({ description, name }) => {
    const response = await fetch(`${baseApiUrl}/products/${name}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ description }),
    });
    return handleResponse(response);
  },

  withdrawProduct: async (productName) => {
    const response = await fetch(`${baseApiUrl}/products/${productName}/withdraw`, {
      method: 'PUT',
    });
    return handleResponse(response);
  },
};

export default ProductService;
