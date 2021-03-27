import {
  ALLOWED_ACTION_ON_STATUS_MAP,
} from '../constants.js';
import getProduct from './getProduct.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import waitTime from './waitTime.js';

const updateProductState = async ({ action, cadence, name }) => {
  const product = await getProduct({ cadence, name });

  if (!ALLOWED_ACTION_ON_STATUS_MAP[action].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  await signalPageWorkflow({
    action,
    cadence,
    content: '',
    name,
  });

  await waitTime(100);

  return getProduct({ cadence, name });
};

export default updateProductState;
