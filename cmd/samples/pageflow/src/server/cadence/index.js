


import TChannel from 'tchannel';

import { makeChannel } from './helpers';

const cadenceMiddleware = async (ctx, next) => {
  const client = TChannel();
  const channel = await makeChannel(client, ctx);
  const { authTokenHeaders = {} } = ctx;

  const req = (method, reqName, bodyTransform, resTransform) => {
    return body =>
      new Promise(function(resolve, reject) {
        try {
          channel
            .request({
              serviceName:
                process.env.CADENCE_TCHANNEL_SERVICE || 'cadence-frontend',
              timeout: 1000 * 60 * 5,
              retryFlags: { onConnectionError: true },
              retryLimit: Number(process.env.CADENCE_TCHANNEL_RETRY_LIMIT || 3),
            })
            .send(
              `WorkflowService::${method}`,
              {
                ...authTokenHeaders,
              },
              {
                [`${reqName ? reqName + 'R' : 'r'}equest`]:
                  typeof bodyTransform === 'function'
                    ? bodyTransform(body)
                    : body,
              },
              function(err, res) {
                try {
                  if (err) {
                    reject(err);
                  } else if (res.ok) {
                    resolve((resTransform || uiTransform)(res.body));
                  } else {
                    ctx.throw(
                      res.typeName === 'entityNotExistError' ? 404 : 400,
                      null,
                      res.body || res
                    );
                  }
                } catch (e) {
                  reject(e);
                }
              }
            );
        } catch (e) {
          reject(e);
        }
      });
  }

  const withDomainPaging = body =>
      Object.assign(
        {
          domain: ctx.params.domain,
          maximumPageSize: 100,
        },
        body
      ),
    withWorkflowExecution = body =>
      Object.assign(
        {
          domain: ctx.params.domain,
          execution: {
            workflowId: ctx.params.workflowId,
            runId: ctx.params.runId,
          },
        },
        body
      ),
    withVerboseWorkflowExecution = body =>
      Object.assign(
        {
          domain: ctx.params.domain,
          workflowExecution: {
            workflowId: ctx.params.workflowId,
            runId: ctx.params.runId,
          },
        },
        body
      ),
    withDomainAndWorkflowExecution = b =>
      Object.assign(withDomainPaging(b), withWorkflowExecution(b));

  ctx.cadence = {
    archivedWorkflows: req(
      'ListArchivedWorkflowExecutions',
      'list',
      withDomainPaging
    ),
    closedWorkflows: req(
      'ListClosedWorkflowExecutions',
      'list',
      withDomainPaging
    ),
    describeDomain: req('DescribeDomain', 'describe'),
    describeTaskList: req('DescribeTaskList'),
    describeWorkflow: req(
      'DescribeWorkflowExecution',
      'describe',
      withWorkflowExecution
    ),
    exportHistory: req(
      'GetWorkflowExecutionHistory',
      'get',
      withDomainAndWorkflowExecution,
      cliTransform
    ),
    getHistory: req(
      'GetWorkflowExecutionHistory',
      'get',
      withDomainAndWorkflowExecution
    ),
    listDomains: req('ListDomains', 'list'),
    listTaskListPartitions: req('ListTaskListPartitions'),
    listWorkflows: req('ListWorkflowExecutions', 'list', withDomainPaging),
    openWorkflows: req('ListOpenWorkflowExecutions', 'list', withDomainPaging),
    queryWorkflow: req('QueryWorkflow', 'query', withWorkflowExecution),
    signalWorkflow: req(
      'SignalWorkflowExecution',
      'signal',
      withVerboseWorkflowExecution
    ),
    terminateWorkflow: req(
      'TerminateWorkflowExecution',
      'terminate',
      withVerboseWorkflowExecution
    ),
  };

  try {
    await next();
    client.close();
  } catch (e) {
    client.close();
    throw e;
  }
};

export default cadenceMiddleware;