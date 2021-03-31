import config from '../config.js';
import parseContent from './parseContent.js';

const { domain } = config.cadence;

const getProduct = async ({ cadence, name }) => {
  const response = await cadence.queryWorkflow({
    domain,
    execution: {
      workflowId: name,
    },
    query: {
      queryType: 'state',
      queryArgs: Buffer.from('true', 'utf8'),
    },
    queryConsistencyLevel: 'STRONG',
  });

  const { Content, State } = response.queryResult;

  const product = {
    description: '',
    name,
    status: State,
  };

  if (!Content) {
    return product;
  }

  return {
    ...product,
    ...parseContent(Content),
  };
};

export default getProduct;
