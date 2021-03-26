import { v4 as uuidv4 } from 'uuid';
import config from '../config.js';

const startPageFlowWorkflow = async ({ cadence, name }) => {
  try {
    return cadence.startWorkflow({
      domain: config.cadence.domain,
      executionStartToCloseTimeoutSeconds: 10 * 60, // workflow open for 10 minutes
      requestId: uuidv4(),
      taskList: {
        name: config.cadence.taskList,
      },
      taskStartToCloseTimeoutSeconds: 10,
      workflowId: name,
      workflowType: {
        name: config.cadence.workflowType,
      },
    });
  } catch (e) {
    throw new NameExistsError(name);
  }
};

export default startPageFlowWorkflow;
