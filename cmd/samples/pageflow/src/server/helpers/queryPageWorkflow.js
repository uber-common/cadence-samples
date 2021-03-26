import config from '../config.js';

const queryPageWorkflow = async ({ cadence, name }) => {
  console.log('queryPageWorkflow:', name);

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
    name: workflowExecution.workflowId,
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

export default queryPageWorkflow;
