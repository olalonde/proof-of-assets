
# Proof of Assets

*Proof of Assets* specification and Javascript implementation.

Proof of Assets (PoA) is a scheme designed to let entitites (operators)
prove that they control a given amount of Bitcoin or other blockchain based
cryptocurrency. 

The Proof of Assets scheme can be used as part of the broader 
[Proof of Solvency][pos] scheme.

[pos]: https://github.com/olalonde/proof-of-solvency

[Proof of Assets online tools](http://olalonde.github.io/proof-of-assets)

**Table of Contents**

- [Install](#install)
- [Usage](#usage)
- [Specification](#specification)
  - [Serialized data formats (draft)](#serialized-data-formats-draft)
  - [Implementations](#implementations)
  - [Publishing protocol](#publishing-protocol)
  - [Known limitations](#known-limitations)

**WORK IN PROGRESS**:

- Only supports bitcoind at the moment
- Read-only HD wallets can plug-in directly once the one-time signature calculation of the privkeys are available.

Beer fund: **1ECyyu39RtDNAuk3HRCRWwD4syBF2ZGzdx**

## Install

```
npm install -g aproof
```

## Usage

```
Generate asset proof

$ aproof signall -h "localhost" -p 8332 --user "rpcuser" --pass "rpcpass" "MtGox.com BTC assets" > btc-asset-proof.out.json

Verify signatures

$ aproof verifysignatures btc-asset-proof.out.json

Verify signatures and show total balance of all addresses

$ aproof balance -h "localhost" -p 8332 --user "rpcuser" --pass "rpcpass" btc-asset-proof.out.json

Browser build:

$ browserify ./lib/index.js --standalone aproof > build/aproof.js
```

## Specification

WORK IN PROGRESS...

The assets proof is done by signing a message with all the private
keys of a Bitcoin wallet.  Alternatively, assets proof can publish
the signature of the xpub's private keys and all the generated addresses
from which are derived from them.

The message to sign is `blockhash + '|' + message`. Where `+` represents
concatenation.

`blockhash` represents the latest block hash (with at least 6
confirmations) of the `currency`'s blockchain.

This block hash can be used by verifiers to determine how long ago the
PoA was produced. A PoA that was produced a long time ago could indicate
that an operator lost the keys of its cold wallet for example. 

Verifiers should issue warnings if a PoA is more than X (to be
determined) days old or if the blockhash was omitted.

`message` is an arbitrary message ([Proof of Solvency][pos] requires it to be
the domain for which the proof is valid).

### Example serialized data formats for jbok (Just a Bundle of Keys) (draft)

```json
{
    "type": "jbok",
    "message": "website.com",
    "blockhash": "000000000000000033a7e88bdaca0b14b190cced46d0c5667b27bd82d429792f",
    "currency": "XBT",
    "network": "bitcoin",
    "signatures": [
        {
            "address": "17L35DETf6qguDgHRm4HSi98zjYS3tXMkV",
            "signature": "1c9454982d031c3e3c55679c742c0aeec2eda4de5e317c458523d097ae42a8f98a4092eb193e5f7708a84625436c1416debbcb639843c2c9378146124d022450ae"
        },
        {
            "address": "1PeyEqgDzkFDh3cfAeELEm6erCmvizYF87",
            "signature": "1cedeb4ced1a02da89dc7fa1374290684952fbf2dc77858434112120fb23ab245d6924198dd99127d00d212d3ad5ec89e48f45e7495828f5dfd9d1eccb6be7ef30"
        },
        {
            "address": "19jdsX4xc3nz4nMNvaA3mAXsqAupbJAW8J",
            "signature": "1bb3c540ea4a6e4af5faeecc73c2dc532d204a7f39d886ef718da8d41d1684516737c1c7a4c502a08ec2d114fdac98d2f99d4fb92536e31b8966230ed4bc3a79f5"
        }
    ]
}
```

### Example serialized data formats for bip32 (draft)

```json
{
    "type": "bip32",
    "message": "website.com",
    "blockhash": "000000000000000033a7e88bdaca0b14b190cced46d0c5667b27bd82d429792f",
    "currency": "XBT",
    "network": "bitcoin",
    "required_signatures": 2,
    "signatures": [
        {
            "xpub": "xpub6AHA9hZDN11k2ijHMeS5QqHx2KP9aMBRhTDqANMnwVtdyw2TDYRmF8PjpvwUFcL1Et8Hj59S3gTSMcUQ5gAqTz3Wd8EsMTmF3DChhqPQBnU",
            "signature": "1fe31f6871a7f00264e71b94e5ec63c94fa45c37b71b18f6a54006f77093c042732c422770b8141520da7d6dc6de74248ea6799462549d386751eb49fe2b137c8b"
        },
        {
            "xpub": "xpub6BAncmx64zH2wGABVkL51fX9xvvNEJ7sTqJgYUwquhx9XkjNtdN4JrAVqFXw6Kq6dw2uBoXN6eM7yPLSFaPCNZU7wP4Ka1shnt2TdbQeAeL",
            "signature": "20e69a3bc9d0b03f0e984dc0f6a7f81c9709e0b0f051db40a25755968532e2ded542dfdf67f66a200eb879139f2405d58105be3779c9d44441138e1a1af4adff67"
        },
        {
            "xpub": "xpub6A5aRmrWhFQNVx4vSWob9XRCzdavCFDr6kMW7VSRxMXUab91PWz2tUtc8WHa5Dtv9JixEv8sofXoLzoiTxXC1JQkSD6GoGEmUM7Xf9K45J5",
            "signature": "1f306a2f5699b0d44fe39d329916ec8f1f06a7cbcecfcba36be43f196c66a1b674687b727b98f30e0c0ddadcabac58d1aecca886874d0821321553fddff76559c6"
        }
    ],
    "addresses": [
        {
            "address": "3KUAE5URmYAwu6Wq1yfsGGXwb3dRsEh4aT",
            "index": 0
        },
        {
            "address": "3HgG3WhvqMa389QcrLia5enQbbdWhSYfmG",
            "index": 1
        },
        {
            "address": "3KponhoPCpwTqENkCBCqLjAqkr1DvHkWkt",
            "index": 2
        },
        {
            "address": "35ZxQm4QNx1j4jSsqDVdge9ZKrfCivivv2",
            "index": 3
        },
        {
            "address": "3HZ8a1iXPJ5pxaZt5qx8qyDdS7jCkVgfE6",
            "index": 10
        },
        {
            "address": "3GEVirvnnG3RHVL3r9hkkawDmW1VgA85BR",
            "index": 999
        }
    ]
}

### Implementations

#### Armory

See https://github.com/etotheipi/BitcoinArmory/pull/184/files

```
./extras/asset-proof.py  your.wallet "EmptyGox Btc Assets" emptygox-btc-assets.json
```

### Publishing protocol

See [olalonde/proof-of-solvency](https://github.com/olalonde/proof-of-solvency#assets-proof).

### Known limitations

TODO... (you could convince someone else to signmessage for you?) There
could be an online wallet which allows you to signmessage without
revealing the private key, etc. etc. Might be interesting to explore the
"make transaction"/"far future lock time" solution. Maybe combine
multiple solutions together?
