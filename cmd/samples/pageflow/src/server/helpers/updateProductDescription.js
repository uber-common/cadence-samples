import getProduct from './getProduct.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import waitTime from './waitTime.js';

const updateProductDescription = async ({ cadence, description, name }) => {
  const product = await getProduct({ cadence, name });

  if (product.status === 'initialized') {
    await signalPageWorkflow({
      cadence,
      content: '',
      name,
      state: 'create',
    });

    await waitTime(100);
  }

  await signalPageWorkflow({
    cadence,
    content: JSON.stringify({ description }),
    name,
    state: 'save',
  });

  return getProduct({ cadence, name });
};

export default updateProductDescription;
