This sample shows how to use search attributes. (Note this feature only works when running Cadence with ElasticSearch)

Steps to run this sample:
1) You need a cadence service with Elasticsearch running. The easiest way is by running:
```
docker-compose -f docker-compose-es.yml up
```

For details, see https://github.com/uber/cadence/blob/master/docker/README.md

2) Run the following command to start worker
```
./bin/searchattributes -m worker
```
3) Run the following command to trigger a workflow execution. You should see workflowID and runID print out on screen.
```
./bin/searchattributes -m trigger
```
