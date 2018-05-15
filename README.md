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
import MultiWallet from 'multi-signature';

const data = 'tx';
const key = '1234';
const version = 0x00;
const codec = 0x01;

const multi = new MultiWallet({<version>, <codec>, <BIP32>});

const signature = multi.sign(<data>, <key>); // base58 encoded MultiSignature

// base58 encoded string
const exported = multi.export() // or multi.save()

const multi2 = new MultiWallet({version, codec, BIP32});

// import from exported
multi2.import(exported) // or multi2.load(exported, <network>)

multi2.verify(signature, data, key); // returns boolean

multi2.encoded; // base58 encoded string
multi2.decoded // { version, codec, data }
```
## use case
Future proof cryptocurrency wallet (wallets are versionized & each version should be supported as long as possible (with exceptions)).
In short:
- disables the need for a "fork" when changing wallet behavior (no drop in computing power).
- nodes that aren't updated can (at least for some time) contribute to the network by handling other unupdated node transactions.
- updated nodes can still handle older nodes their transactions (until some point in time or whenever an vulnerability is found.)
- flag vulnerable versions by sending a flagMessage (flags are send to every node & accepted only when 3/4 off total nodes agree, this results into an lockdown off the flagged node, all other nodes will ignore it untill the flagged has updated to the needed version).


## API
TODO...

## LICENSE
Copyright (c) 2018 vandeurenglenn
