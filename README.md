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
standard BIP39 seed and BIP32 keys. `generate()` and `recover()` require an
explicit BIP39 passphrase of at least 12 characters; it must be identical
during recovery. The same 12-character minimum applies to wallet encryption
and backup passwords. This minimum does not make a predictable password strong:
use a randomly generated secret and keep it backed up.

`generateSecurePassword()` creates a 32-character password using
`crypto.getRandomValues` (192 bits of entropy). It accepts a custom length from
12 to 1024 characters and throws if secure randomness is unavailable; it never
falls back to `Math.random()`.

```js
import MultiWallet, { generateSecurePassword } from '@leofcoin/multi-wallet';

const wallet = new MultiWallet('leofcoin');
const bip39Passphrase = generateSecurePassword();
const mnemonic = await wallet.generate(bip39Passphrase);
```

Save the generated passphrase separately and securely; losing it derives a
different wallet. This is a breaking change in v5: phrases created with an
empty or shorter-than-12-character passphrase by older versions cannot be
recovered with the new API. Recover and back up those wallets using the
previous release before upgrading.

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

## Experimental post-quantum wallet

`PqWallet` is a separate wallet provider for the experimental `leofcoin:pq`
network. It derives ML-DSA-87 (FIPS 204) keys from the standard 64-byte BIP39
seed using HKDF-SHA512, with account indices encoded as canonical decimal
values. It uses the same derivation and chain-bound signing context as the
Leofcoin private-chain prototype.

A generated 24-word BIP39 mnemonic contains 256 bits of cryptographically
random entropy plus a checksum, so exhaustive search is infeasible when it is
generated normally and kept secret. The mnemonic itself is a bearer secret:
anyone who obtains it can recover the wallet if they also know the passphrase.
Never choose words yourself or store the phrase in an online account. A
passphrase of at least 12 characters is required and must be backed up exactly;
forgetting it derives a different wallet. No software wallet can honestly be
guaranteed “unhackable.”

```js
import {
  PqWallet,
  generateSecurePassword,
} from '@leofcoin/multi-wallet';

const wallet = new PqWallet(0);
const bip39Passphrase = generateSecurePassword();
const walletPassword = generateSecurePassword(); // keep distinct from the passphrase
const mnemonic = await wallet.generate(bip39Passphrase);
// Or recover with: await wallet.recover(mnemonic, bip39Passphrase)
wallet.bindChainId(chainId); // required before signing on a validated PQ chain
const signature = await wallet.sign(transactionDigest); // exactly 32 bytes
const encryptedBackup = await wallet.export(walletPassword);
```

`PqWallet` requires a BIP39 passphrase of at least 12 characters during
generation and mnemonic recovery. Use a high-entropy secret and store it
separately from the mnemonic; losing it means the mnemonic alone derives a
different wallet. An encrypted seed backup can still restore the wallet with
its separate backup password.

The password passed to `export()`, `import()`, `lock()`, or `unlock()` protects
the encrypted backup using scrypt (N=2^15, r=8, p=1) and AES-256-GCM. Use a
unique, high-entropy password; a password meeting only the 12-character
minimum can still be guessable. Keep it distinct from the BIP39 passphrase.
`PqWallet` does not replace the existing BIP32/secp256k1 `MultiWallet` and is
not compatible with classical networks. It is experimental: wallet-side
signatures alone do not make a network quantum-resistant, and the PQ chain
prototype is not a mainnet or production migration. Transport encryption and
BLS/DKG/ECDH components remain classical.

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
