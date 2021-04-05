import getProduct from './getProduct.js';
import startPageFlowWorkflow from './startPageFlowWorkflow.js';

const createProduct = async ({ cadence, name }) => {
  await startPageFlowWorkflow({ cadence, name });
  return getProduct({ cadence, name });
};

export default createProduct;
