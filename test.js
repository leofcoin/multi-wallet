const test = require('tape');
const MultiHDWallet = require('./');
const { encode, decode } = require('bs58');
const { mnemonic, bs58, multiWIF, hash, signature, publicKey, pub, address, chainCode, encrypted } = {
	mnemonic: 'raise account antique resource endless summer grocery blood dove dove wise draw',
	bs58: '5BycwBHaGerBsZZjFXyCaqA4FEmCavbfVghWxMhxwcaR16MRFVBWtmyW62qYUQw7ZwMaNLmpUFTfzNwEeL7yLLV5eUAodS2gmnyGzU48Zhuq4QMz',
	multiWIF: '1EyinruShNm71XE1Z8NF6n8LAJRVggD2j3LLK4PpG62Y9uUo3GkTQo9LmextmmjpaTKH2PwaGufmcsNHCo71TMDxuy7FN56fYRC9TN2iWXztvge4hCLX',
	hash: Buffer.alloc(32, 1),
	publicKey: '038a58a7cecc6546b5b1bd8d77407dbf282c266d6645c6646d5b1535b86ed21ce6',
	signature: '12KMVnXXEaAqoNVqJY84DyYAJ1xmNm7BacmWLBTwXu7APn2N5KmNF6cPRh7vWxcGSBnonqxBu5JWT3omqnDBUj5Ej9ex',
	pub: '028e89137a8d309770e0ac86d13491e8f0fde7bfe84f2d84453e94cfc09864df5b',
	address: '7tAQCo1Qt7USJMyBxLup1o5cJzeBPmMH384aUufwK8zjG1s74V',
	encrypted: 'U2FsdGVkX19jcisPPDlHcmQE6tv39IuE+ClODcblL/qshpKz27FOfMcSe/I+KQUZCcfWh9U/5DMNr0VjRcEHlfgBQ8Fy/1dFsC/x3mdOKYls5M8bH6QtkWV6b6yctMCsh8EYmQ8U0MmYKUSVAJBGfkqw81s6a27yuVgmsEtD4tE3iZLpHCe5/R1hUC0DhifQ'
};

const before = tape => {
	return new MultiHDWallet('leofcoin');
};
/**
 * @test
 * @module MultiHDWallet
 * @extends HDWallet
 */
test('MultiWallet', async tape => {
	tape.plan(12);
	let hdnode = before(tape);
	const generated = await hdnode.generate();
	const id = hdnode.id
	let a = hdnode.account(0).external(0)
	hdnode = before(tape)
	
	hdnode.fromId(id)

	tape.ok(generated, 'generate wallet');
	
	hdnode = before(tape);
	hdnode.load(bs58);
	tape.equal(hdnode.export(), multiWIF, 'export to MultiWIF');
	a = hdnode.account(0).external(0)
	
	hdnode = before(tape);
	
	hdnode.import(multiWIF);
	a = hdnode.account(0).external(0)
	tape.equal(hdnode.export(), multiWIF, 'import from multiWif');
	
	
	hdnode = before(tape);
	hdnode.load(bs58)
	tape.equal(hdnode.save(), bs58, 'load from saved');

	hdnode = before(tape);
	await hdnode.recover(mnemonic);
	a = hdnode.account(0).external(0)
	
	tape.equal(hdnode.save(), bs58, 'recover using mnemonic');

	hdnode = before(tape);
	hdnode.load(bs58);
	let account = hdnode.account(0)
	let external = account.external(0)
	tape.equal(signature, encode(external.sign(hash)), 'sign');

	hdnode = before(tape);
	hdnode.load(bs58);
	account = hdnode.account(0);
	const neutered = account.external(0).neutered;
	tape.equal(neutered.verify(decode(signature), hash, publicKey), true, 'verify');

	hdnode = before(tape);
	hdnode.fromAddress(address, null, 'leofcoin');
	tape.equal(hdnode.verify(decode(signature), hash), true, 'bob can verify alice\'s signature using Alice\'s address');

	hdnode = before(tape);
	hdnode.fromPublicKey(publicKey, null, 'leofcoin');
	tape.equal(hdnode.verify(decode(signature), hash), true, 'bob can verify alice\'s signature using Alice\'s publicKey');

	hdnode = before(tape);
	hdnode.load(bs58);
	account = hdnode.account(0);

	tape.notEqual(account.internal(0).publicKey, account.external(0).publicKey, 'create internal/external chains');

	hdnode = before(tape);
	hdnode.lock('pasword', multiWIF)
	tape.ok(hdnode.encrypted && !hdnode.publicKey, 'lock')

	hdnode = before(tape);
	hdnode.unlock('pasword', encrypted)
	tape.equal(hdnode.multiWIF, multiWIF, 'unlock')
});
