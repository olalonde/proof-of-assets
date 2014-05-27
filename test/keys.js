var index = require('../lib/index.js');
var bitcoinjs = require('bitcoinjs-lib');
var assert = require('assert');

describe('Test private key signatures and verify the proof', function() {
    it('Should perform all available functions successfully', function(done) {
        var keys = [
            '5JtGuPmgSMvNCMZW9XQYZyvQWdPh2NCaWgR1VsPc5QoyfLDoX9a',
            '5JqtAG8sXi3B9q1GCbuPJ8HmrfYAFHqR2apwaXZvte7apxHvTcX',
            '5KZtxF1tCjKyGFdTBTaaNaEg1T4RFQySujdQ8Dt7mW8UdoqJy92'
        ];
        var addresses = [
            '17L35DETf6qguDgHRm4HSi98zjYS3tXMkV',
            '1PeyEqgDzkFDh3cfAeELEm6erCmvizYF87',
            '19jdsX4xc3nz4nMNvaA3mAXsqAupbJAW8J'
        ];
        var signatures = [
            '1c9454982d031c3e3c55679c742c0aeec2eda4de5e317c458523d097ae42a8f98a4092eb193e5f7708a84625436c1416debbcb639843c2c9378146124d022450ae',
            '1cedeb4ced1a02da89dc7fa1374290684952fbf2dc77858434112120fb23ab245d6924198dd99127d00d212d3ad5ec89e48f45e7495828f5dfd9d1eccb6be7ef30',
            '1bb3c540ea4a6e4af5faeecc73c2dc532d204a7f39d886ef718da8d41d1684516737c1c7a4c502a08ec2d114fdac98d2f99d4fb92536e31b8966230ed4bc3a79f5'
        ];
        var type = 'jbok'; //(just a bunch of keys) wallet https://bitcoin.org/en/developer-guide#loose-key-wallets
        var message = 'I am the very model of a modern major general.';
        var blockhash = '000000000000000033a7e88bdaca0b14b190cced46d0c5667b27bd82d429792f';
        var currency = 'XBT';
        var network = 'bitcoin';

        var proof = index.signAll(type, keys, message, blockhash, currency, network);

        assert(proof.type === type);
        assert(proof.message === message);
        assert(proof.blockhash === blockhash);
        assert(proof.currency === currency);
        assert(proof.network === network);
        assert(proof.signatures instanceof Array);
        proof.signatures.forEach(function(signature, i) {
            assert(signature.address === addresses[i]);
            assert(signature.signature === signatures[i]);
        });
        assert(index.verifySignatures(proof));
        assert(JSON.stringify(index.getAddresses(proof)) ===  JSON.stringify(addresses));  // Beware of null !== undefined using this method to compare
        index.getBalance(index.getAddresses(proof), network, function(err, balance) {
            assert(!err);
            assert(balance === 0);
            return done();
        });

        return done();
    });
});