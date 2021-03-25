import isIPv4 from 'is-ipv4-node';

const peers = process.env.CADENCE_TCHANNEL_PEERS
  ? process.env.CADENCE_TCHANNEL_PEERS.split(',')
  : ['127.0.0.1:7933'];

const getIPPeers = () => {
  const ipPeers = await Promise.all(
    peers.map(peer => {
      const [host, port] = peer.split(':');

      if (!isIPv4(host)) {
        return lookupAsync(host).then(ip => [ip, port].join(':'));
      } else {
        return peer;
      }
    })
  );
  return ipPeers;
};

export default getIPPeers;
