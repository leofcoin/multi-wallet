const test = require('tape');
const MultiHDWallet = require('./');
const { encode, decode } = require('bs58');
const { mnemonic, bs58, multiWIF, hash, signature, publicKey, pub, address, chainCode, encrypted } = {
	mnemonic: 'noble section royal vintage space tool devote tag also fluid alone electric',
	bs58: '5BycwKbGxPkhDsZrdDUcTgQf9exz41y6ASPMgbYigHxtVARLTmUd67zibeKDCNBzqzjdSmER7AHLH22nf7toiUxGpMCAEo8UYmyQKzfWfzcFUVfJ',
	multiWIF: '12nSSi35DyW2iMZCUj1Nk2hLaP9S1uVSyziSvGT6uJQD9rNRvj87mXaacmtbePPNfSFjjmnzzJcYHsHTs',
	hash: Buffer.alloc(32, 1),
	publicKey: '033f2870261a1f6e2a4a82ceb2032432c4fd606e818caab4ed9e8ec29f3c6d21ff',
	signature: '12KN9pRvs96voUUS2SuTSwgfGCrTcpm8TyoaQN9Dx8aHKeYKV8QzJ8EXxreUrCeraSFwtPk8MUQSjP6cF1mpXQwUwcyV',
	pub: '03eadd67d69c020878c1cd7b35e0c2bbb847b48edbbb9858468e8065dcb3106c1d',
	address: '7K3pFGxGchyvW7LT2wpzVMZgHcRfmPRKXQKChPyY2GoQ5R9PSc',
	encrypted: 'U2FsdGVkX18sZdsqa0bov0Ur0UGQwKe/IZJXAtyccj3mFS+D2sPH7wm5/ew3YdpDL5nBtBI0EJb83/iFL0Say9R+J8P2K4qbzg9SpMxfSrR76V/0pWGHZXkxNSKDJIb2G43TjmIw4OXsk0+Xiod+Mw=='
};

const before = tape => {
	return new MultiHDWallet('leofcoin:olivia');
};
/**
 * @test
 * @module MultiHDWallet
 * @extends HDWallet
 */
test('MultiWallet', tape => {
	tape.plan(12);
	let hdnode = before(tape);
	const generated = hdnode.generate();
	console.log(hdnode.id);
	tape.ok(generated, 'generate wallet');
	
	hdnode = before(tape);
	hdnode.load(bs58);
	tape.equal(hdnode.export(), multiWIF, 'export to MultiWIF');
	
	hdnode = before(tape);
	hdnode.import(multiWIF);
	tape.equal(hdnode.export(), multiWIF, 'import from multiWif');

	hdnode = before(tape);
	hdnode.load(bs58)
	tape.equal(hdnode.save(), bs58, 'load from saved');

	hdnode = before(tape);
	hdnode.recover(mnemonic);
	tape.equal(hdnode.save(), bs58, 'recover using mnemonic');

	hdnode = before(tape);
	hdnode.load(bs58);
	let account = hdnode.account(0)
	let external = account.external(0)
	tape.equal(signature, external.sign(hash), 'sign');

	hdnode = before(tape);
	hdnode.load(bs58);
	account = hdnode.account(0);
	const neutered = account.external(0).neutered;
	tape.equal(neutered.verify(signature, hash, publicKey), true, 'verify');

	hdnode = before(tape);
	hdnode.fromAddress(address, null, 'leofcoin:olivia');
	tape.equal(hdnode.verify(signature, hash), true, 'bob can verify alice\'s signature using Alice\'s address');

	hdnode = before(tape);
	hdnode.fromPublicKey(publicKey, null, 'leofcoin:olivia');
	tape.equal(hdnode.verify(signature, hash), true, 'bob can verify alice\'s signature using Alice\'s publicKey');

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
