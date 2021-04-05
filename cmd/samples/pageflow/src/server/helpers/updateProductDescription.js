import getProduct from './getProduct.js';
import signalAndGetProduct from './signalAndGetProduct.js';
import { STATE_CREATE, STATE_SAVE } from '../constants.js';

const updateProductDescription = async ({ cadence, description, name }) => {
  const product = await getProduct({ cadence, name });

  if (product.status === 'initialized') {
    await signalAndGetProduct({
      cadence,
      name,
      state: STATE_CREATE,
    });
  }

  return signalAndGetProduct({
    cadence,
    content: { description },
    name,
    state: STATE_SAVE,
  });
};

export default updateProductDescription;
