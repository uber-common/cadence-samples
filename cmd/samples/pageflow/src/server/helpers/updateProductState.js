import {
  ALLOWED_STATE_ON_STATUS_MAP,
} from '../constants.js';
import getProduct from './getProduct.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import waitTime from './waitTime.js';

const updateProductState = async ({ cadence, name, state }) => {
  const product = await getProduct({ cadence, name });

  if (!ALLOWED_STATE_ON_STATUS_MAP[state].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  await signalPageWorkflow({
    cadence,
    content: '',
    name,
    state,
  });

  await waitTime(100);

  return getProduct({ cadence, name });
};

export default updateProductState;
