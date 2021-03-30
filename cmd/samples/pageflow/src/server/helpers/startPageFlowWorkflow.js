import { v4 as uuidv4 } from 'uuid';
import config from '../config.js';
import { NameExistsError } from '../errors/index.js';

const {
  domain,
  executionStartToCloseTimeoutSeconds,
  taskList,
  taskStartToCloseTimeoutSeconds,
  workflowType,
} = config.cadence;

const startPageFlowWorkflow = async ({ cadence, name }) => {
  try {
    return cadence.startWorkflow({
      domain,
      executionStartToCloseTimeoutSeconds,
      requestId: uuidv4(),
      taskList: {
        name: taskList,
      },
      taskStartToCloseTimeoutSeconds,
      workflowId: name,
      workflowType: {
        name: workflowType,
      },
    });
  } catch (e) {
    throw new NameExistsError(name);
  }
};

export default startPageFlowWorkflow;
