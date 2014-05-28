var querystring = require('querystring');
var request = require('request');
var bitcoinjs = require('bitcoinjs-lib');


function signAll(type, keys, message, blockhash, currency, network, requiredSignatures, latestIndex) {
    if(!Array.isArray(keys))
        throw new Error('privateKeys must be an array');
    if (type === 'jbok') {
        return _signAllJbok(keys, message, blockhash, currency, network);
    } else if (type === 'bip32') {
        return _signAllBip32(keys, message, blockhash, currency, network, requiredSignatures, latestIndex);
    } else {
        throw new Error('type must be either jbok or bip32');
    }
};

function verifySignatures(obj) {
    if (obj.type === 'jbok') {
        return _verifyJbok(obj);
    } else if (obj.type === 'bip32') {
        return _verifyBip32(obj);
    } else {
        throw new Error('type must be either jbok or bip32');
    }
};

function getAddresses(obj) {
    if (obj.type === 'jbok') {
        return _getAddressesJbok(obj);
    } else if (obj.type === 'bip32') {
        return _getAddressesBip32(obj);
    } else {
        throw new Error('type must be either jbok or bip32');
    }
};

// This is the browser version since RPC calls not available
// We use the blockchain.info API
function getBalance (addresses, network, callback) {
    var totalBalance = 0;
    var requestString = null;

    if (network === 'bitcoin') {
        requestString = 'https://api.helloblock.io/v1/addresses?addresses=' + addresses.toString().replace(/,/g , '&addresses=');
    } else {
        requestString = 'https://' + network + '.helloblock.io/v1/addresses?addresses=' + addresses.toString().replace(/,/g , '&addresses=');
    }

    request(requestString, {json:true}, function(err, res, json) {
        if (err) return callback(err);
        if (json.status !== 'success') return callback(json);

        json.data.addresses.forEach(function(address) {
            totalBalance += address.confirmedBalance;
        });
        // TODO - floating point
        totalBalance = totalBalance / 1e8;
        return callback(null, totalBalance);
    });
};

function _signAllJbok(privateKeys, message, blockhash, currency, network) {
    var res = { type: 'jbok', message: message, blockhash: blockhash, currency: currency, network: network, signatures: [] };
    var message = (blockhash) ? blockhash + '|' + message : message;

    privateKeys.forEach(function (priv) {
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

function _signAllBip32(xprivKeys, message, blockhash, currency, network, requiredSignatures, latestIndex) {
    var res = { type: 'bip32', message: message, blockhash: blockhash, currency: currency, network: network, latest_index: latestIndex, required_signatures: requiredSignatures, signatures: []};

    xprivKeys.forEach(function (priv) {
        var wallet = bitcoinjs.HDWallet.fromBase58(priv);
        res.signatures.push({
            xpub: wallet.toBase58(false),
            signature: bitcoinjs.Message.sign(wallet.priv, message, bitcoinjs.networks[network]).toString('hex')
        });
    });
    return res;
};

function _verifyJbok(obj) {
    var message = obj.blockhash ? obj.blockhash + '|' + obj.message : obj.message;
    for (var i = 0; i < obj.signatures.length; i++) {
        var addr = obj.signatures[i].address;
        var sig = new Buffer(obj.signatures[i].signature, 'hex');
        if (!bitcoinjs.Message.verify(addr, sig, message))
            return false;
    }
    return true;
};

function _verifyBip32(obj) {
    var message = obj.message;
    var wallets = [];

    // Verify the xpub key
    for (var i = 0; i < obj.signatures.length; i++) {
        var wallet = bitcoinjs.HDWallet.fromBase58(obj.signatures[i].xpub);
        wallets.push(wallet);
        var addr = wallet.getAddress().toString();
        var sig = new Buffer(obj.signatures[i].signature, 'hex');
        if (!bitcoinjs.Message.verify(addr, sig, message))
            return false;
    }
    return true;
};

function _getAddressesJbok(obj) {
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

function _getAddressesBip32(obj) {
    var addresses = [];
    var wallets = [];

    obj.signatures.forEach(function(signature) {
        wallets.push(bitcoinjs.HDWallet.fromBase58(signature.xpub));
    });

    // Verify the addresses generated from them
    for (var i = 0; i <= obj.latest_index; i++) {
        var publicKeys = [];
        var address = null;
        wallets.forEach(function(wallet) {
            publicKeys.push(wallet.derive(i).pub);
        });
        if (wallets.length === 1) {
            // Simple derivation path
            address = wallets[0].derive(i).getAddress(bitcoinjs.networks[obj.network].scriptHash).toString();
        } else if (wallets.length > 1) {
            var script = bitcoinjs.Script.createMultisigScriptPubKey(obj.required_signatures, publicKeys);
            var hash = bitcoinjs.crypto.hash160(new Buffer(script.buffer));
            address = new bitcoinjs.Address(hash, bitcoinjs.networks[obj.network].scriptHash).toString();
            addresses.push(address);
        } else {
            throw new Error('need 1 or more wallets');
        }
    }
    return addresses;
};

module.exports.signAll = signAll;
module.exports.verifySignatures = verifySignatures;
module.exports.getAddresses = getAddresses;
module.exports.getBalance = getBalance;