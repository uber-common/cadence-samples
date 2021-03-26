import { v4 as uuidv4 } from 'uuid';
import config from '../config.js';

const startPageFlowWorkflow = async (cadence) => {
  console.log('startPageFlowWorkflow');

  const workflowId = `${config.cadence.taskList}-${uuidv4()}`;

  console.log('workflowId = ', workflowId);

  const response = await cadence.startWorkflow({
    domain: config.cadence.domain,
    executionStartToCloseTimeoutSeconds: 60,
    requestId: uuidv4(),
    taskList: {
      name: config.cadence.taskList,
    },
    taskStartToCloseTimeoutSeconds: 10,
    workflowId: workflowId,
    workflowType: {
      name: config.cadence.workflowType,
    },
  });

  const { runId } = response;
  return {
    workflowId,
    runId,
  };
};

export default startPageFlowWorkflow;
