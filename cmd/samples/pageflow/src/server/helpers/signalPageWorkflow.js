import config from '../config.js';

const signalPageWorkflow = ({ action, cadence, content, workflowExecution }) => {
  const input = {
    Action: action,
    Content: JSON.stringify(content),
  };

  return cadence.signalWorkflow({
    domain: config.cadence.domain,
    workflowExecution,
    signalName: 'trigger-signal',
    input: Buffer.from(JSON.stringify(input), 'utf8'),
  });
};

export default signalPageWorkflow;
