# multi-wallet

[![Build Status](https://img.shields.io/travis/VandeurenGlenn/multi-wallet/master.svg?style=for-the-badge)](https://travis-ci.org/vandeurenglenn/multi-wallet)
[![npm](https://img.shields.io/npm/dt/multi-wallet.svg?style=for-the-badge)](https://www.npmjs.com/package/multi-wallet)
[![David](https://img.shields.io/david/vandeurenglenn/multi-wallet.svg?style=for-the-badge)](https://github.com/vandeurenglenn/multi-wallet)
[![npm](https://img.shields.io/npm/v/multi-wallet.svg?style=for-the-badge)](https://www.npmjs.com/package/multi-wallet)

> Identifiable wallet <version><codec><wallet>

## install
### npm
```sh
npm i multi-wallet --save
```
### yarn
```sh
yarn add multi-wallet
```

## usage
```js
import MultiWallet from 'multi-wallet';

const multi = new MultiWallet(<network>, <BIP32>).load(<bs58>);
const account = multi.account(0);
const external = account.external(0); // first external address

const internal = account.internal(0); // first internal address (used to receive change)

const signature = external.sign(<data>, <key>) // returns base58 encoded MultiSignature
const address = external.address // returns bs58check encoded address (without privateKey)

const multi2 = new MultiWallet(<network>, <BIP32>).fromAddress(address);


multi2.verify(signature, data); // returns boolean

// base58 encoded string
const exported = multi.export() // or multi.save() returns wif

// import from exported
multi.import(exported) // import wif

```
## use case
Future proof cryptocurrency wallet (wallets are versioned & each version should be supported as long as possible (with exceptions)).
In short:
- disables the need for a "fork" when changing wallet behaviour (no drop in computing power).
- nodes that aren't updated can (at least for some time) contribute to the network by handling other not updated node transactions.
- updated nodes can still handle older nodes their transactions (until some point in time or whenever an vulnerability is found.)
- flag vulnerable versions by sending a flag Message (flags are send to every node & accepted only when 3/4 off total nodes agree, this results into an lockdown off the flagged node, all other nodes will ignore it until the flagged one has updated to the needed version).


## API
TODO...

## Key derivation

Mnemonic generation uses the English BIP39 wordlist with 256 bits of entropy
(24 words), and recovery validates the BIP39 checksum before deriving the
standard BIP39 seed and BIP32 keys. The `password` argument to `generate()` and
`recover()` is the BIP39 passphrase; it must be identical during recovery.

This changes mnemonic compatibility: phrases created by older versions may
not be valid BIP39 and may derive different keys. Before upgrading, back up
existing wallets using their existing save/export format and verify recovered
addresses against known addresses before using them.
Addresses derived by older versions may differ because those versions used a
non-standard child-index encoding. Verify recovered addresses against known
addresses before using the wallet. Saved wallet and MultiWIF formats are
wallet-specific formats rather than standard BIP32 extended-key encodings.
Standalone private/public keys and wallet IDs do not contain a BIP32 chain
code, so they cannot derive child keys unless the chain code is supplied.

## Build for browser
rollup.config.js
```js
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import builtins from 'rollup-plugin-polyfill-node';

export default {
    input: [
      './node_modules/multi-wallet/exports/index.js'
    ],
    output: {
      format: 'es',
      dir: './dist',
    },
    plugins: [nodeResolve(), commonjs(), json(), builtins()],
  }
```

## LICENSE
Copyright (c) 2019 vandeurenglenn
