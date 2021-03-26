import { UnexpectedStatusError } from '../errors/index.js';
import parseContent from './parseContent.js';
import queryPageWorkflow from './queryPageWorkflow.js';
import signalPageWorkflow from './signalPageWorkflow.js';
import startPageFlowWorkflow from './startPageFlowWorkflow.js';
import waitTime from './waitTime.js';

const createProduct = async ({ cadence, description, name }) => {
  console.log('createProduct');

  const workflowExecution = await startPageFlowWorkflow(cadence);
  console.log('workflowExecution = ', workflowExecution);

  await signalPageWorkflow({
    action: 'create',
    cadence,
    content: '',
    workflowExecution,
  });

  await waitTime(1000);

  const createQueryResponse = await queryPageWorkflow({ cadence, workflowExecution });

  console.log('createQueryResponse = ', createQueryResponse);

  if (createQueryResponse.queryResult.State !== 'created') {
    throw new UnexpectedStatusError(queryResponse.queryResult.State);
  }

  const product = {
    description,
    id: `${workflowExecution.workflowId}_${workflowExecution.runId}`,
    name,
  };

  await signalPageWorkflow({
    action: 'save',
    cadence,
    content: JSON.stringify(product),
    workflowExecution,
  });

  await waitTime(1000);

  const saveQueryResponse = await queryPageWorkflow({ cadence, workflowExecution });

  console.log('saveQueryResponse = ', saveQueryResponse);

  const cadenceProduct = parseContent(saveQueryResponse.queryResult.Content);
  cadenceProduct.status = saveQueryResponse.queryResult.State;

  console.log('cadenceProduct = ', cadenceProduct);

  return cadenceProduct;
};

export default createProduct;
