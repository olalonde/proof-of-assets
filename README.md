
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
- Doesn't support HD wallets yet


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
keys of a Bitcoin wallet or alternatively, with the private
master key of an HD wallet and published alongside its chain code.

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

### Serialized data formats (draft)

```json
{
  "blockhash": "",
  "message": "",
  "currency": "BTC",
  "signatures": [
    { "signature": "", "address": "" },
    { "signature": "", "address": "", "chain": "" }
  ]
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
