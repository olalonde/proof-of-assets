
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
keys in a Bitcoin wallet. A signature can also be done using a private
extended key (from HD wallets) and published with its chain code (TODO).

### Serialized data formats (draft)

```json
{
  "message": "some message",
  "currency": "BTC",
  "signatures": [
    { "signature": "" },
    { "signature": "", "chain": "" }
  ]
}
```

The asset proof may also optionally contain a `pos` property which is a JSON
object. The `Proof Of Solvency` makes use of this field to impose how
a message should be computed.

```json
{
  "pos": {
    "id": "some identifier",
    "domain": "somedomain.com"
  }
}
```

With the above meta information, PoS verifies that the message is equal
to domain + ' ' + id. PoS also verifies that the assets proof is only
valid for the given domain.

This would prevent a malicious site from "stealing" another site's proofs.

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
