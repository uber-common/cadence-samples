import getProduct from './getProduct.js';
import startPageFlowWorkflow from './startPageFlowWorkflow.js';

const createProduct = async ({ cadence, name }) => {
  await startPageFlowWorkflow({ cadence, name });
  const product = await getProduct({ cadence, name });
  return product;
};

export default createProduct;
