
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

TODO:

- Only supports bitcoind at the moment 
- Doesn't support HD wallets yet

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

TODO...

The assets proof is done by signing an identifier with all private keys in a
Bitcoin wallet.

### Serialized data formats (draft)

```json
{
  "id": "MtGox.com BTC assets"
  "signatures": [
    { "address": "", "signature": "" }
  ],
  "currency": "BTC"
}
```

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
