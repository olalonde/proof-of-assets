var bitcoinjs = require('bitcoinjs-lib'),
    helloblock = require('helloblock-js')({network: 'bitcoin'});

function sign_all (private_keys, message, blockhash, currency, network) {
  currency = currency || 'XBT';
  if(!Array.isArray(private_keys))
    throw new Error('private_keys must be an array');

  var res = { message: message, blockhash: blockhash, currency: currency, signatures: [] };

  var message = (blockhash) ? blockhash + '|' + message : message;

  private_keys.forEach(function (priv) {
    var key = bitcoinjs.ECKey.fromWIF(priv);
    var addr = key.pub.getAddress(bitcoinjs.networks[network].pubKeyHash).toString();
    var sig = bitcoinjs.Message.sign(key, message, bitcoinjs.networks[network]).toString('hex');

    res.signatures.push({
      address: addr,
      signature: sig
    });
  });

  return res;
};

function verify_signatures (obj) {
  var message = obj.blockhash ? obj.blockhash + '|' + obj.message : obj.message;

  for (var i = 0; i < obj.signatures.length; i++) {
    var addr = obj.signatures[i].address;
    var sig = new Buffer(obj.signatures[i].signature, 'hex');

    if (!bitcoinjs.Message.verify(addr, sig, message))
      return false;
  }
  return true;
};

function get_addresses (obj) {
  var addresses = [];
  // remove duplicates. see http://stackoverflow.com/a/14740171/96855
  var dups = {};
  obj.signatures.forEach(function (hash) {
    if (dups[hash.address]) return;
    dups[hash.address] = true;
    addresses.push(hash.address);
  });
  return addresses;
};

// This is the browser version since RPC calls not available
// We use the blockchain.info API
function get_balance (addresses, callback) {
    var totalBalance = 0;
    helloblock.addresses.batchGet(addresses, {}, function(err, json) {
        if (err) return callback(err);
        json.forEach(function(address) {
            totalBalance += address.confirmedBalance;
        });
        // TODO - floating point
        totalBalance = totalBalance / 1e8;
        return callback(null, totalBalance);
    });
};

module.exports.signAll = sign_all;
module.exports.verifySignatures = verify_signatures;
module.exports.getAddresses = get_addresses;
module.exports.getBalance = get_balance;
