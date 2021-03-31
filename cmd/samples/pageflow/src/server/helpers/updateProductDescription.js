import getProduct from './getProduct.js';
import signalAndGetProduct from './signalAndGetProduct.js';

const updateProductDescription = async ({ cadence, description, name }) => {
  const product = await getProduct({ cadence, name });

  if (product.status === 'initialized') {
    await signalAndGetProduct({
      cadence,
      name,
      state: 'create',
    });
  }

  return signalAndGetProduct({
    cadence,
    content: { description },
    name,
    state: 'save',
  });
};

export default updateProductDescription;
