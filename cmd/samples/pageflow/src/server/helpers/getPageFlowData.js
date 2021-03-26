import moment from 'moment';
import config from '../config.js';

const getPageFlowData = async ({ cadence, id }) => {
  const workflowExecution = {
    workflowId: id,
  };
  const saveQueryResponse = await queryPageWorkflow({ cadence, workflowExecution });

  // TODO - need a way to filter this list based on workflow type...

  return response.executions[0].execution;
};

export default getPageFlowData;
