var bitcoinjs = require('bitcoinjs-lib'),
  async = require('async'),
  http = require('http');

function sign_all (private_keys, message) {
  if(!Array.isArray(private_keys))
    throw new Error('private_keys must be an array');

  var res = { id: message, signatures: [] };

  private_keys.forEach(function (priv) {
    var bytes = bitcoinjs.base58.checkDecode(priv);

    var compressed = false;
    if (bytes.length > 32) {
      compressed = true;
    }

    var key = new bitcoinjs.ECKey(bytes, compressed);
    var addr = key.getBitcoinAddress().toString();

    var sig = bitcoinjs.Message.signMessage(key, message);

    res.signatures.push({
      address: addr,
      signature: sig
    });
  });

  return res;
}

function verify_signature (addr, sig, message) {
  var res = bitcoinjs.Message.verifyMessage(addr, sig, message);

  return res;
}

function verify_signatures (obj) {
  var message = obj.domain + '' + obj.id;
  for (var i = 0; i < obj.signatures.length; i++) {
    var addr = obj.signatures[i].address;
    var sig = obj.signatures[i].signature;

    if (!verify_signature(addr, sig, message))
      return false;
  }
  return true;
}

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
}

// This is the browser version since RPC calls not available
// We use the blockchain.info API
function get_balance (addresses, cb) {
  var total = 0;
  var parallel_ops = 5;

  async.eachLimit(addresses, parallel_ops, function (addr, cb) {
    http.get({
      host: 'blockchain.info',
      path : '/q/addressbalance/' + addr + '?format=json&cors=true&confirmations=6',
      scheme: 'http'
    }, function (res) {
      var data = '';

      res.on('data', function (buf) {
        data += buf;
      });

      res.on('end', function () {
        total += Number(data);
        cb();
      });
    }).on('error', cb);
  }, function (err) {
    // Total is in satoshis! Convert to BTC.
    // (btc has 8 decimals)
    total = total / 1e8;
    cb(err, total);
  });
}

module.exports.signAll = sign_all;
module.exports.verifySignatures = verify_signatures;
module.exports.getBalance = get_balance;
module.exports.getAddresses = get_addresses;
