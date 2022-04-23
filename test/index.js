const MultiWallet = require('./../')
const config = require('./config')
const test = require('tape')
const { encode, decode } = require('bs58');

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
  const { mnemonic, bs58, multiWIF, hash, publicKey, signature, address, encrypted } = config[key]

  test(key, async tape => {
    tape.plan(10)

    let hdnode = new MultiWallet(key)
    hdnode.load(bs58);
  	tape.equal(hdnode.export(), multiWIF, 'export to MultiWIF');

    hdnode = new MultiWallet(key)
    hdnode.import(multiWIF)
    tape.equal(hdnode.export(), multiWIF, 'import from multiWif');

    hdnode = new MultiWallet(key);
  	hdnode.load(bs58)
  	tape.equal(hdnode.save(), bs58, 'load from saved');

    hdnode = new MultiWallet(key);
  	await hdnode.recover(mnemonic);

  	tape.equal(hdnode.save(), bs58, 'recover using mnemonic');

    hdnode = new MultiWallet(key);
  	hdnode.load(bs58);
  	let external = hdnode.account(0).external(0)
  	tape.equal(signature, encode(external.sign(hash)), 'sign');

    hdnode = new MultiWallet(key);
    hdnode.load(bs58);
    const neutered = hdnode.account(0).external(0).neutered;
    tape.equal(neutered.verify(decode(signature), hash, publicKey), true, 'verify');

    // doesn't work with ethereum
    // hdnode = new MultiWallet(key);
  	// hdnode.fromAddress(address, null, key);
  	// tape.equal(hdnode.verify(decode(signature), hash), true, 'bob can verify alice\'s signature using Alice\'s address');

  	hdnode = new MultiWallet(key);
  	hdnode.fromPublicKey(publicKey, null, key);
  	tape.equal(hdnode.verify(decode(signature), hash), true, 'bob can verify alice\'s signature using Alice\'s publicKey');

    hdnode = new MultiWallet(key);
    hdnode.load(bs58);
    let account = hdnode.account(0);
    tape.notEqual(account.internal(0).publicKey, account.external(0).publicKey, 'create internal/external chains');

    hdnode = new MultiWallet(key);
  	hdnode.lock('pasword', multiWIF)
  	tape.ok(hdnode.encrypted && !hdnode.publicKey, 'lock')

  	hdnode = new MultiWallet(key);
  	hdnode.unlock('pasword', encrypted)
  	tape.equal(hdnode.multiWIF, multiWIF, 'unlock')
  })
}
