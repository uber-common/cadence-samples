import config from '../config.js';
import getProduct from './getProduct.js';
import waitTime from './waitTime.js';

const { retryDelay, retryMax } = config.cadence;

const getProductOrRetry = async ({
  cadence,
  expectedStatus,
  name,
  retry = 0,
  status = ''
}) => {
  if (retry === retryMax) {
    throw new UnexpectedStatusError(status);
  }

  const product = await getProduct({ cadence, name });

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

export default getProductOrRetry;
