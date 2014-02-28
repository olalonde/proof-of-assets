WORK IN PROGRESS. See [olalonde/blind-liability-proof](https://github.com/olalonde/blind-liability-proof)

# bitcoin-asset-proof

Scheme and companiontool to prove how many bitcoins someone controls.

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

## Limitations

TODO... (you could convince someone else to signmessage for you?) There
could be an online wallet which allows you to signmessage without
revealing the private key, etc. etc. Might be interesting to explore the
"make transaction"/"far future lock time" solution. Maybe combine
multiple solutions together?
