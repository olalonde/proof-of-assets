var index = require('../lib/index.js');
var bitcoinjs = require('bitcoinjs-lib');
var assert = require('assert');

describe('Test private key signatures and verify the proof', function() {
    it('Should perform all available functions successfully', function(done) {
        var keys = [
            'xprv9wHokC2KXdTSpEepFcu53hMDUHYfAtTaLEJEMyxBPAMf78hJg17WhL5FyeDUQH5KWmGjGgEb2j74gsZqgupWpPbZgP6uFmP8MYEy5BNbyET',
            'xprv9xBSDGRCEcijin5iPio4eXaRQu5spqQ26cP5k6YEMNRAexQEM63om3r1yxDFgHE1yQ7f2Kvpcg5JNm7DMFPsEhkgkKZWWMf1D5q4YRAvgu2',
            'xprv9w6E2GKcrsr5HTzTLVGanPUUSbkRnnVzjXRuK72pQ1zVhnorqyfnLga8HEMcHpW8K5QMtf4ci5TiauZnTEmpqWvxcoHGMzo9g7HDmvwPixF'
        ];
        var addresses = [
            {address: '3KUAE5URmYAwu6Wq1yfsGGXwb3dRsEh4aT', index: 0},
            {address: '3HgG3WhvqMa389QcrLia5enQbbdWhSYfmG', index: 1},
            {address: '3KponhoPCpwTqENkCBCqLjAqkr1DvHkWkt', index: 2},
            {address: '35ZxQm4QNx1j4jSsqDVdge9ZKrfCivivv2', index: 3},
            {address: '3HZ8a1iXPJ5pxaZt5qx8qyDdS7jCkVgfE6', index: 10},
            {address: '3GEVirvnnG3RHVL3r9hkkawDmW1VgA85BR', index: 999}
        ];
        var signatures = [
            '1fe31f6871a7f00264e71b94e5ec63c94fa45c37b71b18f6a54006f77093c042732c422770b8141520da7d6dc6de74248ea6799462549d386751eb49fe2b137c8b',
            '20e69a3bc9d0b03f0e984dc0f6a7f81c9709e0b0f051db40a25755968532e2ded542dfdf67f66a200eb879139f2405d58105be3779c9d44441138e1a1af4adff67',
            '1f306a2f5699b0d44fe39d329916ec8f1f06a7cbcecfcba36be43f196c66a1b674687b727b98f30e0c0ddadcabac58d1aecca886874d0821321553fddff76559c6'
        ];
        var type = 'bip32';
        var message = 'I am the very model of a modern major general.';
        var blockhash = '000000000000000033a7e88bdaca0b14b190cced46d0c5667b27bd82d429792f';
        var currency = 'XBT';
        var network = 'bitcoin';

        var proof = index.signAll(type, keys, message, blockhash, currency, network);
        proof.addresses = addresses;

        assert(proof.type === type);
        assert(proof.message === message);
        assert(proof.blockhash === blockhash);
        assert(proof.currency === currency);
        assert(proof.network === network);
        assert(proof.signatures instanceof Array);
        proof.signatures.forEach(function(signature, i) {
            assert(signature.signature === signatures[i]);
        });
        assert(index.verifySignatures(proof));
        proof.addresses.forEach(function(address, i) {
            assert(address.address === addresses[i].address);
        });
        index.getBalance(index.getAddresses(proof), network, function(err, balance) {
            assert(!err);
            assert(balance === 0);
            return done();
        });
    });
});