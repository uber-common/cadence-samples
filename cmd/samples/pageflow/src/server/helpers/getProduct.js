import config from '../config.js';
import parseContent from './parseContent.js';
import {
  STATE_QUERY_TYPE,
  STATE_QUERY_ARGS,
  STRONG_QUERY_CONSISTANCY,
} from '../constants.js';

const { domain } = config.cadence;

const getProduct = async ({ cadence, name }) => {
  const response = await cadence.queryWorkflow({
    domain,
    execution: {
      workflowId: name,
    },
    query: {
      queryType: STATE_QUERY_TYPE,
      queryArgs: STATE_QUERY_ARGS,
    },
    queryConsistencyLevel: STRONG_QUERY_CONSISTANCY,
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
