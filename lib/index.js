var bitcoinjs = require('bitcoinjs-lib'),
  async = require('async'),
  http = require('http');

function sign_all (private_keys, message, blockhash, currency) {
  currency = currency || 'BTC';
  if(!Array.isArray(private_keys))
    throw new Error('private_keys must be an array');

  var res = { message: message, blockhash: blockhash, currency: currency, signatures: [] };

  var message = (blockhash) ? blockhash + '|' + message : message;

  private_keys.forEach(function (priv) {
    var bytes = bitcoinjs.base58.checkDecode(priv);

    var compressed = false;
    if (bytes.length > 32) {
      compressed = true;
    }

    var key = new bitcoinjs.ECKey(bytes, compressed);
    var addr = key.getBitcoinAddress().toString();

    var sig = bitcoinjs.Message.sign(key, message);

    res.signatures.push({
      address: addr,
      signature: sig
    });
  });

  return res;
}

function verify_signature (addr, sig, message, network) {
  var res = bitcoinjs.Message.verify(addr, sig, message, network);

  return res;
}

function get_network(currency, testnet){
	var network = bitcoinjs.networks.bitcoin
	if(currency === 'BTC'){
		if(obj.testnet){
			network = bitcoinjs.networks.testnet
		}	  
	} else if(currency === 'LTC'){
		if(obj.testnet){
			network = bitcoinjs.networks.litecointestnet
		} else {
			network = bitcoinjs.networks.litecoin  
		}
	} else if(currency === 'DOGE'){
		if(obj.testnet){
			network = bitcoinjs.networks.dogecointestnet
		} else {
			network = bitcoinjs.networks.dogecoin  
		}  
	} else {
		assert(false)
	}	
}

function verify_signatures (obj) {
  var message = obj.blockhash ? obj.blockhash + '|' + obj.message : obj.message;
  var currency = obj.currency || 'BTC'
  
  var network = get_network(currency, obj.testnet);
  for (var i = 0; i < obj.signatures.length; i++) {
    var addr = obj.signatures[i].address;
    var sig = obj.signatures[i].signature;

    if (!verify_signature(addr, new Buffer(sig, 'base64'), message, network))
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

  // @TODO error handling when blockchain is down
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
