const config = {
  server: {
    protocol: 'http',
    hostname: 'localhost',
    port: '4000'
  },
  cadence: {
    domain: 'samples-domain',
    taskList: 'pageflow',
    workflowType: 'main.pageWorkflow',
  },
};

export default config;
