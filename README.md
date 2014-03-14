# baproof - Bitcoin asset proof

Intended for use as part of
[olalonde/blind-solvency-proof](https://github.com/olalonde/blind-solvency-proof)
scheme.

Scheme and companion tool to prove how many bitcoins an entity controls.
Currently supports bitcoind (see [Alternative
implementations](#alternative-implementations)).

*NEW*: [web UI](http://olalonde.github.io/bitcoin-asset-proof)

Beer fund: **1ECyyu39RtDNAuk3HRCRWwD4syBF2ZGzdx**

## Install

```
npm install -g baproof
```

## Usage

```
Generate bitcoin asset proof

$ baproof signall -h "localhost" -p 8332 --user "rpcuser" --pass "rpcpass" "MtGox.com BTC assets" > btc-asset-proof.out.json

Verify signatures

$ baproof verifysignatures btc-asset-proof.out.json

Verify signatures and show total balance of all addresses

$ baproof balance -h "localhost" -p 8332 --user "rpcuser" --pass "rpcpass" btc-asset-proof.out.json

Browser build:

$ browserify ./lib/index.js --standalone baproof > build/baproof.js
```

## Assets proof

The assets proof is done by signing an identifier with all private keys in a
Bitcoin wallet.

## Embedded

```html
<meta name='x-assets-proof' data='/btc-assets.json'>
```

## File format (draft)

`btc-assets.json`

```json
{
  "id": "MtGox.com BTC assets"
  "signatures": [
    { "address": "", "signature": "" }
  ],
  "type": "BTC" (optional - defaults to bitcoin)
}
```

## Alternative implementations

### Armory

See https://github.com/etotheipi/BitcoinArmory/pull/184/files

```
./extras/asset-proof.py  your.wallet "EmptyGox Btc Assets" emptygox-btc-assets.json
```

## Limitations

TODO... (you could convince someone else to signmessage for you?) There
could be an online wallet which allows you to signmessage without
revealing the private key, etc. etc. Might be interesting to explore the
"make transaction"/"far future lock time" solution. Maybe combine
multiple solutions together?
