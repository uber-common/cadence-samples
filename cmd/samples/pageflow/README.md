This workflow demonstrates how to use Cadence workflow to power UI application through a series of state transitions.

The artificial use case started by creating a proposal workflow, and then going through content revision, approval/rejection phases.

User interactions are implemented through workflow signals, and the latest workflow state can be fetched through workflow query.

# Steps to run locally
### `npm install`
Make sure you are running at least node v14 and install dependencies. May take a while for the first time installing these packages.

### `npm start`
This command will start the complete stack. You will need cadence server running locally separately. Alternatively you can run the commands individually below (for debugging purposes).

### `npm start-server`
This will start the backend node server. The frontend website will directly communicate with the node server. All traffic will then query a local instance of cadence-server.

### `npm start-worker`
This will start the pageflow worker. This is needed to be running in order for the node server to trigger signals to this worker.

## `src/server/config.js`
This config contains node server details & cadence server connection details. This can be modified if running cadence in a different port number.
