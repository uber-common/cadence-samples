import config from '../config.js';
import parseContent from './parseContent.js';

const getProduct = async ({ cadence, name }) => {
  console.log('getProduct:', name, JSON.stringify(cadence.queryWorkflow));

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

  console.log('response:', response);

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
