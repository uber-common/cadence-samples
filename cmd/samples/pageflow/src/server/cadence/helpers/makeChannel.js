import path from 'path';
import TChannelAsThrift from 'tchannel/as/thrift';
import getIPPeers from './getIPPeers.js';

const makeChannel = async (client) => {
  const ipPeers = await getIPPeers();

  const cadenceChannel = client.makeSubChannel({
    serviceName: 'cadence-frontend',
    peers: ipPeers,
    requestDefaults: {
      hasNoParent: true,
      headers: { as: 'raw', cn: 'cadence-web' },
    },
  });

  // TODO - adjust path to idl file...
  const tchannelAsThrift = TChannelAsThrift({
    channel: cadenceChannel,
    entryPoint: path.join(__dirname, '../idl/cadence.thrift'),
  });

  return tchannelAsThrift;
};

export default makeChannel;
