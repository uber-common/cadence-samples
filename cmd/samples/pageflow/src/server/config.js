const config = {
  server: {
    protocol: 'http',
    hostname: 'localhost',
    port: '4000'
  },
  cadence: {
    domain: 'samples-domain',
    retryDelay: 100,
    retryMax: 5,
    taskList: 'pageflow',
    workflowType: 'main.pageWorkflow',
  },
};

export default config;
