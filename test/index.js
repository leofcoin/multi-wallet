import MultiWallet from '../exports/index.js'
import config from './config.js'
import test from 'tape'
import base58 from '@vandeurenglenn/base58'
const { encode, decode } = base58

test('basic wallet functionality', async tape => {
  tape.plan(1)
  const wallet = new MultiWallet('leofcoin')
	const generated = await wallet.generate();
	tape.ok(generated, 'generate wallet');
})

test('basic wallet functionality', async tape => {
  tape.plan(1)
  const wallet = new MultiWallet('leofcoin:olivia')
	const generated = await wallet.generate();
	tape.ok(generated, 'generate wallet');
})

for (const key of Object.keys(config)) {
  const { mnemonic, bs58, multiWIF, hash, signature, address, encrypted, id } = config[key]

  test(key, async tape => {
    tape.plan(16)

    let hdnode = new MultiWallet(key);
    await hdnode.recover(mnemonic);
    
    let account = await hdnode.account(0);
    tape.equal(await hdnode.save(), bs58, 'recover using mnemonic');

    hdnode = new MultiWallet(key)
    await hdnode.load(bs58);
  	tape.equal(await hdnode.toMultiWif(), multiWIF, 'export to MultiWIF');

    hdnode = new MultiWallet(key)
    await hdnode.fromMultiWif(multiWIF)
    tape.equal(await hdnode.toMultiWif(), multiWIF, 'import from multiWif');

    hdnode = new MultiWallet(key);
  	await hdnode.load(bs58)
  	tape.equal(await hdnode.save(), bs58, 'load from saved');

    hdnode = new MultiWallet(key);
    await hdnode.recover(mnemonic);
    let external = await hdnode.account(0).external(0)
    tape.equal(await external.address, address, 'has correct address');

    hdnode = new MultiWallet(key);
  	await hdnode.load(bs58);
  	const alice = await hdnode.account(0).external(0)
  	tape.equal(signature, encode(alice.sign(hash)), 'alice can sign')

    hdnode = new MultiWallet(key);
    await hdnode.load(bs58);
    external = (await hdnode.account(0).external(0))
    tape.equal(external.neutered.verify(decode(signature), hash, alice.publicKey), true, 'bob can verify');

  	hdnode = new MultiWallet(key);
  	await hdnode.fromPublicKey(alice.publicKey, null, key);
  	tape.equal(hdnode.verify(decode(signature), hash), true, 'bob can verify alice\'s signature using Alice\'s publicKey');

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
    tape.isEqual(await hdnode.multiWIF, multiWIF, 'can load from multiWIF');

    external = await hdnode.account(0).external(0)
    tape.equal(await external.address, address, 'has correct address loading from WIF');
    account = await hdnode.account(0);
    tape.notEqual((await account.internal(0)).publicKey, (await account.external(0)).publicKey, 'create internal/external chains');

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
  	const exported = await hdnode.export('')
    hdnode = new MultiWallet(key);
    await hdnode.import('', exported);
  	tape.isEqual(await hdnode.multiWIF, multiWIF, 'export')

  	hdnode = new MultiWallet(key);
  	await hdnode.import('', encrypted)
  	tape.equal(await hdnode.multiWIF, multiWIF, 'import')

    hdnode = new MultiWallet(key);
    await hdnode.fromMultiWif(multiWIF);
  	await hdnode.lock('')
  	tape.ok(!hdnode.privateKey, 'lock')

  	await hdnode.unlock('')
  	tape.equal(await hdnode.multiWIF, multiWIF, 'unlock')

    tape.equal(await hdnode.id, id, 'id')
  })
}
