WORK IN PROGRESS. See [olalonde/blind-liability-proof](https://github.com/olalonde/blind-liability-proof)

# bitcoin-asset-proof

Scheme and companiontool to prove how many bitcoins someone controls.

## Install

```
npm install -g baproof
```

## Usage

```
baproof signall signall -h "localhost" -p 8332 --user "rpcuser" --pass "rpcpass" "MtGox.com BTC assets" > btc-assets.json
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
