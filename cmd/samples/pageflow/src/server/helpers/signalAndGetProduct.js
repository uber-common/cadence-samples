import {
  EXPECTED_STATUS_FROM_STATE,
} from '../constants.js';
import config from '../config.js';
import encodeContent from './encodeContent.js';
import getProductOrRetry from './getProductOrRetry.js';

const signalAndGetProduct = async ({ cadence, content, name, state }) => {
  const input = {
    Action: state,
    Content: encodeContent(content),
  };

  await cadence.signalWorkflow({
    domain: config.cadence.domain,
    workflowExecution: {
      workflowId: name,
    },
    signalName: 'trigger-signal',
    input: Buffer.from(JSON.stringify(input), 'utf8'),
  });

  return getProductOrRetry({
    cadence,
    expectedStatus: EXPECTED_STATUS_FROM_STATE[state],
    name,
  });
};

export default signalAndGetProduct;
