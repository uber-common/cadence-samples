import moment from 'moment';
import config from '../config.js';

const getPageFlowWorkflowExecution = async (cadence) => {
  const response = await cadence.openWorkflows({
    domain: config.cadence.domain,
    StartTimeFilter: {
      earliestTime: momentToLong(moment().subtract(30, 'days')),
      latestTime: momentToLong(moment()),
    }
  });

  // TODO - need a way to filter this list based on workflow type...

  return response.executions[0].execution;
};

export default getPageFlowWorkflowExecution;
