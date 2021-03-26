import getProduct from './getProduct.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import waitTime from './waitTime.js';

const updateProductDescription = async ({ cadence, description, name }) => {
  const product = await getProduct({ cadence, name });

  if (product.status === 'initialized') {
    await signalPageWorkflow({
      action: 'create',
      cadence,
      content: '',
      name,
    });

    await waitTime(100);
  }

  await signalPageWorkflow({
    action: 'save',
    cadence,
    content: JSON.stringify({ description }),
    name,
  });

  return getProduct({ cadence, name });
};

export default updateProductDescription;
