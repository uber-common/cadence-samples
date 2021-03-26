import config from '../config.js';

const queryPageWorkflow = async ({ cadence, workflowExecution }) => {
  console.log('here:', workflowExecution);
  return cadence.queryWorkflow({
    domain: config.cadence.domain,
    execution: workflowExecution,
    query: {
      queryType: 'state',
      queryArgs: Buffer.from('true', 'utf8'),
    },
  });
};

export default queryPageWorkflow;
