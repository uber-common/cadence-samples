import {
  EXPECTED_STATUS_FROM_STATE,
  ALLOWED_STATE_ON_STATUS_MAP,
} from '../constants.js';
import config from '../config.js';
import getProduct from './getProduct.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import waitTime from './waitTime.js';

const { retryDelay, retryMax } = config.cadence;

const getProductOrRetry = async ({
  cadence,
  expectedStatus,
  name,
  retry = 0,
  status = ''
}) => {
  console.log('getProductOrRetry: ', expectedStatus, name, retry, status);
  if (retry === retryMax) {
    throw new UnexpectedStatusError(status);
  }

  const product = await getProduct({ cadence, name });
  console.log('getProduct = ', product);

  if (product.status !== expectedStatus) {
    await waitTime(retryDelay);
    return getProductOrRetry({
      cadence,
      expectedStatus,
      name,
      retry: retry + 1,
      status: product.status,
    });
  }

  return product;
};

const updateProductState = async ({ cadence, name, state }) => {
  const product = await getProduct({ cadence, name });
  const expectedStatus = EXPECTED_STATUS_FROM_STATE[state];

  if (!ALLOWED_STATE_ON_STATUS_MAP[state].includes(product.status)) {
    throw new UnexpectedStatusError(product.status);
  }

  await signalPageWorkflow({
    cadence,
    content: '',
    name,
    state,
  });

  return getProductOrRetry({ cadence, expectedStatus, name });
};

export default updateProductState;
