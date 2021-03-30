import getProduct from './getProduct.js';
import signalAndGetProduct from './signalAndGetProduct.js';

const updateProductDescription = async ({ cadence, description, name }) => {
  const product = await getProduct({ cadence, name });

  if (product.status === 'initialized') {
    await signalAndGetProduct({
      cadence,
      content: '',
      name,
      state: 'create',
    });
  }

  return signalAndGetProduct({
    cadence,
    content: JSON.stringify({ description }),
    name,
    state: 'save',
  });
};

export default updateProductDescription;
