import {
  ALLOWED_STATE_ON_STATUS_MAP,
} from '../constants.js';
import getProduct from './getProduct.js';
import signalAndGetProduct from './signalAndGetProduct.js';

const updateProductState = async ({ cadence, name, state }) => {
  const product = await getProduct({ cadence, name });

  if (!ALLOWED_STATE_ON_STATUS_MAP[state].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  return signalAndGetProduct({
    cadence,
    name,
    state,
  });
};

export default updateProductState;
