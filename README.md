# multi-wallet
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

## LICENSE
Copyright (c) 2018 vandeurenglenn
