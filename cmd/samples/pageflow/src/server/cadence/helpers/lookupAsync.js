import dns from 'dns';

const lookupAsync = host =>
  new Promise(function(resolve, reject) {
    dns.lookup(host, { family: 4 }, function(err, ip) {
      if (err) {
        reject(err);
      } else {
        resolve(ip);
      }
    });
  });

export default lookupAsync;
