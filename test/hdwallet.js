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
            '20ca3b927905f5a8cd89beb9294d9c77394352ed2176960ad9f238b4aa092379a907eb2b5f488e1770a5aab10979d84cf66ad339e69c1d400ad0498d518373e2c1',
            '1f4cf89a627b5ab664b8d668a04550e051693a3b8e1519b2b279cce93f885af0120d0be2be2217cd755a1b2dc4927cfbdb32cbcbe1c48cd4571a919a55408bb60e',
            '1f7bb9f77051e69a630aa577eeb3bd825d493e5a018336da36a03dd405009df8284caf023f1757428ec36f3ca80cf2be8e56962f235f7be25fad9c8b607d1b46b5'
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

        console.log(JSON.stringify(proof, null, 4));
    });
});