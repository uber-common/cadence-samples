import config from '../config.js';
import parseContent from './parseContent.js';

const getProduct = async ({ cadence, name }) => {
  const response = await cadence.queryWorkflow({
    domain: config.cadence.domain,
    execution: {
      workflowId: name,
    },
    query: {
      queryType: 'state',
      queryArgs: Buffer.from('true', 'utf8'),
    },
    queryConsistencyLevel: 'STRONG',
  });

  const product = {
    description: '',
    name,
    status: response.queryResult.State,
  };

  if (!response.queryResult.Content) {
    return product;
  }

  return {
    ...product,
    ...parseContent(response.queryResult.Content),
  };
};

export default getProduct;
